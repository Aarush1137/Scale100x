import { v4 as uuidv4 } from 'uuid';
import type { AppData, Brand, Lead, Conversation, Message, CollateralAsset, AuditEvent, AgentConfig, Workflow, WorkflowRun, FinancialScenario } from '../types';

const now = new Date().toISOString();
const d = (offset: number) => new Date(Date.now() - offset * 60 * 60 * 1000).toISOString();

// Brand IDs
const freshbrewId = 'brand-freshbrew-001';

// Lead IDs
const rahulId = 'lead-rahul-001';
const priyaId = 'lead-priya-002';
const amitId = 'lead-amit-003';
const snehaId = 'lead-sneha-004';
const kiranId = 'lead-kiran-005';
const deepakId = 'lead-deepak-006';
const meghaId = 'lead-megha-007';
const vikramId = 'lead-vikram-008';

// Conversation IDs
const convRahulId = 'conv-rahul-001';
const convPriyaId = 'conv-priya-002';
const convAmitId = 'conv-amit-003';
const convSnehaId = 'conv-sneha-004';
const convKiranId = 'conv-kiran-005';

export const brands: Brand[] = [
  {
    id: freshbrewId,
    name: 'FreshBrew QSR',
    industry: 'Quick Service Restaurant',
    description: 'Premium tea and coffee chain with focus on freshness and speed. Known for our signature cold brews and masala chai variants.',
    hq: 'Mumbai',
    outlets: 12,
    targetOutlets: 50,
    timeline: '2 years',
    monthlyRevenue: 800000,
    contactName: 'Arjun Mehta',
    contactEmail: 'arjun@freshbrew.in',
    contactPhone: '+91 9876543210',
    readinessScore: 78,
    status: 'active',
    createdAt: d(720),
    updatedAt: d(24),
  }
];

