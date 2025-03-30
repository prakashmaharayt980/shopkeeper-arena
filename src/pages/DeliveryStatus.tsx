
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock delivery data
const deliveries = Array.from({ length: 15 }).map((_, i) => ({
  id: `DEL-${1000 + i}`,
  orderId: `ORD-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  address: `${100 + i} Main St, City ${i + 1}, Country`,
  status: ['pending', 'in-transit', 'delivered', 'failed'][Math.floor(Math.random() * 4)],
  estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  assignedTo: `Courier ${i % 5 + 1}`,
  trackingNumber: `TRK${1000000 + i * 11}`
}));

const DeliveryStatus = () => {
  const [search, setSearch] = useState('');
  const [filteredDeliveries, setFilteredDeliveries] = useState(deliveries);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value === '') {
      setFilteredDeliveries(deliveries);
    } else {
      setFilteredDeliveries(
        deliveries.filter(
          (delivery) =>
            delivery.orderId.toLowerCase().includes(value.toLowerCase()) ||
            delivery.customer.toLowerCase().includes(value.toLowerCase()) ||
            delivery.trackingNumber.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const updateDeliveryStatus = (id: string, newStatus: string) => {
    // In a real app, this would call an API to update the status
    setFilteredDeliveries(
      filteredDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
    
    toast({
      title: "Delivery status updated",
      description: `Delivery ${id} status changed to ${newStatus}`,
    });
  };

  const sendNotification = (id: string, customer: string) => {
    // In a real app, this would call an API to send a notification
    toast({
      title: "Notification sent",
      description: `Delivery update notification sent to ${customer}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge className="bg-success/20 text-success flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </Badge>
        );
      case 'in-transit':
        return (
          <Badge className="bg-blue-500/20 text-blue-500 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            In Transit
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-warning/20 text-warning flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-destructive/20 text-destructive flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Delivery Status</h1>
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            Manage Couriers
          </Button>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer or tracking..."
            className="w-full pl-8"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Estimated Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.orderId}</TableCell>
                    <TableCell>{delivery.customer}</TableCell>
                    <TableCell>{delivery.trackingNumber}</TableCell>
                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                    <TableCell>{delivery.estimatedDelivery}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateDeliveryStatus(
                            delivery.id, 
                            delivery.status === 'delivered' ? 'in-transit' : 'delivered'
                          )}
                        >
                          {delivery.status === 'delivered' ? 'Mark As In Transit' : 'Mark As Delivered'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendNotification(delivery.id, delivery.customer)}
                        >
                          Notify Customer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryStatus;
