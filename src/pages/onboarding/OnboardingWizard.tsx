import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Check, Upload, X, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Card, Input, Select, Textarea, Badge, ProgressBar } from '../../components/ui';
import { showToast } from '../../components/ui';
import type { Brand, OnboardingSession } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const STEPS = ['Brand Details', 'Documents', 'Revenue Split', 'AI Readiness'];

interface FormData {
  brandName: string;
  industry: string;
  description: string;
  hq: string;
  outlets: string;
  targetOutlets: string;
  timeline: string;
  monthlyRevenue: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  documents: { name: string; size: string; type: string; uploadedAt: string }[];
  royaltySplit: number;
  franchiseeFee: number;
  marketingFund: number;
}

const defaultForm: FormData = {
  brandName: '',
  industry: 'Quick Service Restaurant',
  description: '',
  hq: '',
  outlets: '',
  targetOutlets: '',
  timeline: '12 months',
  monthlyRevenue: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  documents: [],
  royaltySplit: 6,
  franchiseeFee: 2,
  marketingFund: 1,
};

function calcReadiness(form: FormData) {
  const financial = form.monthlyRevenue && form.outlets ? Math.min(100, parseInt(form.monthlyRevenue) / 10000) : 0;
  const operational = form.outlets ? Math.min(100, parseInt(form.outlets) * 8) : 0;
  const brand = form.description.length > 50 ? 80 : form.description.length > 20 ? 50 : 20;
  const expansion = form.targetOutlets && form.timeline ? 75 : 40;
  const dataCompleteness = [
    form.brandName, form.industry, form.description, form.hq,
    form.outlets, form.targetOutlets, form.contactName, form.contactEmail, form.contactPhone
  ].filter(Boolean).length / 9 * 100;

  const dims = {
    financial: Math.min(100, financial * 1.5),
    operational: Math.min(100, operational),
    brand: brand,
    expansion: expansion,
    dataCompleteness: dataCompleteness,
  };
  const total = Math.round((dims.financial + dims.operational + dims.brand + dims.expansion + dims.dataCompleteness) / 5);
  return { dims, total };
}

function ragColor(score: number) {
  if (score >= 70) return { color: 'text-[var(--success)]', bg: 'bg-emerald-900/20', label: 'GREEN', variant: 'green' as const };
  if (score >= 40) return { color: 'text-[var(--warning)]', bg: 'bg-yellow-900/20', label: 'AMBER', variant: 'yellow' as const };
  return { color: 'text-[var(--danger)]', bg: 'bg-red-900/20', label: 'RED', variant: 'red' as const };
}

