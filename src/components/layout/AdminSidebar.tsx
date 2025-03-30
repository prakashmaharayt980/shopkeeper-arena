
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Home, 
  Settings,
  LogOut
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';

const AdminSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  const menuItems = [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Orders', icon: ShoppingCart, path: '/orders' },
    { title: 'Products', icon: Package, path: '/products' },
    { title: 'Customers', icon: Users, path: '/customers' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-6">
        <h1 className="text-xl font-bold text-white">E-Shop Admin</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground hover:text-sidebar-primary'
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 py-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary w-full px-3 py-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
