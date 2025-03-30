
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Settings updated",
      description: "Your settings have been successfully saved.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your store's general settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" defaultValue="E-Shop Store" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-url">Store URL</Label>
                        <Input id="store-url" defaultValue="https://example.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Store Description</Label>
                      <Textarea 
                        id="store-description" 
                        rows={4}
                        defaultValue="Your premium e-commerce destination for all your shopping needs."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <select 
                        id="currency" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="USD"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                    </div>
                  </div>
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Manage your company details displayed to customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" defaultValue="E-Shop Inc." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                        <Input id="tax-id" defaultValue="US12345678" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Company Address</Label>
                      <Textarea 
                        id="address" 
                        rows={3}
                        defaultValue="123 E-Commerce St, Suite 101&#10;New York, NY 10001&#10;United States"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input id="contact-email" type="email" defaultValue="support@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Contact Phone</Label>
                        <Input id="contact-phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure which notifications you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h3 className="font-medium">New Order Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a new order is placed
                        </p>
                      </div>
                      <Switch id="new-order-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h3 className="font-medium">Low Stock Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when products are running low
                        </p>
                      </div>
                      <Switch id="low-stock-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h3 className="font-medium">Customer Reviews</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when customers leave reviews
                        </p>
                      </div>
                      <Switch id="customer-reviews" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-medium">Marketing Updates</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive marketing tips and platform updates
                        </p>
                      </div>
                      <Switch id="marketing-updates" />
                    </div>
                  </div>
                  
                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