export default function OnboardingWizard() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { data, upsertOnboardingSession, upsertBrand, addEvent } = useStore();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [currentSessionId] = useState(sessionId || uuidv4());
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Load existing session
  useEffect(() => {
    if (sessionId) {
      const session = data.onboardingSessions.find(s => s.id === sessionId);
      if (session) {
        setStep(session.currentStep);
        setForm(session.data as unknown as FormData);
      }
    }
  }, []);

  function saveSession(currentStep: number, formData: FormData) {
    const session: OnboardingSession = {
      id: currentSessionId,
      brandId: null,
      currentStep,
      data: formData as unknown as Record<string, unknown>,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertOnboardingSession(session);
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validateStep() {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!form.brandName.trim()) newErrors.brandName = 'Brand name is required';
      if (!form.hq.trim()) newErrors.hq = 'HQ city is required';
      if (!form.outlets) newErrors.outlets = 'Number of outlets required';
      if (!form.contactName.trim()) newErrors.contactName = 'Contact name required';
      if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) newErrors.contactEmail = 'Valid email required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    const nextStep = step + 1;
    saveSession(nextStep, form);
    setStep(nextStep);
  }

  function handleBack() {
    setStep(s => Math.max(0, s - 1));
  }

  function handleSubmit() {
    const { total: readinessScore } = calcReadiness(form);
    const brand: Brand = {
      id: uuidv4(),
      name: form.brandName,
      industry: form.industry,
      description: form.description,
      hq: form.hq,
      outlets: parseInt(form.outlets) || 0,
      targetOutlets: parseInt(form.targetOutlets) || 0,
      timeline: form.timeline,
      monthlyRevenue: parseInt(form.monthlyRevenue) || 0,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      readinessScore,
      status: 'onboarded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertBrand(brand);
    const session: OnboardingSession = {
      id: currentSessionId, brandId: brand.id, currentStep: 4,
      data: form as unknown as Record<string, unknown>, completed: true,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    upsertOnboardingSession(session);
    addEvent('brand_submitted', `Brand onboarded: ${brand.name}`, 'brand', brand.id);
    setSubmitted(true);
    showToast(`${brand.name} onboarded successfully!`);
  }

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-900/20 border border-emerald-800/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[var(--success)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Brand Onboarded!</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">{form.brandName} has been added to the platform. The AI readiness score has been calculated.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/onboarding')}>View All Brands</Button>
            <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  const { dims, total } = calcReadiness(form);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Onboard New Brand</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => { saveSession(step, form); showToast('Draft saved'); }}>
          Save Draft
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-blue-600 text-[var(--text-primary)]' : i === step ? 'bg-blue-600/20 border border-blue-600 text-[var(--accent)]' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
              }`}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="text-xs hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-blue-600' : 'bg-[var(--bg-hover)]'}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Brand Name *" placeholder="e.g. FreshBrew QSR" value={form.brandName} onChange={e => updateField('brandName', e.target.value)} error={errors.brandName} />
              <Select label="Industry" value={form.industry} onChange={e => updateField('industry', e.target.value)} options={[
                { value: 'Quick Service Restaurant', label: 'Quick Service Restaurant' },
                { value: 'Retail', label: 'Retail' },
                { value: 'Education', label: 'Education' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Beauty & Wellness', label: 'Beauty & Wellness' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Technology', label: 'Technology' },
              ]} />
            </div>
            <Textarea label="Brand Description" placeholder="Describe your brand, what makes it unique..." value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="HQ City *" placeholder="Mumbai" value={form.hq} onChange={e => updateField('hq', e.target.value)} error={errors.hq} />
              <Select label="Expansion Timeline" value={form.timeline} onChange={e => updateField('timeline', e.target.value)} options={[
                { value: '6 months', label: '6 months' },
                { value: '12 months', label: '12 months' },
                { value: '2 years', label: '2 years' },
                { value: '3 years', label: '3 years' },
              ]} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Current Outlets *" type="number" placeholder="12" value={form.outlets} onChange={e => updateField('outlets', e.target.value)} error={errors.outlets} />
              <Input label="Target Outlets" type="number" placeholder="50" value={form.targetOutlets} onChange={e => updateField('targetOutlets', e.target.value)} />
              <Input label="Monthly Revenue (₹)" type="number" placeholder="800000" value={form.monthlyRevenue} onChange={e => updateField('monthlyRevenue', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Contact Name *" placeholder="Arjun Mehta" value={form.contactName} onChange={e => updateField('contactName', e.target.value)} error={errors.contactName} />
              <Input label="Email *" type="email" placeholder="arjun@brand.in" value={form.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} error={errors.contactEmail} />
              <Input label="Phone" type="tel" placeholder="+91 9876543210" value={form.contactPhone} onChange={e => updateField('contactPhone', e.target.value)} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-900/10 border border-yellow-800/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-[var(--warning)] flex-shrink-0" />
              <p className="text-xs text-yellow-300"><strong>DEMO MODE:</strong> Files are not actually uploaded. Only metadata is stored in localStorage for demo purposes.</p>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault(); setDragOver(false);
                Array.from(e.dataTransfer.files).forEach(f => {
                  updateField('documents', [...form.documents, { name: f.name, size: `${Math.round(f.size / 1024)}KB`, type: f.type || 'document', uploadedAt: new Date().toISOString() }]);
                });
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-blue-500 bg-blue-900/10' : 'border-[var(--border)] hover:border-blue-600/50'}`}
            >
              <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">Drag and drop files, or <label className="text-[var(--accent)] cursor-pointer hover:text-[var(--accent)]">
                browse
                <input type="file" multiple className="hidden" onChange={e => {
                  Array.from(e.target.files || []).forEach(f => {
                    updateField('documents', [...form.documents, { name: f.name, size: `${Math.round(f.size / 1024)}KB`, type: f.type, uploadedAt: new Date().toISOString() }]);
                  });
                }} />
              </label></p>
              <p className="text-xs text-[var(--text-muted)] mt-1">PDF, DOCX, XLSX supported</p>
            </div>
            {form.documents.length > 0 && (
              <div className="space-y-2">
                {form.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-[var(--bg-app)] border border-[var(--border)] rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-900/20 flex items-center justify-center">
                      <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{doc.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{doc.size} · {doc.type}</p>
                    </div>
                    <Badge variant="green">Stored</Badge>
                    <button onClick={() => updateField('documents', form.documents.filter((_, j) => j !== i))} className="text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-[var(--text-muted)]">Recommended: Franchise Agreement, FSSAI License, Brand Guidelines, Operations Manual</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <p className="text-sm text-[var(--text-secondary)]">Configure the revenue split model for this franchise brand.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 text-[var(--text-secondary)] font-medium">Fee Type</th>
                    <th className="text-center py-2 text-[var(--text-secondary)] font-medium">Percentage</th>
                    <th className="text-left py-2 text-[var(--text-secondary)] font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'royaltySplit' as const, label: 'Royalty Fee', description: 'Monthly royalty on gross revenue' },
                    { key: 'franchiseeFee' as const, label: 'Technology Fee', description: 'Platform and tech support fee' },
                    { key: 'marketingFund' as const, label: 'Marketing Fund', description: 'National marketing contribution' },
                  ].map(row => (
                    <tr key={row.key} className="border-b border-[var(--border)]/50">
                      <td className="py-3 text-[var(--text-primary)]">{row.label}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number" min={0} max={20} step={0.5}
                            value={form[row.key]}
                            onChange={e => {
                              const val = Math.max(0, Math.min(20, parseFloat(e.target.value) || 0));
                              updateField(row.key, val);
                            }}
                            className="w-16 bg-[var(--bg-app)] border border-[var(--border)] rounded px-2 py-1 text-center text-[var(--text-primary)] focus:outline-none focus:border-blue-600"
                          />
                          <span className="text-[var(--text-secondary)]">%</span>
                        </div>
                      </td>
                      <td className="py-3 text-[var(--text-muted)] text-xs">{row.description}</td>
                    </tr>
                  ))}
                  <tr className="bg-[var(--bg-app)]">
                    <td className="py-2 px-2 text-[var(--text-secondary)] font-medium text-sm">Total Brand Fees</td>
                    <td className="py-2 text-center text-[var(--accent)] font-bold font-mono">{(form.royaltySplit + form.franchiseeFee + form.marketingFund).toFixed(1)}%</td>
                    <td className="py-2 text-xs text-[var(--text-muted)]">Per revenue</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {form.royaltySplit + form.franchiseeFee + form.marketingFund > 15 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-900/10 border border-yellow-800/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
                <p className="text-xs text-yellow-300">Total fees exceed 15% — this may reduce franchisee attractiveness. Industry benchmark is 8-12%.</p>
              </div>
            )}
            <div className="flex justify-center">
              <div style={{ width: 180, height: 180 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={[
                      { name: 'Royalty', value: form.royaltySplit },
                      { name: 'Tech Fee', value: form.franchiseeFee },
                      { name: 'Marketing', value: form.marketingFund },
                      { name: 'Franchisee', value: Math.max(0, 100 - form.royaltySplit - form.franchiseeFee - form.marketingFund) },
                    ]} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="none">
                      <Cell fill="#2563EB" /><Cell fill="#10B981" /><Cell fill="#F59E0B" /><Cell fill="var(--border)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center gap-2 ml-4">
                {[
                  { color: '#2563EB', label: `Royalty ${form.royaltySplit}%` },
                  { color: '#10B981', label: `Tech Fee ${form.franchiseeFee}%` },
                  { color: '#F59E0B', label: `Marketing ${form.marketingFund}%` },
                  { color: 'var(--border)', label: `Franchisee ~${Math.max(0, 100 - form.royaltySplit - form.franchiseeFee - form.marketingFund).toFixed(0)}%` },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-[var(--text-secondary)]">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">AI Readiness Score</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Calculated from your brand profile data</p>
              </div>
              <div className="text-center">
                <p className={`text-4xl font-bold font-mono ${ragColor(total).color}`}>{total}</p>
                <Badge variant={ragColor(total).variant} className="mt-1">{ragColor(total).label}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: 'financial', label: 'Financial Readiness', desc: 'Based on revenue and outlet data' },
                { key: 'operational', label: 'Operational Maturity', desc: 'Based on existing outlet count' },
                { key: 'brand', label: 'Brand Strength', desc: 'Based on description completeness' },
                { key: 'expansion', label: 'Expansion Readiness', desc: 'Target and timeline defined' },
                { key: 'dataCompleteness', label: 'Data Completeness', desc: 'Profile fields filled' },
              ].map(d => {
                const score = Math.round(dims[d.key as keyof typeof dims]);
                const rag = ragColor(score);
                return (
                  <div key={d.key} className="p-3 bg-[var(--bg-app)] border border-[var(--border)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{d.label}</p>
                        <p className="text-xs text-[var(--text-muted)]">{d.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold font-mono ${rag.color}`}>{score}</span>
                        <Badge variant={rag.variant}>{rag.label}</Badge>
                      </div>
                    </div>
                    <ProgressBar value={score} color={score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'} size="sm" />
                  </div>
                );
              })}
            </div>
            <div className="p-3 bg-blue-900/10 border border-blue-800/20 rounded-lg">
              <p className="text-xs text-[var(--accent)]">
                {total >= 70 ? '✅ This brand is ready for franchise expansion. Proceed to onboarding.' :
                 total >= 40 ? '⚠️ Brand shows promise but needs improvement in highlighted areas before full expansion.' :
                 '❌ This brand needs significant preparation before franchise expansion is recommended.'}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => step === 0 ? navigate('/onboarding') : handleBack()} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} className="gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="success" onClick={handleSubmit} className="gap-2">
            <Check className="w-4 h-4" /> Submit Brand
          </Button>
        )}
      </div>
    </div>
  );
}
