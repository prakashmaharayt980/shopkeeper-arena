
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TopProducts = () => {
  const products = [
    { name: 'Wireless Headphones', sales: 1234, revenue: '$24,530', growth: '+12%' },
    { name: 'Smart Watch', sales: 856, revenue: '$19,246', growth: '+10%' },
    { name: 'Laptop Backpack', sales: 765, revenue: '$15,300', growth: '+8%' },
    { name: 'USB-C Adapter', sales: 654, revenue: '$9,816', growth: '+6%' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sales</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{product.revenue}</p>
                <p className="text-sm text-green-600">{product.growth}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
