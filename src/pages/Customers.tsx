
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Generate mock customer data
const customers = Array.from({ length: 50 }).map((_, i) => {
  const firstName = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Alex', 'Emma', 'James', 'Sophia'][Math.floor(Math.random() * 10)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'][Math.floor(Math.random() * 10)];
  return {
    id: i + 1,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    totalOrders: Math.floor(Math.random() * 20),
    totalSpent: (Math.random() * 1000 + 50).toFixed(2),
    lastOrderDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
    registrationDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    avatar: `https://i.pravatar.cc/150?img=${i % 70}`
  };
});

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const customersPerPage = 10;
  
  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    const searchLower = search.toLowerCase();
    return (
      search === '' || 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(search)
    );
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button>Export Customers</Button>
        </div>
        
        <div className="relative pb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email or phone..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-muted/50">
                      <td className="table-cell-padding">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: #{customer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-padding">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-padding">
                        <span className="font-medium">{customer.totalOrders}</span>
                      </td>
                      <td className="table-cell-padding">
                        <span className="font-medium">${customer.totalSpent}</span>
                      </td>
                      <td className="table-cell-padding">
                        {customer.lastOrderDate}
                      </td>
                      <td className="table-cell-padding">
                        {customer.registrationDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between space-x-6 mt-6">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{Math.min(filteredCustomers.length, indexOfFirstCustomer + 1)}</span> to{" "}
                <span className="font-medium">{Math.min(filteredCustomers.length, indexOfLastCustomer)}</span> of{" "}
                <span className="font-medium">{filteredCustomers.length}</span> customers
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
    </DashboardLayout>
  );
};

export default Customers;