export const leads: Lead[] = [
  {
    id: rahulId,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 9812345678',
    city: 'Mumbai',
    budget: 2000000,
    stage: 'Qualified',
    source: 'Meta Ads',
    priority: 'High',
    intentScore: 87,
    brandId: freshbrewId,
    ownerId: 'user-system',
    notes: 'Highly interested candidate. Has prior F&B experience. Ready to invest within 3 months.',
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    conversationId: convRahulId,
    tasks: [
      { id: uuidv4(), title: 'Send franchise deck', completed: true, dueDate: d(48), createdAt: d(72) },
      { id: uuidv4(), title: 'Schedule ROI call', completed: false, dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), createdAt: d(24) },
    ],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Meta Ads', timestamp: d(168) },
      { id: uuidv4(), type: 'stage_change', description: 'Moved from New to Contacted', timestamp: d(120) },
      { id: uuidv4(), type: 'message', description: 'WhatsApp conversation initiated', timestamp: d(96) },
      { id: uuidv4(), type: 'stage_change', description: 'Moved from Contacted to Qualified', timestamp: d(24) },
    ],
    createdAt: d(168),
    updatedAt: d(24),
  },
  {
    id: priyaId,
    name: 'Priya Patel',
    email: 'priya.patel@hotmail.com',
    phone: '+91 9823456789',
    city: 'Bangalore',
    budget: 1500000,
    stage: 'Contacted',
    source: 'Website',
    priority: 'Medium',
    intentScore: 54,
    brandId: freshbrewId,
    ownerId: 'user-system',
    notes: 'Exploring multiple franchise options. Wants detailed comparison before committing.',
    followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    conversationId: convPriyaId,
    tasks: [
      { id: uuidv4(), title: 'Send comparison document', completed: false, dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), createdAt: d(48) },
    ],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Website form', timestamp: d(96) },
      { id: uuidv4(), type: 'stage_change', description: 'Moved from New to Contacted', timestamp: d(72) },
    ],
    createdAt: d(96),
    updatedAt: d(48),
  },
  {
    id: amitId,
    name: 'Amit Kumar',
    email: 'amit.kumar@yahoo.com',
    phone: '+91 9834567890',
    city: 'Delhi',
    budget: 2500000,
    stage: 'Consultation',
    source: 'Referral',
    priority: 'High',
    intentScore: 91,
    brandId: freshbrewId,
    ownerId: 'user-consultant-1',
    notes: 'Ready to invest. Wants legal documentation review. Referred by existing franchisee.',
    followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    conversationId: convAmitId,
    tasks: [
      { id: uuidv4(), title: 'Prepare franchise agreement draft', completed: false, dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), createdAt: d(12) },
      { id: uuidv4(), title: 'Connect with legal team', completed: false, dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), createdAt: d(12) },
    ],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Referral', timestamp: d(200) },
      { id: uuidv4(), type: 'stage_change', description: 'Moved through stages to Consultation', timestamp: d(48) },
      { id: uuidv4(), type: 'human_takeover', description: 'Human takeover - Legal questions', timestamp: d(8) },
    ],
    createdAt: d(200),
    updatedAt: d(8),
  },
  {
    id: snehaId,
    name: 'Sneha Verma',
    email: 'sneha.verma@gmail.com',
    phone: '+91 9845678901',
    city: 'Pune',
    budget: 1800000,
    stage: 'New',
    source: 'Meta Ads',
    priority: 'Medium',
    intentScore: 61,
    brandId: freshbrewId,
    ownerId: 'user-system',
    notes: 'Wants detailed document package before deciding.',
    followUpDate: null,
    conversationId: convSnehaId,
    tasks: [],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Meta Ads', timestamp: d(36) },
    ],
    createdAt: d(36),
    updatedAt: d(36),
  },
  {
    id: kiranId,
    name: 'Kiran Reddy',
    email: 'kiran.reddy@gmail.com',
    phone: '+91 9856789012',
    city: 'Hyderabad',
    budget: 1200000,
    stage: 'New',
    source: 'Meta Ads',
    priority: 'Low',
    intentScore: 32,
    brandId: freshbrewId,
    ownerId: 'user-system',
    notes: 'Complaint about late response time from initial contact.',
    followUpDate: null,
    conversationId: convKiranId,
    tasks: [],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Meta Ads', timestamp: d(18) },
    ],
    createdAt: d(18),
    updatedAt: d(18),
  },
  {
    id: deepakId,
    name: 'Deepak Nair',
    email: 'deepak.nair@gmail.com',
    phone: '+91 9867890123',
    city: 'Kochi',
    budget: 2200000,
    stage: 'Proposal',
    source: 'LinkedIn',
    priority: 'High',
    intentScore: 79,
    brandId: freshbrewId,
    ownerId: 'user-consultant-1',
    notes: 'Proposal sent. Awaiting review.',
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    conversationId: null,
    tasks: [],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via LinkedIn', timestamp: d(336) },
      { id: uuidv4(), type: 'stage_change', description: 'Advanced to Proposal stage', timestamp: d(72) },
    ],
    createdAt: d(336),
    updatedAt: d(72),
  },
  {
    id: meghaId,
    name: 'Megha Singh',
    email: 'megha.singh@outlook.com',
    phone: '+91 9878901234',
    city: 'Jaipur',
    budget: 1600000,
    stage: 'Won',
    source: 'Referral',
    priority: 'High',
    intentScore: 95,
    brandId: freshbrewId,
    ownerId: 'user-consultant-2',
    notes: 'Deal closed! Franchise agreement signed.',
    followUpDate: null,
    conversationId: null,
    tasks: [],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Referral', timestamp: d(500) },
      { id: uuidv4(), type: 'stage_change', description: 'Deal won - Agreement signed', timestamp: d(100) },
    ],
    createdAt: d(500),
    updatedAt: d(100),
  },
  {
    id: vikramId,
    name: 'Vikram Agarwal',
    email: 'vikram.agarwal@gmail.com',
    phone: '+91 9889012345',
    city: 'Chennai',
    budget: 1400000,
    stage: 'Lost',
    source: 'Cold Outreach',
    priority: 'Low',
    intentScore: 28,
    brandId: freshbrewId,
    ownerId: 'user-system',
    notes: 'Chose competitor brand.',
    followUpDate: null,
    conversationId: null,
    tasks: [],
    activities: [
      { id: uuidv4(), type: 'created', description: 'Lead created via Cold Outreach', timestamp: d(400) },
      { id: uuidv4(), type: 'stage_change', description: 'Marked as Lost - chose competitor', timestamp: d(200) },
    ],
    createdAt: d(400),
    updatedAt: d(200),
  },
];

