
import React, { useState } from 'react';
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

// Mock data
const products = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  description: `This is the description for product ${i + 1}. It's a great product with many features.`,
  price: (Math.random() * 100 + 10).toFixed(2),
  category: ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'][Math.floor(Math.random() * 5)],
  stock: Math.floor(Math.random() * 100),
  status: Math.random() > 0.2 ? 'active' : 'inactive',
  rating: (Math.random() * 5).toFixed(1),
  imageUrl: `https://picsum.photos/seed/${i + 1}/200/200`,
}));

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  
  const productsPerPage = 10;
  
  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = search === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button onClick={() => setEditingProduct({
            id: products.length + 1,
            name: '',
            description: '',
            price: '0.00',
            category: 'Electronics',
            stock: 0,
            status: 'active',
            rating: '0.0',
            imageUrl: '',
          })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
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
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Beauty">Beauty</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentProducts.map(product => (
                    <tr key={product.id} className="hover:bg-muted/50">
                      <td className="table-cell-padding">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-padding">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="table-cell-padding font-medium">${product.price}</td>
                      <td className="table-cell-padding">
                        <span className={product.stock < 10 ? 'text-destructive' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="table-cell-padding">
                        <Badge 
                          className={product.status === 'active' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-muted text-muted-foreground'
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="table-cell-padding">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </td>
                      <td className="table-cell-padding">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
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
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Simple pagination display logic
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={i}
                        variant={currentPage === pageToShow ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Products;
