
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const RecentOrders = () => {
  const recentOrders = [
    { id: 'ORD-1234', customer: 'John Smith', amount: '$243.00', status: 'delivered', date: '2 hours ago' },
    { id: 'ORD-2345', customer: 'Sarah Johnson', amount: '$125.50', status: 'processing', date: '5 hours ago' },
    { id: 'ORD-3456', customer: 'Michael Brown', amount: '$78.99', status: 'pending', date: '8 hours ago' },
    { id: 'ORD-4567', customer: 'Emily Davis', amount: '$189.75', status: 'delivered', date: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/20 text-success';
      case 'processing': return 'bg-pending/20 text-pending';
      case 'pending': return 'bg-warning/20 text-warning';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{getInitials(order.customer)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.amount}</p>
                <Badge className={getStatusColor(order.status)} variant="outline">
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