export const conversations: Conversation[] = [
  {
    id: convRahulId,
    leadId: rahulId,
    leadName: 'Rahul Sharma',
    phone: '+91 9812345678',
    status: 'AI Active',
    intentScore: 87,
    intentLabel: 'High Intent - Investment Ready',
    lastMessage: 'Can you tell me more about the ROI timeline?',
    lastMessageAt: d(2),
    unreadCount: 1,
    escalationReason: null,
    humanTakeoverAt: null,
    assignedTo: null,
    internalNotes: 'Strong candidate. Verify financial capacity before advancing.',
    qualification: { city: 'Mumbai', budget: '₹20 Lakhs', experience: '5 years F&B', timeline: '3 months', intentScore: 87 },
    createdAt: d(96),
    updatedAt: d(2),
  },
  {
    id: convPriyaId,
    leadId: priyaId,
    leadName: 'Priya Patel',
    phone: '+91 9823456789',
    status: 'AI Active',
    intentScore: 54,
    intentLabel: 'Medium Intent - Exploring Options',
    lastMessage: 'What cities are you expanding to?',
    lastMessageAt: d(12),
    unreadCount: 0,
    escalationReason: null,
    humanTakeoverAt: null,
    assignedTo: null,
    internalNotes: '',
    qualification: { city: 'Bangalore', budget: '₹15 Lakhs', experience: 'No prior experience', timeline: '6 months', intentScore: 54 },
    createdAt: d(72),
    updatedAt: d(12),
  },
  {
    id: convAmitId,
    leadId: amitId,
    leadName: 'Amit Kumar',
    phone: '+91 9834567890',
    status: 'Human Active',
    intentScore: 91,
    intentLabel: 'Very High Intent - Ready to Sign',
    lastMessage: 'I need to review the legal terms before signing anything.',
    lastMessageAt: d(8),
    unreadCount: 2,
    escalationReason: 'Legal/financial commitment questions',
    humanTakeoverAt: d(8),
    assignedTo: 'Ravi Consultant',
    internalNotes: 'Escalated due to legal questions. Connect with legal team immediately.',
    qualification: { city: 'Delhi', budget: '₹25 Lakhs', experience: '10 years retail', timeline: 'Immediate', intentScore: 91 },
    createdAt: d(120),
    updatedAt: d(8),
  },
  {
    id: convSnehaId,
    leadId: snehaId,
    leadName: 'Sneha Verma',
    phone: '+91 9845678901',
    status: 'AI Active',
    intentScore: 61,
    intentLabel: 'Medium Intent - Needs Information',
    lastMessage: 'Please share the franchise documents.',
    lastMessageAt: d(6),
    unreadCount: 1,
    escalationReason: null,
    humanTakeoverAt: null,
    assignedTo: null,
    internalNotes: '',
    qualification: { city: 'Pune', budget: '₹18 Lakhs', experience: '2 years F&B', timeline: '4 months', intentScore: 61 },
    createdAt: d(36),
    updatedAt: d(6),
  },
  {
    id: convKiranId,
    leadId: kiranId,
    leadName: 'Kiran Reddy',
    phone: '+91 9856789012',
    status: 'Resolved',
    intentScore: 32,
    intentLabel: 'Low Intent - Service Complaint',
    lastMessage: 'Thank you for addressing my concern.',
    lastMessageAt: d(4),
    unreadCount: 0,
    escalationReason: 'Complaint - slow response',
    humanTakeoverAt: d(10),
    assignedTo: 'Support Team',
    internalNotes: 'Complaint resolved. Follow up in 2 weeks to re-engage.',
    qualification: { city: 'Hyderabad', budget: '₹12 Lakhs', experience: 'No experience', timeline: 'Not decided', intentScore: 32 },
    createdAt: d(18),
    updatedAt: d(4),
  },
];

