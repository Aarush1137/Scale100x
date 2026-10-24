export function formatDistanceToNow(timestamp: string): string {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function intentColor(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export function intentLabel(score: number): string {
  if (score >= 80) return 'Very High Intent';
  if (score >= 65) return 'High Intent';
  if (score >= 50) return 'Medium Intent';
  if (score >= 30) return 'Low Intent';
  return 'Very Low Intent';
}

export function stageBadgeVariant(stage: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' {
  const map: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'> = {
    New: 'gray',
    Contacted: 'blue',
    Qualified: 'blue',
    Consultation: 'yellow',
    Proposal: 'purple',
    Negotiation: 'orange' as 'yellow',
    Won: 'green',
    Lost: 'red',
  };
  return map[stage] || 'gray';
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, filename, 'text/csv');
}
