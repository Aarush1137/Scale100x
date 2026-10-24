import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calculator, FileText, Bot, CreditCard, Workflow,
  Settings, ChevronLeft, ChevronRight, Bell, Search, Menu, Coffee,
  Zap, UserCheck, TrendingUp, LogOut
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui';

const navItems = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard },
  { path: '/onboarding', label: 'Brand Onboarding', icon: Coffee },
  { path: '/roi', label: 'ROI Engine', icon: Calculator },
  { path: '/collateral', label: 'Collateral Studio', icon: FileText },
  { path: '/agents', label: 'AI Agent Center', icon: Bot },
  { path: '/crm', label: 'Sales CRM', icon: CreditCard },
  { path: '/automations', label: 'Automations', icon: Workflow },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface AppShellProps { children: React.ReactNode; }

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useStore();

  const unreadCount = data.conversations.filter(c => c.unreadCount > 0).length;
  const humanQueue = data.conversations.filter(c => c.status === 'Escalated' || c.status === 'Human Active').length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const lead = data.leads.find(l => l.name.toLowerCase().includes(q));
    if (lead) { navigate('/crm'); setSearchOpen(false); setSearchQuery(''); return; }
    const conv = data.conversations.find(c => c.leadName.toLowerCase().includes(q));
    if (conv) { navigate('/agents/whatsapp'); setSearchOpen(false); setSearchQuery(''); }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0F] overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-[#111118] border-r border-[#1E1E2E] transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-14' : 'w-56'}`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-[#1E1E2E] ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-sm font-bold text-white">Scale100x</span>
              <span className="text-xs text-blue-400 block -mt-0.5">.ai</span>
            </div>
          )}
        </div>

        {/* Demo badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-2 py-1 bg-yellow-900/20 border border-yellow-800/30 rounded-lg text-center">
            <span className="text-xs text-yellow-400 font-medium">⚡ DEMO MODE</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            const badge = item.path === '/agents' && humanQueue > 0 ? humanQueue : null;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
                  active ? 'bg-blue-600/15 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E1E2E]'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && badge && (
                  <span className="w-5 h-5 flex items-center justify-center bg-red-600 text-white text-xs rounded-full">{badge}</span>
                )}
                {collapsed && badge && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#1E1E2E] p-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">Arjun Demo</p>
                <p className="text-xs text-slate-500 truncate">admin@scale100x.ai</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center justify-center gap-2 px-2 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E1E2E] rounded-lg transition-colors text-xs cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 py-3 bg-[#111118] border-b border-[#1E1E2E] flex-shrink-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search leads, conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto">
            {/* AI/Human metric */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">AI: 76%</span>
              <span className="text-xs text-slate-600">|</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Human: 24%</span>
            </div>

            {/* Notifications */}
            <button
              onClick={() => navigate('/agents/whatsapp')}
              className="relative p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Demo badge */}
            <Badge variant="yellow">DEMO</Badge>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
