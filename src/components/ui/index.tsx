import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, AlertCircle, Info } from 'lucide-react';

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
}
export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1';
  const variants = {
    primary: 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm',
    secondary: 'bg-white hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border)]',
    ghost: 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
    danger: 'bg-[var(--danger)] hover:bg-red-700 text-white',
    success: 'bg-[var(--success)] hover:bg-green-700 text-white',
  };
  const sizes = { xs: 'px-2 py-1 text-xs', sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
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
      className={`bg-white border border-[var(--border)] rounded-xl ${onClick ? 'cursor-pointer hover:border-[var(--accent)] transition-colors hover:shadow-sm' : ''} ${className}`}
      style={{ boxShadow: 'var(--shadow-sm)' }}
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
    blue: 'bg-[var(--accent-subtle)] text-[var(--accent)] border-blue-200',
    green: 'bg-[var(--success-bg)] text-[var(--success)] border-green-200',
    yellow: 'bg-[var(--warning-bg)] text-[var(--warning)] border-amber-200',
    red: 'bg-[var(--danger-bg)] text-[var(--danger)] border-red-200',
    gray: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)]',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
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
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-white border border-[var(--border)] rounded-2xl animate-slide-up`} style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
interface DrawerProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: string; }
export function Drawer({ open, onClose, title, children, width = 'w-[480px]' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  return (
    <div className={`fixed inset-0 z-40 flex justify-end transition-all duration-200 ${open ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative ${width} max-w-full bg-white border-l border-[var(--border)] h-full flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-[var(--text-muted)] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode; hint?: string; }
export function Input({ label, error, icon, hint, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{icon}</div>}
        <input
          className={`w-full bg-white border ${error ? 'border-[var(--danger)]' : 'border-[var(--border)]'} rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 focus:border-[var(--accent)] transition-all ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      {error && <p className="text-xs text-[var(--danger)] flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; error?: string; options: { value: string; label: string }[]; }
export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <div className="relative">
        <select
          className={`w-full bg-white border ${error ? 'border-[var(--danger)]' : 'border-[var(--border)]'} rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all appearance-none pr-8 ${className}`}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
      </div>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; }
export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <textarea
        className={`w-full bg-white border ${error ? 'border-[var(--danger)]' : 'border-[var(--border)]'} rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
interface TabsProps { tabs: { id: string; label: string; icon?: React.ReactNode }[]; active: string; onChange: (id: string) => void; }
export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-[var(--border)]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer border-b-2 -mb-px ${
            active === tab.id
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
          }`}
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
        <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium animate-slide-up ${
          t.type === 'success' ? 'bg-[var(--success-bg)] border-green-200 text-[var(--success)]' :
          t.type === 'error' ? 'bg-[var(--danger-bg)] border-red-200 text-[var(--danger)]' :
          'bg-[var(--accent-subtle)] border-blue-200 text-[var(--accent)]'
        }`} style={{ boxShadow: 'var(--shadow-md)' }}>
          {t.type === 'success' ? <Check className="w-4 h-4" /> : t.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; sub?: string; icon?: React.ReactNode; trend?: number; color?: string; onClick?: () => void; }
export function StatCard({ label, value, sub, trend, color = 'blue', onClick }: StatCardProps) {
  const borderColors: Record<string, string> = {
    blue: 'border-l-[var(--accent)]',
    green: 'border-l-[var(--success)]',
    yellow: 'border-l-[var(--warning)]',
    red: 'border-l-[var(--danger)]',
    purple: 'border-l-purple-500',
  };
  return (
    <div
      className={`bg-white border border-[var(--border)] border-l-2 ${borderColors[color] || borderColors.blue} rounded-xl p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      style={{ boxShadow: 'var(--shadow-sm)' }}
      onClick={onClick}
    >
      <p className="text-xs text-[var(--text-muted)] mb-1.5 truncate">{label}</p>
      <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono tabular-nums leading-none">{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
      {trend !== undefined && (
        <p className={`text-xs mt-1.5 font-medium ${trend >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {trend >= 0 ? '+' : ''}{trend}% this week
        </p>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressBarProps { value: number; max?: number; color?: string; size?: 'sm' | 'md'; label?: string; }
export function ProgressBar({ value, max = 100, color = 'bg-[var(--accent)]', size = 'md', label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="space-y-1">
      {label && <div className="flex justify-between text-xs text-[var(--text-secondary)]"><span>{label}</span><span className="font-mono">{Math.round(pct)}%</span></div>}
      <div className={`w-full bg-[var(--bg-hover)] rounded-full ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div className={`${color} rounded-full transition-all duration-500 ${size === 'sm' ? 'h-1.5' : 'h-2'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
export function ScoreBadge({ score }: { score: number }) {
  const style = score >= 75
    ? 'text-[var(--success)] bg-[var(--success-bg)] border-green-200'
    : score >= 50
    ? 'text-[var(--warning)] bg-[var(--warning-bg)] border-amber-200'
    : 'text-[var(--danger)] bg-[var(--danger-bg)] border-red-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border font-mono ${style}`}>
      {score}
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode; }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-4 text-[var(--text-muted)]">{icon}</div>}
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      {description && <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; variant?: 'danger' | 'primary'; }
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'primary' }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-[var(--text-secondary)] mb-5">{message}</p>
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
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[var(--border)] rounded-xl py-1 z-50 animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)' }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors cursor-pointer ${item.danger ? 'text-[var(--danger)] hover:bg-[var(--danger-bg)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
