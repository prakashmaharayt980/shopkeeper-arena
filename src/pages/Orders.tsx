
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package,
  CreditCard,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Truck,
  User,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderCustomerDetails from '@/components/orders/OrderCustomerDetails';
import { useToast } from '@/hooks/use-toast';

// Mock data with expanded customer information
const orders = Array.from({ length: 50 }).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  customerId: `CUST-${2000 + i}`,
  email: `customer${i + 1}@example.com`,
  phone: `+1 555-${100 + i}-${1000 + i}`,
  address: `${i + 123} Main St, City ${i % 10 + 1}, State ${i % 5 + 1}, 10${i % 10}${i % 9}${i % 8}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  status: ['pending', 'processing', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)],
  amount: `$${(Math.random() * 500 + 20).toFixed(2)}`,
  paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
  notes: Math.random() > 0.7 ? 'Gift package requested' : '',
  deliveryStatus: ['waiting', 'shipped', 'delivered', 'returned'][Math.floor(Math.random() * 4)]
}));

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const { toast } = useToast();

  const ordersPerPage = 10;
  
  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = search === '' || 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || order.status === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleViewCustomer = (order: any) => {
    setSelectedCustomer({
      id: order.customerId,
      name: order.customer,
      email: order.email,
      phone: order.phone,
      address: order.address,
      orderId: order.id,
      orderDate: order.date,
      paymentMethod: order.paymentMethod
    });
    setShowCustomerDetails(true);
  };

  const handleCloseCustomerDetails = () => {
    setShowCustomerDetails(false);
  };

  const handleSendNotification = (order: any) => {
    // In a real app, this would call an API to send a notification
    toast({
      title: "Notification sent",
      description: `Delivery update sent to ${order.customer} (${order.email})`,
    });
  };

  const handleUpdateDeliveryStatus = (order: any, newStatus: string) => {
    // In a real app, this would call an API to update the status
    toast({
      title: "Delivery status updated",
      description: `Order ${order.id} delivery status changed to ${newStatus}`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success/20 text-success">Delivered</Badge>;
      case 'processing':
        return <Badge className="bg-pending/20 text-pending">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-destructive/20 text-destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success/20 text-success">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500/20 text-blue-500">Shipped</Badge>;
      case 'waiting':
        return <Badge className="bg-orange-500/20 text-orange-500">Waiting</Badge>;
      case 'returned':
        return <Badge className="bg-red-500/20 text-red-500">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Button>Export Orders</Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="table-cell-padding whitespace-nowrap">{order.id}</td>
                      <td className="table-cell-padding">{order.customer}</td>
                      <td className="table-cell-padding">{order.date}</td>
                      <td className="table-cell-padding">{getStatusBadge(order.status)}</td>
                      <td className="table-cell-padding">{getDeliveryStatusBadge(order.deliveryStatus)}</td>
                      <td className="table-cell-padding font-medium">{order.amount}</td>
                      <td className="table-cell-padding">
                        <div className="flex items-center">
                          {order.paymentMethod === 'Credit Card' ? (
                            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                          )}
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="table-cell-padding">
                        {order.notes && (
                          <span className="text-sm text-muted-foreground">{order.notes}</span>
                        )}
                      </td>
                      <td className="table-cell-padding">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewCustomer(order)}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateDeliveryStatus(
                              order,
                              order.deliveryStatus === 'waiting' ? 'shipped' : 'delivered'
                            )}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSendNotification(order)}
                          >
                            <Bell className="h-4 w-4" />
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
                Showing <span className="font-medium">{Math.min(filteredOrders.length, indexOfFirstOrder + 1)}</span> to{" "}
                <span className="font-medium">{Math.min(filteredOrders.length, indexOfLastOrder)}</span> of{" "}
                <span className="font-medium">{filteredOrders.length}</span> orders
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <OrderCustomerDetails 
          open={showCustomerDetails} 
          onClose={handleCloseCustomerDetails} 
          customer={selectedCustomer} 
        />
      )}
    </DashboardLayout>
  );
};

export default Orders;
