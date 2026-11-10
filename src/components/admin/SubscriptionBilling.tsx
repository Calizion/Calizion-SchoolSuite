import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolTier } from '../../types';
import { Crown, Check, Zap, Globe, Laptop, ShieldCheck, ArrowRight } from 'lucide-react';

export const SubscriptionBilling: React.FC = () => {
  const { schoolConfig, updateTier } = useSchool();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'termly' | 'annual'>('termly');

  const plans: {
    tier: SchoolTier;
    monthlyPrice: number;
    termlyPrice: number;
    annualPrice: number;
    target: string;
    description: string;
    features: string[];
    highlight?: boolean;
  }[] = [
    {
      tier: 'Basic',
      monthlyPrice: 10000,
      termlyPrice: 27000,
      annualPrice: 100000,
      target: 'Nursery, primary & tutorial centres',
      description: 'Core school administration eliminating paper records and manual math.',
      features: [
        'Up to 150 active pupils & students',
        'Student registration & admission register',
        'School fees ledger & automated receipts',
        'Terminal examination result computation',
        'Official printable report cards',
        'Standard email support',
      ],
    },
    {
      tier: 'Standard',
      monthlyPrice: 20000,
      termlyPrice: 54000,
      annualPrice: 200000,
      target: 'Growing secondary schools & academies',
      description: 'Comprehensive digital suite with CBT platform and parent portal.',
      features: [
        'Up to 500 active students',
        'All Basic features included',
        'Computer-Based Testing (CBT) mock portal',
        'Automated parent & student portals',
        'Daily roll call & absence SMS alerts',
        'Scheme of work & lesson notes approval',
        '500 complimentary communication units',
      ],
      highlight: true,
    },
    {
      tier: 'Premium',
      monthlyPrice: 40000,
      termlyPrice: 108000,
      annualPrice: 400000,
      target: 'Prestigious private colleges & multi-branch groups',
      description: 'Enterprise institutional power with custom domain and unlimited scale.',
      features: [
        'Unlimited student enrollment',
        'All Standard features included',
        'Custom school website with .edu.ng domain',
        'Dedicated WhatsApp Business API gateway',
        'E-learning digital syllabus repository',
        'Multi-term comparative performance analytics',
        '2,000 complimentary communication units',
        'Priority 24/7 designated account manager',
      ],
    },
  ];

  const handleSelectPlan = (tier: SchoolTier) => {
    updateTier(tier);
    alert(`School subscription successfully updated to Calizion ${tier} Plan!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 uppercase font-semibold">
            <span>Calizion Recurring School Subscription</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Licensing & Tier Plans</h2>
          <p className="text-xs text-slate-500">
            Predictable recurring termly or annual subscription model designed for Nigerian & African educational institutions.
          </p>
        </div>

        {/* Billing cycle tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Equivalent
          </button>
          <button
            onClick={() => setBillingCycle('termly')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              billingCycle === 'termly' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Termly (Per Term · Recommended)
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Annual (Full Session)
          </button>
        </div>
      </div>

      {/* Current Active Plan Banner */}
      <div className="p-4 bg-emerald-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-300 shrink-0" />
          <div>
            <div className="text-xs text-emerald-300 font-medium">Currently Active Subscription</div>
            <div className="text-lg font-black tracking-tight">
              Calizion {schoolConfig.currentTier} Edition — {schoolConfig.name}
            </div>
            <div className="text-xs text-emerald-200 mt-0.5">
              Next renewal due: {schoolConfig.subscriptionRenewalDate} · Auto-renew via Direct Debit / Remita
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-800 border border-emerald-700 px-3 py-1.5 rounded-lg text-emerald-200 font-mono">
            Active Status: Verified
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = schoolConfig.currentTier === p.tier;
          const displayPrice =
            billingCycle === 'monthly'
              ? `₦${p.monthlyPrice.toLocaleString()}`
              : billingCycle === 'termly'
              ? `₦${p.termlyPrice.toLocaleString()}`
              : `₦${p.annualPrice.toLocaleString()}`;

          const cadenceLabel =
            billingCycle === 'monthly' ? '/ month equivalent' : billingCycle === 'termly' ? '/ academic term' : '/ full session';

          return (
            <div
              key={p.tier}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all ${
                p.highlight
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-md relative'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular for Secondary Schools
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.tier} Package</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{p.target}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
                      {displayPrice}
                    </span>
                    <span className="text-xs text-slate-500">{cadenceLabel}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-slate-100 text-slate-500 cursor-default"
                  >
                    Current Active Tier
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(p.tier)}
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors shadow-xs"
                  >
                    Switch to {p.tier} Plan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* High Margin Recurring Add-On Modules (User prompt: charge separately for SMS, CBT hosting, website) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Optional Modular Add-Ons & Recurring Services</h3>
          <p className="text-xs text-slate-500">
            Expand institutional capability with specialized digital infrastructure plugins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Add-on 1 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Globe className="w-4 h-4" />
              <span>School Website & Domain Hosting</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Custom responsive school portal with .edu.ng domain, SSL security, and online student admission application forms.
            </p>
            <div className="font-mono font-bold text-slate-900 pt-1">₦35,000 / year</div>
          </div>

          {/* Add-on 2 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Laptop className="w-4 h-4" />
              <span>Dedicated CBT High-Concurrency Booster</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Host unified entrance exams and mock examinations for up to 1,500 simultaneous test candidates with zero latency.
            </p>
            <div className="font-mono font-bold text-slate-900 pt-1">₦15,000 / exam session</div>
          </div>

          {/* Add-on 3 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Zap className="w-4 h-4" />
              <span>Automated WhatsApp DND Gateway</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Delivers rich school fee payment receipts with PDF attachments directly to parents&apos; WhatsApp numbers.
            </p>
            <div className="font-mono font-bold text-slate-900 pt-1">₦4.50 / message credit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
