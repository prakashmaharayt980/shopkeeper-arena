import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RemoteServices from '@/RemoteService/Remoteservice';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await RemoteServices.CustomerFile(); // adjust method name if needed
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter by name, email, or phone_number
  const filteredCustomers = customers.filter(c => {
    const term = search.toLowerCase();
    return (
      !search ||
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone_number.includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers</h1>
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

        {loading ? (
          <div className="text-center py-10">Loading customers...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id} className="hover:bg-muted/50">
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar || ''} alt={customer.name} />
                              <AvatarFallback>
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm">{customer.email}</td>
                        <td className="px-4 py-2 text-sm">{customer.phone_number}</td>
                        <td className="px-4 py-2 text-sm">{customer.address}</td>
                        <td className="px-4 py-2 text-sm">
                          {new Date(customer.created_at).toDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Customers;
