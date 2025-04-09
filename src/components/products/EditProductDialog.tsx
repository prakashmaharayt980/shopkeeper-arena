import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import RemoteServices from '@/RemoteService/Remoteservice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Upload, Image as ImageIcon } from "lucide-react";

const CATEGORY_OPTIONS = [
  'Electronics', 'Furniture', 'Clothing', 'Books', 'Flower',
  'Shoes', 'Toys', 'Sports', 'Beauty', 'Automotive',
  'Health', 'Jewelry', 'Grocery', 'Stationery', 'Home Decor',
  'Plants', 'Painting', 'Handicraft', 'Kitchenware', 'Pet Supplies',
  'Book'
] as const;

const GENRE_OPTIONS = [
  'Fiction', 'Non-fiction', 'Biography', 'History', 'Science', 'Art', 'Other'
] as const;

const RATING_OPTIONS = [
  { value: '1', label: '1 Star' },
  { value: '2', label: '2 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '5', label: '5 Stars' },
] as const;

// Update the Product interface so media is now an array of Files (or strings if coming from backend)
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  genre?: string;
  author?: string;
  stock: number;
  status: string;
  rating: string;
  imageUrl: string;
  media: File[]; // store multiple files
}

interface EditProductDialogProps {
  product: Partial<Product>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (product: Product) => void;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  product,
  open,
  onOpenChange,
  onSave,
}) => {
  // Initialize media as an array if not already provided
  const initialProduct: Product = {
    id: product.id || 0,
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    category: product.category || '',
    genre: product.genre || '',
    author: product.author || '',
    stock: product.stock || 0,
    status: product.status || 'inactive',
    rating: product.rating || '',
    imageUrl: product.imageUrl || '',
    media: product.media || [],
  };
  const [formData, setFormData] = useState<Product>(initialProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  
  const isNewProduct = !product.name;

  // Create object URLs for previews
  useEffect(() => {
    // Clean up previous object URLs to avoid memory leaks
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    // Create new object URLs
    const urls = formData.media.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);
    
    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData.media]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (field: keyof Product, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }));
  };

  // Handle multiple file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, media: [...prev.media, ...filesArray] }));
    }
  };

  // Remove a selected image by its index
  const removeImage = (index: number) => {
    setFormData(prev => {
      const newMedia = [...prev.media];
      newMedia.splice(index, 1);
      return { ...prev, media: newMedia };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enhanced validation
      const requiredFields = ['name', 'price', 'category'] as const;
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      // Add conditional validation for books
      if (formData.category === 'Books') {
        if (!formData.author || !formData.genre) {
          missingFields.push('author', 'genre' as any);
        }
      }

      if (missingFields.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        });
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const productFormData = new FormData();
      
      // Append basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'media') {
          productFormData.append(key, value.toString());
        }
      });

      // Append media files
      formData.media.forEach((file, index) => {
        productFormData.append(`media[${index}]`, file);
      });

      let response
      if(isNewProduct) {
        response = await RemoteServices.productAdd(productFormData);
      }
      else {
        response = await RemoteServices.productUpdate(productFormData, product.id);
      } 
      
      toast({
        title: isNewProduct ? "Product created" : "Product updated",
        description: `${formData.name} has been ${isNewProduct ? 'created' : 'updated'} successfully.`,
      });

      if (onSave) {
        onSave(formData);
      }
      onOpenChange(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save product.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Conditional rendering helper
  const isBookCategory = formData.category === 'Books';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isNewProduct ? 'Add New Product' : 'Edit Product'}
              {!isNewProduct && (
                <Badge variant={formData.status === 'active' ? 'default' : 'outline'} className="ml-2">
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {isNewProduct 
                ? 'Fill in the details to create a new product.' 
                : 'Make changes to the product information here.'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3 flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      NPR
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional fields for Books category */}
                {isBookCategory && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="author" className="text-right">
                        Author <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="genre" className="text-right">
                        Genre <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.genre}
                        onValueChange={(value) => handleSelectChange('genre', value)}
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENRE_OPTIONS.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="media">
              <Card>
                <CardContent className="p-4">
                  {/* Image URL input */}
                  <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="col-span-3"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* File upload */}
                  <div className="mb-4">
                    <Label className="block mb-2">Upload Images</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                      <input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="imageFile" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Drag and drop, or click to select files</p>
                        <p className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  {/* Image previews */}
                  {formData.media.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Selected Images ({formData.media.length})</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {formData.media.map((file, index) => (
                          <div key={index} className="relative group border rounded overflow-hidden aspect-square">
                            <img 
                              src={imagePreviews[index]} 
                              alt={`Preview ${index}`} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {file.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.media.length === 0 && formData.imageUrl === "" && (
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">No images added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="status"
                      checked={formData.status === 'active'}
                      onCheckedChange={handleStatusChange}
                    />
                    <Label htmlFor="status" className="cursor-pointer">
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">Rating</Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => handleSelectChange('rating', value)}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select a rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {RATING_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isNewProduct ? 'Create Product' : 'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};