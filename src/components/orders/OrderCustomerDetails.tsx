
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';

interface CustomerDetailsProps {
  open: boolean;
  onClose: () => void;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    orderId: string;
    orderDate: string;
    paymentMethod: string;
  };
}

const OrderCustomerDetails = ({ open, onClose, customer }: CustomerDetailsProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Details for order {customer.orderId}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarFallback className="text-xl bg-primary/20 text-primary">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Shipping Address</p>
              <p className="text-sm text-muted-foreground">{customer.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Order Date</p>
              <p className="text-sm text-muted-foreground">{customer.orderDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">{customer.paymentMethod}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>
            <User className="mr-2 h-4 w-4" />
            Customer Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCustomerDetails;
