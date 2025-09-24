import { 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { navigationItems } from "./navigationConfig";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AppSidebarProps = {
  logoSrc?: string;
  logoCollapsedSrc?: string;
  brandName?: string;
  onLogout?: () => void;
};

export function AppSidebar({
  logoSrc = "/Logo-branca.webp",
  logoCollapsedSrc = "/logo-mark.svg", 
  brandName = "Vetter Co.",
  onLogout,
}: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard" || currentPath === "/boards";
    }
    return currentPath.startsWith(path);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      signOut();
    }
  };

  return (
    <TooltipProvider>
      <div className={`
        hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out relative
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className={`
            absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white
            shadow-sm hover:shadow-md transition-all duration-200
            ${isCollapsed ? '' : ''}
          `}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </Button>

        {/* Header com Logo */}
        <div className="p-4 border-b border-gray-100">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="flex items-center">
              {isCollapsed ? (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
              ) : (
                <img
                  src={logoSrc}
                  alt={brandName}
                  className="h-8 w-auto"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              )}
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center hidden">
                <span className="text-white font-bold text-sm">V</span>
              </div>
            </div>
            
            {!isCollapsed && (
              <span className="font-semibold text-lg text-gray-900 truncate">
                {brandName}
              </span>
            )}
          </NavLink>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.url);
              
              if (isCollapsed) {
                return (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.url}
                        className={`
                          flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200
                          ${active 
                            ? 'bg-blue-50 text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    text-sm font-medium group w-full
                    ${active
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                  <span className="truncate">{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer com User Info */}
        <div className="border-t border-gray-100 p-3">
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 
                       user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="text-sm">
                  <div className="font-medium">
                    {user?.user_metadata?.full_name || 'Usuário'}
                  </div>
                  <div className="text-gray-500 text-xs">{user?.email}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="space-y-2">
              {/* User Info */}
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                    {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 
                     user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.user_metadata?.full_name || 'Usuário'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