export const messages: Message[] = [
  // Rahul conversation
  { id: uuidv4(), conversationId: convRahulId, direction: 'inbound', sender: 'lead', content: 'Hi, I saw your ad about FreshBrew franchise. I\'m interested in opening one in Mumbai.', intentLabel: 'Initial Interest', confidence: 0.82, timestamp: d(96) },
  { id: uuidv4(), conversationId: convRahulId, direction: 'outbound', sender: 'ai', content: 'Hello Rahul! Welcome to FreshBrew Franchise Family! 🎉 I\'m so excited to hear you\'re interested in bringing FreshBrew to Mumbai. It\'s one of our top target cities!\n\nTo help you better, could I know:\n1. Your approximate investment budget?\n2. Do you have any F&B experience?', intentLabel: 'Qualification', confidence: 0.95, timestamp: d(95) },
  { id: uuidv4(), conversationId: convRahulId, direction: 'inbound', sender: 'lead', content: 'Budget is around 18-20 lakhs. I\'ve been in F&B for 5 years, managed a restaurant chain.', intentLabel: 'Budget Qualification', confidence: 0.91, timestamp: d(90) },
  { id: uuidv4(), conversationId: convRahulId, direction: 'outbound', sender: 'ai', content: 'Excellent Rahul! Your profile is a perfect fit. With ₹18-20 lakhs budget and 5 years of F&B experience, you\'re exactly who we\'re looking for!\n\nHere\'s a quick overview:\n• Initial Investment: ₹18 Lakhs\n• Monthly Revenue Potential: ₹6-10 Lakhs\n• Break-even: 18-24 months\n• Royalty: 6% of revenue\n\nWould you like me to share our detailed franchise brochure?', intentLabel: 'Information Sharing', confidence: 0.93, timestamp: d(89) },
  { id: uuidv4(), conversationId: convRahulId, direction: 'inbound', sender: 'lead', content: 'Yes please! Also what\'s the support like after setup?', intentLabel: 'Post-setup Query', confidence: 0.78, timestamp: d(48) },
  { id: uuidv4(), conversationId: convRahulId, direction: 'outbound', sender: 'ai', content: 'Absolutely! We provide comprehensive support:\n\n✅ 2-week intensive training\n✅ Store setup assistance\n✅ Marketing launch campaign\n✅ Dedicated relationship manager\n✅ Monthly performance reviews\n✅ Tech platform access\n\nI\'ve shared the brochure on email. Let me also schedule a call with our franchise consultant to walk you through the ROI model?', intentLabel: 'Value Proposition', confidence: 0.97, timestamp: d(47) },
  { id: uuidv4(), conversationId: convRahulId, direction: 'inbound', sender: 'lead', content: 'Can you tell me more about the ROI timeline?', intentLabel: 'ROI Query', confidence: 0.89, timestamp: d(2) },

  // Priya conversation
  { id: uuidv4(), conversationId: convPriyaId, direction: 'inbound', sender: 'lead', content: 'Hello, I\'m looking at various franchise options. Heard about FreshBrew.', intentLabel: 'Exploration', confidence: 0.65, timestamp: d(72) },
  { id: uuidv4(), conversationId: convPriyaId, direction: 'outbound', sender: 'ai', content: 'Hi Priya! Great to hear from you. FreshBrew is one of India\'s fastest growing QSR franchises. We\'d love to tell you more!\n\nWhat\'s your primary interest - the brand strength, ROI potential, or operational model?', intentLabel: 'Discovery', confidence: 0.88, timestamp: d(71) },
  { id: uuidv4(), conversationId: convPriyaId, direction: 'inbound', sender: 'lead', content: 'Mostly ROI and how it compares to other options. Budget is 15 lakhs.', intentLabel: 'Comparison Intent', confidence: 0.72, timestamp: d(60) },
  { id: uuidv4(), conversationId: convPriyaId, direction: 'outbound', sender: 'ai', content: 'Smart thinking Priya! Here\'s how FreshBrew compares:\n\n📊 FreshBrew vs Market Average:\n• Investment: ₹18L (market: ₹25-40L)\n• Break-even: 18 months (market: 24-36 months)\n• Support: Full stack (market: varies)\n\nWith ₹15L budget, you\'d qualify for our smaller format outlet which has shown ₹5-7L monthly revenue. Interested in exploring this?', intentLabel: 'Competitive Positioning', confidence: 0.91, timestamp: d(59) },
  { id: uuidv4(), conversationId: convPriyaId, direction: 'inbound', sender: 'lead', content: 'What cities are you expanding to?', intentLabel: 'Location Query', confidence: 0.68, timestamp: d(12) },

  // Amit conversation
  { id: uuidv4(), conversationId: convAmitId, direction: 'inbound', sender: 'lead', content: 'Hi, I was referred by Megha Singh. She said great things about FreshBrew.', intentLabel: 'Referral', confidence: 0.85, timestamp: d(120) },
  { id: uuidv4(), conversationId: convAmitId, direction: 'outbound', sender: 'ai', content: 'Welcome Amit! Megha is one of our star franchisees - you\'re in great hands with her referral! 🌟\n\nAs a referred candidate, you get priority processing and a dedicated consultant. What\'s your investment capacity and preferred city?', intentLabel: 'Referral Welcome', confidence: 0.96, timestamp: d(119) },
  { id: uuidv4(), conversationId: convAmitId, direction: 'inbound', sender: 'lead', content: 'Budget is 25 lakhs. Looking at Delhi. Have 10 years retail experience.', intentLabel: 'Strong Qualification', confidence: 0.94, timestamp: d(100) },
  { id: uuidv4(), conversationId: convAmitId, direction: 'outbound', sender: 'ai', content: 'Amit, you\'re an ideal candidate! Delhi is our priority expansion city and your retail background is perfect.\n\nI\'m connecting you directly with our senior consultant Ravi for a detailed consultation. Can we schedule a video call this week?', intentLabel: 'Fast Track', confidence: 0.98, timestamp: d(99) },
  { id: uuidv4(), conversationId: convAmitId, direction: 'inbound', sender: 'lead', content: 'Sure. But before that, I need to review all legal terms. What does the franchise agreement cover?', intentLabel: 'Legal Query', confidence: 0.88, timestamp: d(20) },
  { id: uuidv4(), conversationId: convAmitId, direction: 'inbound', sender: 'lead', content: 'I need to review the legal terms before signing anything.', intentLabel: 'Legal Commitment', confidence: 0.91, timestamp: d(8) },
  { id: uuidv4(), conversationId: convAmitId, direction: 'outbound', sender: 'human', content: 'Hi Amit, this is Ravi from the FreshBrew franchise team. I\'ve taken over this conversation personally. I\'ll be sharing the complete franchise agreement with all legal terms within the next 2 hours. Can we schedule a call at 4 PM today?', intentLabel: 'Human Response', confidence: 1.0, timestamp: d(7) },

  // Sneha conversation
  { id: uuidv4(), conversationId: convSnehaId, direction: 'inbound', sender: 'lead', content: 'Hi, I saw your Facebook ad. Interested in FreshBrew franchise in Pune.', intentLabel: 'Initial Interest', confidence: 0.75, timestamp: d(36) },
  { id: uuidv4(), conversationId: convSnehaId, direction: 'outbound', sender: 'ai', content: 'Hi Sneha! Pune is a fantastic market and we\'d love to expand there. Can you share your budget range and any F&B experience?', intentLabel: 'Qualification', confidence: 0.90, timestamp: d(35) },
  { id: uuidv4(), conversationId: convSnehaId, direction: 'inbound', sender: 'lead', content: 'Budget 18 lakhs, 2 years in F&B. What documents do I need to apply?', intentLabel: 'Document Query', confidence: 0.80, timestamp: d(24) },
  { id: uuidv4(), conversationId: convSnehaId, direction: 'outbound', sender: 'ai', content: 'Great Sneha! Here are the documents needed:\n\n📋 Required Documents:\n1. Identity proof (Aadhar/PAN)\n2. Address proof\n3. Bank statements (6 months)\n4. IT returns (2 years)\n5. Property documents (owned/lease agreement)\n\nI\'ll email you the complete checklist and application form right away!', intentLabel: 'Document Info', confidence: 0.95, timestamp: d(23) },
  { id: uuidv4(), conversationId: convSnehaId, direction: 'inbound', sender: 'lead', content: 'Please share the franchise documents.', intentLabel: 'Document Request', confidence: 0.85, timestamp: d(6) },

  // Kiran conversation
  { id: uuidv4(), conversationId: convKiranId, direction: 'inbound', sender: 'lead', content: 'I filled a form 2 weeks ago and nobody called me back. Very disappointed.', intentLabel: 'Complaint', confidence: 0.88, timestamp: d(18) },
  { id: uuidv4(), conversationId: convKiranId, direction: 'outbound', sender: 'ai', content: 'Hi Kiran, I sincerely apologize for the delay. That is not the experience we want to provide. Let me escalate this immediately to our team.\n\nCould you share your preferred contact time so we can call you ASAP?', intentLabel: 'Complaint Acknowledgement', confidence: 0.85, timestamp: d(17) },
  { id: uuidv4(), conversationId: convKiranId, direction: 'inbound', sender: 'lead', content: 'I want to speak to a human, not a bot.', intentLabel: 'Human Request', confidence: 0.96, timestamp: d(16) },
  { id: uuidv4(), conversationId: convKiranId, direction: 'outbound', sender: 'human', content: 'Hi Kiran, I\'m Preethi from the FreshBrew franchise support team. I\'m personally taking over this conversation. I\'m very sorry for the delay - this was unacceptable. I\'m scheduling a call with you immediately. What time works - today 3 PM or 5 PM?', intentLabel: 'Human Takeover', confidence: 1.0, timestamp: d(15) },
  { id: uuidv4(), conversationId: convKiranId, direction: 'inbound', sender: 'lead', content: '5 PM works.', intentLabel: 'Response', confidence: 0.9, timestamp: d(14) },
  { id: uuidv4(), conversationId: convKiranId, direction: 'outbound', sender: 'human', content: 'Perfect! I\'ve scheduled the call for 5 PM today. You\'ll receive a calendar invite shortly. Thank you for your patience Kiran.', intentLabel: 'Resolution', confidence: 1.0, timestamp: d(13) },
  { id: uuidv4(), conversationId: convKiranId, direction: 'inbound', sender: 'lead', content: 'Thank you for addressing my concern.', intentLabel: 'Satisfied', confidence: 0.75, timestamp: d(4) },
];

