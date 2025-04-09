import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Truck,
  Bell,
  Download,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  Package,
  ClipboardList
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
import RemoteServices from '@/RemoteService/Remoteservice';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await RemoteServices.AdminOrderView();
        if (res.status === 200) {
          setOrders(res.data);
          // customerId(res.data.userid);
        } else {
          toast({
            variant: "destructive",
            title: "Failed to load orders",
            description: "Please try again or contact support if the problem persists.",
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "We couldn't connect to the server. Please check your connection.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  const ordersPerPage = 10;

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      search === '' ||
      order.id.toString().toLowerCase().includes(search.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' || order.delivery_method.toLowerCase() === filter;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewCustomer = (order) => {
    RemoteServices.CustomerById(order.user).then((res) => {
      if (res.status === 200) {
        setSelectedCustomer({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email || 'Not provided',
          phone: res.data.phone_number || 'Not provided',
          address: res.data.address || 'Not provided',
          orderId: order.id,
          orderDate: order.created_at,
          paymentMethod: order.payment_method,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load customer details",
          description: "Please try again or contact support if the problem persists.",
        });
      }
    }

    );
    setShowCustomerDetails(true);
  };

  const handleCloseCustomerDetails = () => {
    setShowCustomerDetails(false);
  };

  const handleSendNotification = (order) => {
    toast({
      title: "Notification sent",
      description: `Delivery update sent for Order #${order.id}`,
    });
  };

  const handlestatusProduct = (order, newMethod) => {
    console.log("Order ID:", order.id);
    console.log("New Delivery Method:", newMethod);

    RemoteServices.updatestatus({status:newMethod}, order.id).then((res) => {  
      if (res.status === 200) {
        toast({
          title: "Order status updated",
          description: `Order #${order.id} updated to ${newMethod}`,
        });
        setOrders(prevOrders =>
          prevOrders.map(o => (o.id === order.id ? { ...o, status: newMethod } : o))
        );
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update order status",
          description: "Please try again or contact support if the problem persists.",
        });
      }
    });
  };

  const toggleExpandOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getDeliveryBadge = (method) => {
    switch (method.toLowerCase()) {
      case 'express':
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors">Express</Badge>;
      case 'standard':
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 transition-colors">Standard</Badge>;
      case 'next_day':
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors">Next Day</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return <CreditCard className="mr-2 h-4 w-4 text-yellow-500" />;
      case 'credit_card':
        return <CreditCard className="mr-2 h-4 w-4 text-blue-500" />;
      case 'paypal':
        return <CreditCard className="mr-2 h-4 w-4 text-indigo-500" />;
      default:
        return <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-muted-foreground mt-1">View and manage customer orders</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Orders
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-4 pb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or address..."
              className="w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Delivery method" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All delivery methods</SelectItem>
              <SelectItem value="express">Express delivery</SelectItem>
              <SelectItem value="standard">Standard delivery</SelectItem>
              <SelectItem value="next_day">Next day delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Order List</CardTitle>
            <CardDescription>
              {filteredOrders.length} orders found
              {search && ` matching "${search}"`}
              {filter !== 'all' && ` with ${filter} delivery`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {currentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {currentOrders.map(order => (
                      <Card key={order.id} className={`overflow-hidden border ${expandedOrder === order.id ? 'border-primary/50 shadow-md' : 'border-border'}`}>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleExpandOrder(order.id)}>
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Order #{order.id}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(order.created_at)} · 
                                {getDeliveryBadge(order.delivery_method)} · 
                                {formatCurrency(order.total_amount)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="hidden md:flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewCustomer(order);
                                }}
                                className="flex items-center gap-1"
                              >
                                <Users className="h-3.5 w-3.5" />
                                <span>Customer</span>
                              </Button>
                              {/* <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlestatusProduct(
                                    order,
                                   
                                  );
                                }}
                              >
                                <Truck className="h-4 w-4" />
                              </Button> */}

                              <Select 
                                onValueChange={(value) => handlestatusProduct(order, value)}
                                defaultValue={order.status}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="cancel">Cancel</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendNotification(order);
                                }}
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                            </div>
                            {expandedOrder === order.id ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {expandedOrder === order.id && (
                          <div className="p-4 pt-0 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <Users className="h-4 w-4" /> Customer Information
                                </h4>
                                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Address:</span> {order.shipping_address}
                                  </div>
                                  {order.email && (
                                    <div className="text-sm">
                                      <span className="font-medium">Email:</span> {order.email}
                                    </div>
                                  )}
                                  {order.phone && (
                                    <div className="text-sm">
                                      <span className="font-medium">Phone:</span> {order.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <Package className="h-4 w-4" /> Order Details
                                </h4>
                                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Order Date:</span> {formatDate(order.created_at)}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">Delivery Method:</span> {order.delivery_method}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">Payment Method:</span> 
                                    <span className="flex items-center gap-1 inline-flex ml-1">
                                      {getPaymentIcon(order.payment_method)}
                                      <span>{order.payment_method.replace('_', ' ')}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" /> Payment Summary
                                </h4>
                                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Subtotal:</span> {formatCurrency(order.subtotal)}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">Shipping Cost:</span> {formatCurrency(order.shipping_cost)}
                                  </div>
                                  <div className="text-sm font-medium">
                                    <span>Total Amount:</span> {formatCurrency(order.total_amount)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {order.notes && (
                              <div className="space-y-2 mt-4">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <ClipboardList className="h-4 w-4" /> Notes
                                </h4>
                                <div className="bg-muted/50 p-3 rounded-md">
                                  <p className="text-sm">{order.notes}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end mt-4 md:hidden">
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleViewCustomer(order)}
                                >
                                  <Users className="h-3.5 w-3.5 mr-1" />
                                  <span>Customer</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() =>
                                    handlestatusProduct(
                                      order,
                                      order.delivery_method === 'express' ? 'standard' : 'express'
                                    )
                                  }
                                >
                                  <Truck className="h-4 w-4 mr-1" />
                                  <span>Update Delivery</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSendNotification(order)}
                                >
                                  <Bell className="h-4 w-4 mr-1" />
                                  <span>Notify</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="mt-1">Try adjusting your search or filter settings</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredOrders.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium">
                    {Math.min(filteredOrders.length, indexOfFirstOrder + 1)}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(filteredOrders.length, indexOfLastOrder)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{filteredOrders.length}</span> orders
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
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
                          aria-label={`Page ${pageToShow}`}
                          aria-current={currentPage === pageToShow ? "page" : undefined}
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
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Details Modal - Now used only for additional customer details */}
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