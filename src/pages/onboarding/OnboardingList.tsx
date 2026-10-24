import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Coffee, CheckCircle, Clock, Edit } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Card, Badge, ScoreBadge } from '../../components/ui';
import { formatDate } from '../../lib/utils';

export default function OnboardingList() {
  const { data } = useStore();
  const navigate = useNavigate();

  const drafts = data.onboardingSessions.filter(s => !s.completed);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Brand Onboarding</h1>
          <p className="text-sm text-slate-500 mt-0.5">Onboard new franchise brands to the platform</p>
        </div>
        <Button onClick={() => navigate('/onboarding/new')} className="gap-2">
          <Plus className="w-4 h-4" /> Onboard New Brand
        </Button>
      </div>

      {drafts.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium text-yellow-400 mb-3">⚡ In-Progress Drafts</p>
          <div className="space-y-2">
            {drafts.map(session => (
              <div key={session.id} className="flex items-center gap-3 p-3 bg-yellow-900/10 border border-yellow-800/20 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{(session.data.brandName as string) || 'Untitled Brand'}</p>
                  <p className="text-xs text-slate-500">Step {session.currentStep + 1} of 4 — saved {formatDate(session.updatedAt)}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => navigate(`/onboarding/wizard/${session.id}`)}>
                  <Edit className="w-3 h-3" /> Resume
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.brands.map(brand => (
          <Card key={brand.id} className="p-5 hover:border-blue-600/40 transition-colors cursor-pointer" onClick={() => navigate(`/onboarding/brand/${brand.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div className="flex gap-2 items-center">
                <ScoreBadge score={brand.readinessScore} />
                <Badge variant={brand.status === 'active' ? 'green' : brand.status === 'onboarded' ? 'blue' : 'yellow'}>
                  {brand.status}
                </Badge>
              </div>
            </div>
            <h3 className="font-semibold text-slate-100">{brand.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{brand.industry} · {brand.hq}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0A0A0F] rounded-lg p-2">
                <p className="text-slate-500">Outlets</p>
                <p className="text-slate-200 font-medium">{brand.outlets} / {brand.targetOutlets}</p>
              </div>
              <div className="bg-[#0A0A0F] rounded-lg p-2">
                <p className="text-slate-500">Timeline</p>
                <p className="text-slate-200 font-medium">{brand.timeline}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Onboarded {formatDate(brand.createdAt)}
            </div>
          </Card>
        ))}
      </div>

      {data.brands.length === 0 && (
        <div className="text-center py-16">
          <Coffee className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No brands onboarded yet</p>
          <p className="text-slate-600 text-sm mt-1">Start by onboarding your first franchise brand</p>
          <Button className="mt-4" onClick={() => navigate('/onboarding/new')}>
            <Plus className="w-4 h-4" /> Onboard First Brand
          </Button>
        </div>
      )}
    </div>
  );
}