export const assets: CollateralAsset[] = [
  {
    id: 'asset-pitch-deck-001',
    name: 'FreshBrew Franchise Pitch Deck',
    type: 'Pitch Deck',
    brandId: freshbrewId,
    status: 'approved',
    content: `# FreshBrew QSR — Franchise Opportunity

## DEMO CONTENT — Template Generated

---

## The FreshBrew Opportunity

Join India's fastest-growing premium tea and coffee QSR franchise.

**Why FreshBrew?**
- ₹18L initial investment — lowest in premium QSR segment
- 12 successful outlets in Maharashtra
- Proven 18-month breakeven model
- Full operational support stack

---

## Market Opportunity

India's QSR market is ₹65,000 Cr and growing at 18% YoY. Tea & coffee segment leads with:
- 3.2 billion cups consumed annually
- Premium segment growing at 25% YoY
- Tier 2 & 3 cities largely underserved

---

## Investment Overview

| Item | Amount |
|------|--------|
| Initial Investment | ₹18,00,000 |
| Working Capital | ₹2,00,000 |
| Monthly Revenue (projected) | ₹8,00,000 |
| Operating Margin | ~24% |
| Royalty Fee | 6% of revenue |
| Break-even | 18-24 months |

---

## Support Package

✅ 2-week hands-on training at HQ
✅ Store design & setup guidance
✅ Grand opening marketing campaign
✅ Dedicated relationship manager
✅ Monthly performance reviews
✅ Proprietary franchise management app

---

## Why Now?

- 50 outlet expansion plan over 24 months
- Priority cities: Mumbai, Delhi, Bangalore, Hyderabad, Pune
- Limited franchise slots available

---

*Contact: arjun@freshbrew.in | +91 9876543210*`,
    targetAudience: 'Aspiring franchise investors with F&B background',
    campaignObjective: 'Franchise recruitment',
    language: 'English',
    tone: 'Professional, Aspirational',
    versions: [],
    createdAt: d(300),
    updatedAt: d(48),
  },
  {
    id: 'asset-whatsapp-script-001',
    name: 'FreshBrew WhatsApp Intro Script',
    type: 'WhatsApp Script',
    brandId: freshbrewId,
    status: 'draft',
    content: `## DEMO CONTENT — Template Generated

---

**WhatsApp Intro Script — FreshBrew Franchise Enquiry**

---

**Message 1 (Immediate on lead capture):**

Hi {name}! 👋

Thank you for your interest in the FreshBrew franchise! I'm your dedicated franchise advisor.

FreshBrew is one of India's most exciting QSR brands — premium teas and cold brews with an asset-light franchise model.

Quick details:
📍 Investment: ₹18 Lakhs
📈 Monthly revenue potential: ₹6-10 Lakhs
⏱️ Break-even: 18-24 months

Interested in knowing more? Just reply YES and I'll share everything! 🎉

---

**Message 2 (On YES reply):**

Awesome {name}! You've taken the first step towards financial freedom!

Tell me about yourself:
1️⃣ Which city are you based in?
2️⃣ What's your approximate investment capacity?
3️⃣ Do you have any F&B experience?

---

**Message 3 (After qualification):**

Perfect! Based on your profile, you're an excellent fit for FreshBrew in {city}.

I'm sharing:
📑 Complete franchise brochure
💰 Detailed ROI model
📋 Application checklist

Shall I also schedule a call with our senior franchise consultant?`,
    targetAudience: 'Cold leads from Meta Ads',
    campaignObjective: 'Lead qualification and conversion',
    language: 'English + Hindi mix',
    tone: 'Friendly, Conversational',
    versions: [],
    createdAt: d(200),
    updatedAt: d(72),
  },
  {
    id: 'asset-brochure-001',
    name: 'FreshBrew Sales Brochure',
    type: 'Sales Brochure',
    brandId: freshbrewId,
    status: 'review',
    content: `## DEMO CONTENT — Template Generated

---

# FreshBrew QSR
## Your Franchise. Your Future.

---

### The Brand Promise

FreshBrew is built on one belief: **fresh beats fast**. Every cup crafted with premium ingredients, every outlet designed for speed and experience.

Since 2021, we've served 2 million+ cups across 12 outlets in Maharashtra. Now we're expanding — and we want passionate entrepreneurs like you.

---

### Numbers That Matter

| Metric | Value |
|--------|-------|
| Outlets (2024) | 12 |
| Avg Monthly Revenue | ₹8,00,000 |
| Customer Retention | 68% |
| NPS Score | 74 |
| Franchise Support Rating | 4.8/5 |

---

### What You Get

**Training & Onboarding**
Full 14-day training program covering operations, staff management, inventory, and customer service.

**Marketing Support**
Launch campaign, social media templates, local SEO setup, and Meta Ads playbook.

**Technology**
POS system, inventory management, CRM, and analytics dashboard included.

**Ongoing Support**
Monthly visits, 24/7 helpline, quarterly business reviews.

---

### Investment Summary

*Initial Investment: ₹18,00,000*
*Working Capital: ₹2,00,000*
*Total: ₹20,00,000*

Financing options available through our banking partners.

---

### Ready to Start?

Contact us: franchise@freshbrew.in
WhatsApp: +91 9876543210`,
    targetAudience: 'High-income individuals, existing business owners',
    campaignObjective: 'Brand awareness and franchise recruitment',
    language: 'English',
    tone: 'Premium, Trustworthy',
    versions: [],
    createdAt: d(150),
    updatedAt: d(96),
  },
];

