import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { Calculator, Download, TrendingUp, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { formatCurrency, downloadCSV } from '../lib/utils';

interface Assumptions {
  monthlyRevenue: number;
  initialInvestment: number;
  cogsPercent: number;
  employeeCosts: number;
  rent: number;
  utilities: number;
  marketingPercent: number;
  royaltyPercent: number;
  annualGrowthRate: number;
}

const SCENARIOS: { label: string; revenue: number }[] = [
  { label: '₹6L (Conservative)', revenue: 600000 },
  { label: '₹8L (Base)', revenue: 800000 },
  { label: '₹10L (Optimistic)', revenue: 1000000 },
];

const defaults: Assumptions = {
  monthlyRevenue: 800000,
  initialInvestment: 1800000,
  cogsPercent: 35,
  employeeCosts: 120000,
  rent: 80000,
  utilities: 25000,
  marketingPercent: 5,
  royaltyPercent: 6,
  annualGrowthRate: 15,
};

function calcFinancials(a: Assumptions) {
  const cogs = a.monthlyRevenue * (a.cogsPercent / 100);
  const marketing = a.monthlyRevenue * (a.marketingPercent / 100);
  const royalty = a.monthlyRevenue * (a.royaltyPercent / 100);
  const totalCosts = cogs + a.employeeCosts + a.rent + a.utilities + marketing + royalty;
  const opProfit = a.monthlyRevenue - totalCosts;
  const margin = a.monthlyRevenue > 0 ? (opProfit / a.monthlyRevenue) * 100 : 0;
  const breakeven = opProfit > 0 ? a.initialInvestment / opProfit : Infinity;
  return { cogs, marketing, royalty, totalCosts, opProfit, margin, breakeven };
}

function genProjection(a: Assumptions) {
  const months: { label: string; revenue: number; profit: number; cumProfit: number }[] = [];
  let cumProfit = -a.initialInvestment;
  const monthlyGrowth = a.annualGrowthRate / 100 / 12;

  for (let i = 1; i <= 12; i++) {
    const rev = a.monthlyRevenue * Math.pow(1 + monthlyGrowth, i - 1);
    const cogs = rev * (a.cogsPercent / 100);
    const marketing = rev * (a.marketingPercent / 100);
    const royalty = rev * (a.royaltyPercent / 100);
    const costs = cogs + a.employeeCosts + a.rent + a.utilities + marketing + royalty;
    const profit = rev - costs;
    cumProfit += profit;
    months.push({ label: `M${i}`, revenue: Math.round(rev), profit: Math.round(profit), cumProfit: Math.round(cumProfit) });
  }
  return months;
}

export default function ROIEngine() {
  const [assumptions, setAssumptions] = useState<Assumptions>(defaults);
  const [activeScenario, setActiveScenario] = useState(1);

  const fin = useMemo(() => calcFinancials(assumptions), [assumptions]);
  const projection = useMemo(() => genProjection(assumptions), [assumptions]);

  // 3-year projection
  const year1Annual = projection.reduce((s, m) => ({ revenue: s.revenue + m.revenue, profit: s.profit + m.profit }), { revenue: 0, profit: 0 });
  const year2Revenue = year1Annual.revenue * (1 + assumptions.annualGrowthRate / 100);
  const year2Profit = year2Revenue * (fin.margin / 100);
  const year3Revenue = year2Revenue * (1 + assumptions.annualGrowthRate / 100);
  const year3Profit = year3Revenue * (fin.margin / 100);

  const yearlyData = [
    { year: 'Year 1', revenue: year1Annual.revenue, profit: year1Annual.profit },
    { year: 'Year 2', revenue: Math.round(year2Revenue), profit: Math.round(year2Profit) },
    { year: 'Year 3', revenue: Math.round(year3Revenue), profit: Math.round(year3Profit) },
  ];

  function applyScenario(idx: number) {
    setActiveScenario(idx);
    setAssumptions(prev => ({ ...prev, monthlyRevenue: SCENARIOS[idx].revenue }));
  }

  function updateField(key: keyof Assumptions, value: number) {
    setAssumptions(prev => ({ ...prev, [key]: value }));
  }

  function exportCSV() {
    const rows: string[][] = [
      ['Month', 'Revenue (₹)', 'Profit (₹)', 'Cumulative P&L (₹)'],
      ...projection.map(m => [m.label, m.revenue.toString(), m.profit.toString(), m.cumProfit.toString()]),
      [],
      ['Annual Summary', '', '', ''],
      ['Year', 'Revenue (₹)', 'Profit (₹)', ''],
      ...yearlyData.map(y => [y.year, y.revenue.toString(), y.profit.toString(), '']),
      [],
      ['Assumptions', '', '', ''],
      ['Initial Investment', assumptions.initialInvestment.toString(), '', ''],
      ['Monthly Revenue', assumptions.monthlyRevenue.toString(), '', ''],
      ['COGS %', assumptions.cogsPercent.toString(), '', ''],
      ['Employee Costs', assumptions.employeeCosts.toString(), '', ''],
      ['Rent', assumptions.rent.toString(), '', ''],
      ['Royalty %', assumptions.royaltyPercent.toString(), '', ''],
    ];
    downloadCSV(rows, 'FreshBrew_ROI_Model.csv');
  }

  const breakevenMonths = isFinite(fin.breakeven) ? Math.ceil(fin.breakeven) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">ROI Engine</h1>
          <p className="text-sm text-slate-500 mt-0.5">FreshBrew QSR — Financial Model & Projections</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="yellow">ILLUSTRATIVE MODEL</Badge>
          <Button size="sm" variant="secondary" onClick={exportCSV} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Scenario Selector */}
      <Card className="p-4">
        <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Revenue Scenarios</p>
        <div className="flex gap-3">
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => applyScenario(i)}
              className={`flex-1 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeScenario === i ? 'border-blue-600 bg-blue-600/10 text-blue-300' : 'border-[#1E1E2E] text-slate-400 hover:border-slate-600'
              }`}
            >
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(s.revenue)}/mo</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Assumptions Panel */}
        <Card className="p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">Assumptions</h2>
          <AsmpInput label="Initial Investment (₹)" value={assumptions.initialInvestment} onChange={v => updateField('initialInvestment', v)} step={50000} />
          <AsmpInput label="Monthly Revenue (₹)" value={assumptions.monthlyRevenue} onChange={v => updateField('monthlyRevenue', v)} step={50000} />
          <AsmpInput label="COGS %" value={assumptions.cogsPercent} onChange={v => updateField('cogsPercent', v)} step={1} min={0} max={80} isPercent />
          <AsmpInput label="Employee Costs (₹)" value={assumptions.employeeCosts} onChange={v => updateField('employeeCosts', v)} step={5000} />
          <AsmpInput label="Rent (₹/mo)" value={assumptions.rent} onChange={v => updateField('rent', v)} step={5000} />
          <AsmpInput label="Utilities (₹/mo)" value={assumptions.utilities} onChange={v => updateField('utilities', v)} step={1000} />
          <AsmpInput label="Marketing %" value={assumptions.marketingPercent} onChange={v => updateField('marketingPercent', v)} step={0.5} min={0} max={20} isPercent />
          <AsmpInput label="Royalty %" value={assumptions.royaltyPercent} onChange={v => updateField('royaltyPercent', v)} step={0.5} min={0} max={15} isPercent />
          <AsmpInput label="Annual Growth %" value={assumptions.annualGrowthRate} onChange={v => updateField('annualGrowthRate', v)} step={1} min={0} max={50} isPercent />
        </Card>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Operating Profit" value={formatCurrency(fin.opProfit)} sub="per month" color={fin.opProfit >= 0 ? 'green' : 'red'} />
            <MetricCard label="Margin" value={`${fin.margin.toFixed(1)}%`} sub="operating" color={fin.margin >= 20 ? 'green' : fin.margin >= 10 ? 'yellow' : 'red'} />
            <MetricCard label="Break-even" value={breakevenMonths ? `${breakevenMonths}mo` : 'N/A'} sub={breakevenMonths ? `~${(breakevenMonths / 12).toFixed(1)} years` : 'negative cash flow'} color={breakevenMonths && breakevenMonths <= 24 ? 'green' : 'yellow'} />
            <MetricCard label="Payback Period" value={breakevenMonths ? `${breakevenMonths} months` : 'N/A'} sub="at current pace" color="blue" />
          </div>

          {/* Cost Breakdown */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Monthly Cost Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: 'COGS', value: fin.cogs, pct: assumptions.cogsPercent },
                { label: 'Employee Costs', value: assumptions.employeeCosts, pct: (assumptions.employeeCosts / assumptions.monthlyRevenue) * 100 },
                { label: 'Rent', value: assumptions.rent, pct: (assumptions.rent / assumptions.monthlyRevenue) * 100 },
                { label: 'Royalty', value: fin.royalty, pct: assumptions.royaltyPercent },
                { label: 'Marketing', value: fin.marketing, pct: assumptions.marketingPercent },
                { label: 'Utilities', value: assumptions.utilities, pct: (assumptions.utilities / assumptions.monthlyRevenue) * 100 },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-32 flex-shrink-0">{row.label}</span>
                  <div className="flex-1 bg-[#1E1E2E] rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, row.pct)}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 font-mono w-24 text-right">{formatCurrency(row.value)} ({row.pct.toFixed(1)}%)</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-[#1E1E2E]">
                <span className="text-xs font-medium text-slate-300 w-32">Operating Profit</span>
                <div className="flex-1" />
                <span className={`text-sm font-bold font-mono ${fin.opProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(fin.opProfit)}</span>
              </div>
            </div>
          </Card>

          {/* Monthly Chart */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">12-Month Revenue & Profit</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={projection} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: unknown) => formatCurrency(v as number)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" dot={false} name="Revenue" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" dot={false} name="Profit" strokeWidth={2} />
                <Line type="monotone" dataKey="cumProfit" stroke="#F59E0B" dot={false} name="Cum. P&L" strokeWidth={1.5} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* 3-Year Projection Table */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">3-Year Projection Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {yearlyData.map(y => (
            <div key={y.year} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 font-medium">{y.year}</p>
              <p className="text-xl font-bold text-slate-100 font-mono mt-1">{formatCurrency(y.revenue)}</p>
              <p className={`text-sm font-medium mt-1 ${y.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(y.profit)} profit</p>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={yearlyData}>
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => formatCurrency(v as number)} />
            <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Sensitivity Table */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Scenario Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#1E1E2E]">
              {['Metric', ...SCENARIOS.map(s => s.label)].map(h => (
                <th key={h} className="text-left py-2 px-3 text-slate-400 font-medium text-xs">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { label: 'Monthly Revenue', fn: (r: number) => formatCurrency(r) },
                { label: 'Monthly Profit', fn: (r: number) => { const f = calcFinancials({ ...assumptions, monthlyRevenue: r }); return formatCurrency(f.opProfit); } },
                { label: 'Margin', fn: (r: number) => { const f = calcFinancials({ ...assumptions, monthlyRevenue: r }); return `${f.margin.toFixed(1)}%`; } },
                { label: 'Break-even', fn: (r: number) => { const f = calcFinancials({ ...assumptions, monthlyRevenue: r }); const be = isFinite(f.breakeven) ? `${Math.ceil(f.breakeven)}mo` : 'N/A'; return be; } },
                { label: 'Year 1 Revenue', fn: (r: number) => formatCurrency(r * 12) },
              ].map(row => (
                <tr key={row.label} className="border-b border-[#1E1E2E]/50">
                  <td className="py-2 px-3 text-slate-400 text-xs">{row.label}</td>
                  {SCENARIOS.map((s, i) => (
                    <td key={i} className={`py-2 px-3 font-mono text-sm ${i === 1 ? 'text-blue-400 font-medium' : 'text-slate-300'}`}>{row.fn(s.revenue)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard icon={<TrendingUp className="w-4 h-4 text-blue-400" />} title="Opportunity" content="QSR sector growing at 18% YoY. FreshBrew targets high-footfall locations in Tier 1-2 cities." color="blue" />
        <InsightCard icon={<AlertCircle className="w-4 h-4 text-yellow-400" />} title="Risk" content="Break-even assumes consistent 15% YoY growth. Actual performance may vary with location, competition, and seasonality." color="yellow" />
        <InsightCard icon={<Info className="w-4 h-4 text-slate-400" />} title="India Benchmark" content="Illustrative: India QSR avg break-even 24-36mo. US: 12-18mo. Data for illustrative comparison only." color="gray" />
      </div>
    </div>
  );
}

function AsmpInput({ label, value, onChange, step = 1, min, max, isPercent }: {
  label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; isPercent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-slate-400 flex-1">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number" value={value} step={step} min={min ?? 0} max={max}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-24 bg-[#0A0A0F] border border-[#1E1E2E] rounded px-2 py-1 text-xs text-right text-slate-100 focus:outline-none focus:border-blue-600 font-mono"
        />
        {isPercent && <span className="text-xs text-slate-500">%</span>}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = { green: 'text-emerald-400', red: 'text-red-400', yellow: 'text-yellow-400', blue: 'text-blue-400' };
  return (
    <Card className="p-3 text-center">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`text-lg font-bold font-mono mt-1 ${colors[color] || 'text-slate-100'}`}>{value}</p>
      <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
    </Card>
  );
}

function InsightCard({ icon, title, content, color }: { icon: React.ReactNode; title: string; content: string; color: string }) {
  const borders: Record<string, string> = { blue: 'border-blue-800/30', yellow: 'border-yellow-800/30', gray: 'border-[#1E1E2E]' };
  return (
    <Card className={`p-4 border ${borders[color] || borders.gray}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<p className="text-sm font-medium text-slate-200">{title}</p></div>
      <p className="text-xs text-slate-500 leading-relaxed">{content}</p>
    </Card>
  );
}
