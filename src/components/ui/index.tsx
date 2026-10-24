import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, AlertCircle, Info } from 'lucide-react';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    secondary: 'bg-[#1E1E2E] hover:bg-[#2a2a3e] text-slate-200 border border-[#1E1E2E]',
    ghost: 'hover:bg-[#1E1E2E] text-slate-300 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  };
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; }
export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[#111118] border border-[#1E1E2E] rounded-xl ${onClick ? 'cursor-pointer hover:border-blue-600/40 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';
interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string; }
export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    blue: 'bg-blue-900/30 text-blue-300 border-blue-800/30',
    green: 'bg-emerald-900/30 text-emerald-300 border-emerald-800/30',
    yellow: 'bg-yellow-900/30 text-yellow-300 border-yellow-800/30',
    red: 'bg-red-900/30 text-red-300 border-red-800/30',
    gray: 'bg-slate-800/50 text-slate-400 border-slate-700/30',
    purple: 'bg-purple-900/30 text-purple-300 border-purple-800/30',
    orange: 'bg-orange-900/30 text-orange-300 border-orange-800/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }
export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl`}>
        <div className="flex items-center justify-between p-5 border-b border-[#1E1E2E]">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1E1E2E] rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
interface DrawerProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: string; }
export function Drawer({ open, onClose, title, children, width = 'w-[480px]' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-40 flex justify-end transition-all duration-300 ${open ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative ${width} max-w-full bg-[#111118] border-l border-[#1E1E2E] h-full flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-[#1E1E2E] flex-shrink-0">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1E1E2E] rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; icon?: React.ReactNode;
}
export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-slate-300 font-medium">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          className={`w-full bg-[#0A0A0F] border ${error ? 'border-red-500' : 'border-[#1E1E2E]'} rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: { value: string; label: string }[];
}
export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-slate-300 font-medium">{label}</label>}
      <div className="relative">
        <select
          className={`w-full bg-[#0A0A0F] border ${error ? 'border-red-500' : 'border-[#1E1E2E]'} rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-600 transition-colors appearance-none pr-8 ${className}`}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string;
}
export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-slate-300 font-medium">{label}</label>}
      <textarea
        className={`w-full bg-[#0A0A0F] border ${error ? 'border-red-500' : 'border-[#1E1E2E]'} rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
interface TabsProps { tabs: { id: string; label: string; icon?: React.ReactNode }[]; active: string; onChange: (id: string) => void; }
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 bg-[#0A0A0F] rounded-lg p-1 border border-[#1E1E2E]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${active === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E1E2E]'}`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }
let toastListeners: Set<(t: Toast) => void> = new Set();
export function showToast(message: string, type: Toast['type'] = 'success') {
  const t: Toast = { id: Math.random().toString(36), message, type };
  toastListeners.forEach(fn => fn(t));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const add = (t: Toast) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3000);
    };
    toastListeners.add(add);
    return () => { toastListeners.delete(add); };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-slide-in
          ${t.type === 'success' ? 'bg-emerald-900/80 border-emerald-700 text-emerald-200' :
            t.type === 'error' ? 'bg-red-900/80 border-red-700 text-red-200' :
            'bg-blue-900/80 border-blue-700 text-blue-200'}`}>
          {t.type === 'success' ? <Check className="w-4 h-4" /> : t.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; sub?: string; icon?: React.ReactNode; trend?: number; color?: string; onClick?: () => void; }
export function StatCard({ label, value, sub, icon, trend, color = 'blue', onClick }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-900/20',
    green: 'text-emerald-400 bg-emerald-900/20',
    yellow: 'text-yellow-400 bg-yellow-900/20',
    red: 'text-red-400 bg-red-900/20',
    purple: 'text-purple-400 bg-purple-900/20',
  };
  return (
    <Card className={`p-4 ${onClick ? 'cursor-pointer hover:border-blue-600/40 transition-colors' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl ${colors[color] || colors.blue}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressBarProps { value: number; max?: number; color?: string; size?: 'sm' | 'md'; label?: string; }
export function ProgressBar({ value, max = 100, color = 'bg-blue-600', size = 'md', label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-xs text-slate-400"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div className={`w-full bg-[#1E1E2E] rounded-full ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div className={`${color} rounded-full transition-all duration-500 ${size === 'sm' ? 'h-1.5' : 'h-2'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'text-emerald-400 bg-emerald-900/20 border-emerald-800/30' :
    score >= 50 ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30' :
    'text-red-400 bg-red-900/20 border-red-800/30';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border font-mono ${color}`}>
      {score}
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode; }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="w-12 h-12 rounded-2xl bg-[#1E1E2E] flex items-center justify-center mb-4 text-slate-500">{icon}</div>}
      <p className="text-slate-300 font-medium">{title}</p>
      {description && <p className="text-slate-500 text-sm mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; variant?: 'danger' | 'primary'; }
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'primary' }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-400 mb-5">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
interface DropdownItem { label: string; icon?: React.ReactNode; onClick: () => void; danger?: boolean; }
interface DropdownProps { trigger: React.ReactNode; items: DropdownItem[]; }
export function Dropdown({ trigger, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-[#111118] border border-[#1E1E2E] rounded-xl shadow-2xl z-50 py-1 animate-fade-in">
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer ${item.danger ? 'text-red-400 hover:bg-red-900/20' : 'text-slate-300 hover:bg-[#1E1E2E] hover:text-white'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