export const events: AuditEvent[] = [
  { id: uuidv4(), type: 'brand_created', description: 'FreshBrew QSR brand onboarded', entityType: 'brand', entityId: freshbrewId, userId: 'user-system', metadata: {}, timestamp: d(720) },
  { id: uuidv4(), type: 'lead_created', description: 'Lead created: Rahul Sharma (Meta Ads)', entityType: 'lead', entityId: rahulId, userId: 'user-system', metadata: { source: 'Meta Ads' }, timestamp: d(168) },
  { id: uuidv4(), type: 'lead_created', description: 'Lead created: Priya Patel (Website)', entityType: 'lead', entityId: priyaId, userId: 'user-system', metadata: { source: 'Website' }, timestamp: d(96) },
  { id: uuidv4(), type: 'lead_created', description: 'Lead created: Amit Kumar (Referral)', entityType: 'lead', entityId: amitId, userId: 'user-system', metadata: { source: 'Referral' }, timestamp: d(200) },
  { id: uuidv4(), type: 'conversation_started', description: 'WhatsApp conversation started with Rahul Sharma', entityType: 'conversation', entityId: convRahulId, userId: 'user-system', metadata: {}, timestamp: d(96) },
  { id: uuidv4(), type: 'human_takeover', description: 'Human takeover on Amit Kumar conversation - Legal questions', entityType: 'conversation', entityId: convAmitId, userId: 'user-consultant-1', metadata: { reason: 'Legal/financial commitment questions' }, timestamp: d(8) },
  { id: uuidv4(), type: 'human_takeover', description: 'Human takeover on Kiran Reddy conversation - Complaint', entityType: 'conversation', entityId: convKiranId, userId: 'user-support', metadata: { reason: 'Customer complaint' }, timestamp: d(16) },
  { id: uuidv4(), type: 'stage_change', description: 'Rahul Sharma: New → Contacted', entityType: 'lead', entityId: rahulId, userId: 'user-system', metadata: { from: 'New', to: 'Contacted' }, timestamp: d(120) },
  { id: uuidv4(), type: 'stage_change', description: 'Rahul Sharma: Contacted → Qualified', entityType: 'lead', entityId: rahulId, userId: 'user-system', metadata: { from: 'Contacted', to: 'Qualified' }, timestamp: d(24) },
  { id: uuidv4(), type: 'stage_change', description: 'Amit Kumar: advanced to Consultation', entityType: 'lead', entityId: amitId, userId: 'user-consultant-1', metadata: { from: 'Qualification', to: 'Consultation' }, timestamp: d(48) },
  { id: uuidv4(), type: 'lead_won', description: 'Deal won: Megha Singh signed franchise agreement', entityType: 'lead', entityId: meghaId, userId: 'user-consultant-2', metadata: {}, timestamp: d(100) },
  { id: uuidv4(), type: 'asset_created', description: 'Collateral created: FreshBrew Pitch Deck', entityType: 'asset', entityId: 'asset-pitch-deck-001', userId: 'user-system', metadata: {}, timestamp: d(300) },
  { id: uuidv4(), type: 'asset_approved', description: 'FreshBrew Pitch Deck approved', entityType: 'asset', entityId: 'asset-pitch-deck-001', userId: 'user-admin', metadata: {}, timestamp: d(48) },
  { id: uuidv4(), type: 'workflow_run', description: 'Automation workflow executed for Sneha Verma lead', entityType: 'workflow', entityId: 'workflow-001', userId: 'user-system', metadata: { leadName: 'Sneha Verma' }, timestamp: d(36) },
  { id: uuidv4(), type: 'workflow_run', description: 'Automation workflow executed for Kiran Reddy lead', entityType: 'workflow', entityId: 'workflow-001', userId: 'user-system', metadata: { leadName: 'Kiran Reddy' }, timestamp: d(18) },
  { id: uuidv4(), type: 'message_sent', description: 'AI message sent to Rahul Sharma', entityType: 'message', entityId: 'msg-rahul-5', userId: 'ai-agent', metadata: { channel: 'WhatsApp' }, timestamp: d(47) },
  { id: uuidv4(), type: 'message_sent', description: 'Human message sent to Amit Kumar by Ravi', entityType: 'message', entityId: 'msg-amit-6', userId: 'user-consultant-1', metadata: { channel: 'WhatsApp' }, timestamp: d(7) },
  { id: uuidv4(), type: 'agent_paused', description: 'Voice AI Agent paused - not configured', entityType: 'agent', entityId: 'agent-voice-001', userId: 'user-admin', metadata: {}, timestamp: d(240) },
  { id: uuidv4(), type: 'lead_created', description: 'Lead created: Deepak Nair (LinkedIn)', entityType: 'lead', entityId: deepakId, userId: 'user-system', metadata: { source: 'LinkedIn' }, timestamp: d(336) },
  { id: uuidv4(), type: 'settings_changed', description: 'Qualification threshold updated to score 60', entityType: 'settings', entityId: 'settings-agents', userId: 'user-admin', metadata: { field: 'qualificationThreshold', value: 60 }, timestamp: d(120) },
  { id: uuidv4(), type: 'conversation_resolved', description: 'Conversation with Kiran Reddy resolved', entityType: 'conversation', entityId: convKiranId, userId: 'user-support', metadata: {}, timestamp: d(4) },
];

