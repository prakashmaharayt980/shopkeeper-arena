import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Star, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { EditProductDialog } from '@/components/products/EditProductDialog';
import RemoteServices from '@/RemoteService/Remoteservice';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define product interface for better type safety
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  stock: number;
  status: string;
  rating: string;
  imageUrl: string;
  media: File[] | null;
}

// Constants
const PRODUCTS_PER_PAGE = 10;
const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
const STATUS_OPTIONS = ['active', 'inactive'];

const Products = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  
  const { toast } = useToast();
  
  // Fetch product data
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await RemoteServices.productList();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load products. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Search products
  const searchProducts = useCallback(async (searchTerm: string) => {
    if (searchTerm === '') {
      fetchProducts();
      return;
    }
    
    try {
      const response = await RemoteServices.filterproductSearch(searchTerm);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to search products. Please try again.',
      });
    }
  }, [fetchProducts, toast]);
  
  // Filter products by status
  const filterByStatus = useCallback(async (status: string) => {
    if (status === 'all') {
      fetchProducts();
      return;
    }
    
    try {
      const response = await RemoteServices.filterproductStatus(status);
      setProducts(response.data);
    } catch (error) {
      console.error('Error filtering products:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to filter products. Please try again.',
      });
    }
  }, [fetchProducts, toast]);
  
  // Delete product
  const handleDeleteProduct = async (id: number) => {
    try {
      await RemoteServices.productDelete(id);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast({
        title: 'Product deleted',
        description: 'Product has been removed successfully.',
      });
      setDeleteProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
      });
    }
  };
  
  // Handle product save (create/update)
  const handleProductSave = (updatedProduct: Product) => {
    setProducts(prevProducts => {
      const index = prevProducts.findIndex(p => p.id === updatedProduct.id);
      if (index >= 0) {
        // Update existing product
        const newProducts = [...prevProducts];
        newProducts[index] = updatedProduct;
        return newProducts;
      } else {
        // Add new product
        return [...prevProducts, updatedProduct];
      }
    });
  };
  
  // Create a new product template
  const createNewProduct = (): Product => ({
    id: Math.max(0, ...products.map(p => p.id)) + 1,
    name: '',
    description: '',
    price: '0.00',
    category: 'Electronics',
    stock: 0,
    status: 'active',
    rating: '0',
    imageUrl: '',
    media: []
  });
  
  // Filter products based on search and category filter
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesCategory;
  });
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Pagination UI helper
  const getPaginationRange = (): number[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    
    if (currentPage >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }
    
    return Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
  };
  
  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (search !== '') {
        searchProducts(search);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [search, searchProducts]);
  
  // Render product table
  const renderProductTable = () => {
    if (isLoading) {
      return (
        <div className="py-12 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-muted mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      );
    }
    
    if (currentProducts.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={fetchProducts}>
            Reset Filters
          </Button>
        </div>
      );
    }
    
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentProducts.map(product => (
            <tr key={product.id} className="hover:bg-muted/50">
              <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        // onError={(e) => {
                        //   (e.target as HTMLImageElement).src = '/placeholder.png';
                        // }}
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">No image</div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {product.description || "No description"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="outline">{product.category}</Badge>
              </td>
              <td className="px-4 py-4 font-medium">₹{parseFloat(product.price).toFixed(2)}</td>
              <td className="px-4 py-4">
                <span className={product.stock < 10 ? 'text-destructive font-medium' : ''}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-4">
                <Badge 
                  variant={product.status === 'active' ? 'default' : 'secondary'}
                >
                  {product.status}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                  <span>{product.rating}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => setDeleteProduct(product)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button onClick={() => setEditingProduct(createNewProduct())}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
        {/* Filters section */}
        <div className="flex flex-col md:flex-row gap-4 pb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            filterByStatus(value);
          }}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Products table */}
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {renderProductTable()}
            </div>
            
            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="flex items-center justify-between space-x-6 mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{Math.min(filteredProducts.length, indexOfFirstProduct + 1)}</span> to{" "}
                  <span className="font-medium">{Math.min(filteredProducts.length, indexOfLastProduct)}</span> of{" "}
                  <span className="font-medium">{filteredProducts.length}</span> products
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <div className="flex items-center space-x-1">
                    {getPaginationRange().map(pageNumber => (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Edit/Add product dialog */}
      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null);
          }}
          onSave={handleProductSave}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteProduct(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteProduct && handleDeleteProduct(deleteProduct.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;