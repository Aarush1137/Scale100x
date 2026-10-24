import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calculator, FileText, Bot, CreditCard, Workflow,
  Settings, ChevronLeft, ChevronRight, Bell, Search, Store,
  Zap, UserCheck, Menu, X as CloseIcon
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui';

const navItems = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard },
  { path: '/onboarding', label: 'Brand Onboarding', icon: Store },
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    if (lead) { navigate('/crm'); setSearchQuery(''); setMobileOpen(false); return; }
    const conv = data.conversations.find(c => c.leadName.toLowerCase().includes(q));
    if (conv) { navigate('/agents/whatsapp'); setSearchQuery(''); setMobileOpen(false); }
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-14 border-b border-[var(--border)] flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
            Scale100x<span className="text-[var(--accent)]">.ai</span>
          </span>
        )}
        {/* Mobile close */}
        <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Demo badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-2.5 py-1.5 bg-[var(--warning-bg)] border border-amber-200 rounded-lg text-center flex-shrink-0">
          <span className="text-xs text-[var(--warning)] font-semibold tracking-wide">DEMO MODE</span>
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
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-100 relative ${
                active
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border-l-2 border-l-[var(--accent)] pl-2'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && badge && (
                <span className="w-5 h-5 flex items-center justify-center bg-[var(--danger)] text-white text-xs rounded-full font-bold">{badge}</span>
              )}
              {collapsed && badge && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[var(--danger)] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-[var(--border)] p-2 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-subtle)] border border-blue-200 flex items-center justify-center text-xs font-bold text-[var(--accent)] flex-shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">Arjun Demo</p>
              <p className="text-xs text-[var(--text-muted)] truncate">admin@scale100x.ai</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex w-full items-center justify-center gap-2 px-2 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-xs cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-[var(--border)] transition-all duration-200 flex-shrink-0 ${collapsed ? 'w-14' : 'w-56'}`}>
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-white border-r border-[var(--border)] flex flex-col shadow-xl">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-2 px-4 h-14 bg-white border-b border-[var(--border)] flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-1 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* AI/Human metric — desktop only */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
              <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--accent)] font-mono">AI 76%</span>
              <span className="text-[var(--border-strong)] text-xs">|</span>
              <UserCheck className="w-3.5 h-3.5 text-[var(--success)]" />
              <span className="text-xs font-semibold text-[var(--success)] font-mono">Human 24%</span>
              <span className="text-xs text-[var(--text-muted)] ml-0.5">est.</span>
            </div>

            <button
              onClick={() => navigate('/agents/whatsapp')}
              className="relative p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--danger)] rounded-full" />
              )}
            </button>

            <Badge variant="yellow">DEMO</Badge>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[var(--bg-app)]">
          {children}
        </main>
      </div>
    </div>
  );
}