export const agents: AgentConfig[] = [
  {
    id: 'agent-meta-001',
    name: 'Meta Ads Agent',
    type: 'meta_ads',
    status: 'active',
    purpose: 'Captures and qualifies leads from Meta ad campaigns, routes to WhatsApp workflow',
    conversationCount: 34,
    qualificationThreshold: 60,
    escalationKeywords: ['speak to human', 'call me', 'not interested'],
    responseDelay: 0,
    lastActivity: d(2),
    config: { campaigns: ['FreshBrew Mumbai', 'FreshBrew Delhi'], budget: 15000, ctr: 2.4 },
  },
  {
    id: 'agent-whatsapp-001',
    name: 'WhatsApp AI Agent',
    type: 'whatsapp',
    status: 'active',
    purpose: 'Engages franchise enquiries on WhatsApp, qualifies leads, auto-escalates to humans',
    conversationCount: 47,
    qualificationThreshold: 60,
    escalationKeywords: ['speak to human', 'speak to agent', 'talk to person', 'legal', 'contract', 'lawsuit', 'refund'],
    responseDelay: 30,
    lastActivity: d(1),
    config: { provider: 'Wati (DEMO)', autoReply: true, businessHours: '9am-9pm IST' },
  },
  {
    id: 'agent-voice-001',
    name: 'Voice AI Agent',
    type: 'voice',
    status: 'paused',
    purpose: 'Makes automated qualification calls to high-intent leads, transcribes and updates CRM',
    conversationCount: 0,
    qualificationThreshold: 75,
    escalationKeywords: [],
    responseDelay: 0,
    lastActivity: d(240),
    config: { provider: 'Sarvam AI (DEMO - not configured)', language: 'Hindi+English' },
  },
  {
    id: 'agent-email-001',
    name: 'Email Agent',
    type: 'email',
    status: 'active',
    purpose: 'Sends franchise information sequences, ROI reports, and follow-up nurture emails',
    conversationCount: 28,
    qualificationThreshold: 40,
    escalationKeywords: ['unsubscribe', 'remove me', 'stop emails'],
    responseDelay: 0,
    lastActivity: d(4),
    config: { provider: 'Mailmodo (DEMO)', sequences: ['Intro Sequence', 'ROI Sequence', 'Nurture'] },
  },
];

