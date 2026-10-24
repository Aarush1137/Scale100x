import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import CommandCenter from './pages/CommandCenter';
import OnboardingList from './pages/onboarding/OnboardingList';
import OnboardingWizard from './pages/onboarding/OnboardingWizard';
import ROIEngine from './pages/ROIEngine';
import CollateralStudio from './pages/CollateralStudio';
import AgentCenter from './pages/agents/AgentCenter';
import WhatsAppWorkspace from './pages/agents/WhatsAppWorkspace';
import SalesCRM from './pages/SalesCRM';
import Automations from './pages/Automations';
import Settings from './pages/Settings';
import { ToastContainer } from './components/ui';

export default function App() {
  return (
    <BrowserRouter basename="/Scale100x">
      <AppShell>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/onboarding" element={<OnboardingList />} />
          <Route path="/onboarding/new" element={<OnboardingWizard />} />
          <Route path="/onboarding/wizard/:sessionId" element={<OnboardingWizard />} />
          <Route path="/roi" element={<ROIEngine />} />
          <Route path="/collateral" element={<CollateralStudio />} />
          <Route path="/agents" element={<AgentCenter />} />
          <Route path="/agents/whatsapp" element={<WhatsAppWorkspace />} />
          <Route path="/crm" element={<SalesCRM />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
      <ToastContainer />
    </BrowserRouter>
  );
}
