import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, addToast } = useApp();

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'campaigns',
      label: 'SMS Campaigns',
      icon: MessageSquare,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({
      type: 'info',
      title: 'Session Active',
      message: 'You are signed into Blue Oak Bistro workspace.',
    });
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      {/* Top Section: Brand & Nav */}
      <div className="p-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">
              ReviewFlow
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1">
              Google Review SaaS
            </span>
          </div>
        </div>

        {/* 5 Navigation Tabs */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active Store & Logout */}
      <div className="p-6 border-t border-slate-100 space-y-4">
        <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Connected Business
          </p>
          <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
            Blue Oak Bistro
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SMS Automation Active</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
