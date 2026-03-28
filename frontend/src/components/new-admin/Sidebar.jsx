import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin-portal' },
  { 
    name: 'Farmers', 
    icon: 'group', 
    subItems: [
      { name: 'All Farmers', path: '/admin-portal/farmers/all' },
      { name: 'Animal Registry', path: '/admin-portal/farmers/registry' }
    ]
  },
  {
    name: 'Animal Health',
    icon: 'health_and_safety',
    subItems: [
      { name: 'Disease Reports', path: '/admin-portal/health/reports' },
      { name: 'Disease Heatmap', path: '/admin-portal/health/heatmap' },
      { name: 'Outbreak Alerts', path: '/admin-portal/health/alerts' }
    ]
  },
  {
    name: 'AI Monitoring',
    icon: 'memory',
    subItems: [
      { name: 'Chat Logs', path: '/admin-portal/ai/chat-logs' },
      { name: 'Flagged Responses', path: '/admin-portal/ai/flagged' },
      { name: 'AI Accuracy', path: '/admin-portal/ai/accuracy' }
    ]
  },
  {
    name: 'Veterinary Network',
    icon: 'local_hospital',
    subItems: [
      { name: 'Vet Profiles', path: '/admin-portal/vets/profiles' },
      { name: 'Vet Performance', path: '/admin-portal/vets/performance' }
    ]
  },
  {
    name: 'Consultations',
    icon: 'forum',
    subItems: [
      { name: 'Consultation Logs', path: '/admin-portal/consultations/logs' },
      { name: 'Call Recordings', path: '/admin-portal/consultations/recordings' }
    ]
  },
  {
    name: 'Knowledge Base',
    icon: 'menu_book',
    subItems: [
      { name: 'Diseases', path: '/admin-portal/knowledge/diseases' },
      { name: 'Symptoms', path: '/admin-portal/knowledge/symptoms' },
      { name: 'Treatments', path: '/admin-portal/knowledge/treatments' }
    ]
  }
];

const SYSTEM_ITEMS = [
  {
    name: 'Notifications',
    icon: 'notifications',
    subItems: [
      { name: 'Alerts', path: '/admin-portal/notifications/alerts' },
      { name: 'Campaigns', path: '/admin-portal/notifications/campaigns' }
    ]
  },
  {
    name: 'Payments',
    icon: 'payments',
    subItems: [
      { name: 'Revenue', path: '/admin-portal/payments/revenue' },
      { name: 'Transactions', path: '/admin-portal/payments/transactions' }
    ]
  },
  {
    name: 'Reports',
    icon: 'bar_chart',
    subItems: [
      { name: 'Analytics', path: '/admin-portal/reports/analytics' },
      { name: 'Data Export', path: '/admin-portal/reports/export' }
    ]
  },
  {
    name: 'Settings',
    icon: 'settings',
    subItems: [
      { name: 'Roles', path: '/admin-portal/settings/roles' },
      { name: 'Platform Settings', path: '/admin-portal/settings/platform' }
    ]
  }
];

const SidebarItem = ({ item, isActive, isExpanded, toggleExpand }) => {
  const location = useLocation();
  const isSubItemActive = item.subItems?.some(sub => location.pathname === sub.path) || isActive;

  return (
    <div className="mb-1">
      {item.subItems ? (
        <button
          onClick={toggleExpand}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-[15px]
            ${isSubItemActive ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary'}`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.name}</span>
          </div>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ) : (
        <NavLink
          to={item.path}
          end
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px]
            ${isActive ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary'}`
          }
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      )}

      {/* Sub Items */}
      {item.subItems && isExpanded && (
        <div className="ml-10 mt-1 flex flex-col gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
          {item.subItems.map((sub, idx) => (
            <NavLink
              key={idx}
              to={sub.path}
              className={({ isActive }) =>
                `text-sm py-2 px-3 rounded-lg transition-colors
                ${isActive ? 'text-brand-primary font-bold bg-brand-primary/5' : 'text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5'}`
              }
            >
              {sub.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (name) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="w-72 bg-teal-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col z-20 sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/50">
        <div className="bg-brand-primary text-white p-2 rounded-xl shadow-lg shadow-brand-primary/30">
          <span className="material-symbols-outlined font-bold">pets</span>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">PashuVaani</h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gopu AI Powered</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll p-4 py-6">
        <div className="flex flex-col gap-1">
          {MENU_ITEMS.map((item, idx) => (
            <SidebarItem
              key={idx}
              item={item}
              isActive={location.pathname === item.path}
              isExpanded={expandedMenus[item.name]}
              toggleExpand={() => toggleMenu(item.name)}
            />
          ))}
        </div>

        <div className="mt-8 mb-4 px-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System</span>
        </div>

        <div className="flex flex-col gap-1">
          {SYSTEM_ITEMS.map((item, idx) => (
            <SidebarItem
              key={idx}
              item={item}
              isActive={location.pathname === item.path}
              isExpanded={expandedMenus[item.name]}
              toggleExpand={() => toggleMenu(item.name)}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
        <button className="w-full py-3 bg-brand-primary text-white rounded-xl font-medium shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 hover:bg-green-800 transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
          New Consultation
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