export const workflows: Workflow[] = [
  {
    id: 'workflow-001',
    name: 'Meta Ads → Franchise Qualification Pipeline',
    status: 'running',
    steps: [
      { id: 'step-1', name: 'Meta Ad Click', type: 'trigger', status: 'success', description: 'Lead clicks Facebook/Instagram ad and fills lead form', dataPassed: ['name', 'phone', 'city', 'email'] },
      { id: 'step-2', name: 'Lead Captured', type: 'action', status: 'success', description: 'Webhook from Meta Ads → CRM entry created', dataPassed: ['leadId', 'source', 'campaignId', 'timestamp'] },
      { id: 'step-3', name: 'WhatsApp Intro Sent', type: 'action', status: 'success', description: 'AI agent sends welcome message via WhatsApp API', dataPassed: ['name', 'phone', 'templateId'] },
      { id: 'step-4', name: 'AI Qualification', type: 'action', status: 'success', description: 'AI asks qualifying questions over WhatsApp conversation', dataPassed: ['city', 'budget', 'experience', 'timeline', 'intentScore'] },
      { id: 'step-5', name: 'Score Evaluation', type: 'condition', status: 'success', description: 'If intent score > 60: advance to consultation. Else: nurture sequence', dataPassed: ['intentScore', 'qualificationData'] },
      { id: 'step-6', name: 'Human Consultant Review', type: 'human_checkpoint', status: 'idle', description: 'Senior consultant reviews qualified lead profile and schedules consultation', dataPassed: ['fullLeadProfile', 'conversationHistory', 'intentScore'] },
    ],
    runsCount: 47,
    leadsProcessed: 42,
    lastRunAt: d(2),
    createdAt: d(500),
  },
];

export const workflowRuns: WorkflowRun[] = Array.from({ length: 15 }, (_, i) => ({
  id: uuidv4(),
  workflowId: 'workflow-001',
  status: i % 8 === 0 ? 'error' : 'success' as 'success' | 'error',
  triggeredBy: 'Meta Ads Webhook',
  leadId: [rahulId, priyaId, snehaId, kiranId, deepakId][i % 5],
  leadName: ['Rahul Sharma', 'Priya Patel', 'Sneha Verma', 'Kiran Reddy', 'Deepak Nair'][i % 5],
  steps: [
    { stepId: 'step-1', status: 'success', timestamp: d(i * 8 + 4) },
    { stepId: 'step-2', status: 'success', timestamp: d(i * 8 + 3) },
    { stepId: 'step-3', status: 'success', timestamp: d(i * 8 + 2) },
    { stepId: 'step-4', status: i % 8 === 0 ? 'error' : 'success', timestamp: d(i * 8 + 1) },
  ],
  startedAt: d(i * 8 + 5),
  completedAt: d(i * 8),
}));

export const financialScenarios: FinancialScenario[] = [
  {
    id: 'scenario-default',
    brandId: freshbrewId,
    name: 'FreshBrew Base Model (₹8L)',
    monthlyRevenue: 800000,
    initialInvestment: 1800000,
    cogsPercent: 35,
    employeeCosts: 120000,
    rent: 80000,
    utilities: 25000,
    marketingPercent: 5,
    royaltyPercent: 6,
    annualGrowthRate: 15,
    createdAt: d(100),
  },
];

export const seedData: AppData = {
  brands,
  leads,
  conversations,
  messages,
  assets,
  events,
  agents,
  workflows,
  workflowRuns,
  onboardingSessions: [],
  financialScenarios,
};
