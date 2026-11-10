import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SmsBroadcast as SmsType } from '../../types';
import { MessageSquare, Send, Plus, CheckCircle2, Zap, PhoneCall } from 'lucide-react';

export const SmsBroadcast: React.FC = () => {
  const { schoolConfig, smsBroadcasts, sendBroadcast, topUpSms, students } = useSchool();
  const [recipientGroup, setRecipientGroup] = useState<SmsType['recipientGroup']>('All Parents');
  const [channel, setChannel] = useState<SmsType['channel']>('Both SMS & WhatsApp');
  const [messageText, setMessageText] = useState('');
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  const debtorsCount = students.filter((s) => s.totalFeesOwed - s.totalFeesPaid > 0).length;

  const quickTemplates = [
    {
      title: 'Term Fees Due Reminder',
      text: `Dear Parent, a gentle reminder that 2nd term school fees for ${schoolConfig.name} are now due. Please settle outstanding balances to ensure uninterrupted classroom & CBT portal access. Thank you.`,
      group: 'Debtors Only' as const,
    },
    {
      title: 'Termly Report Cards Ready',
      text: `Calizion Notification: 2nd Term Continuous Assessment and Terminal Examination Report Cards have been uploaded to the Parent Portal. Please log in to download your ward's report card.`,
      group: 'All Parents' as const,
    },
    {
      title: 'School Resumption Announcement',
      text: `Notice: ${schoolConfig.name} will officially resume for academic activities on Monday, 27th April 2026. All students are expected at 7:45 AM in complete school uniform.`,
      group: 'All Parents' as const,
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      alert('Please enter message text to broadcast.');
      return;
    }

    const ok = sendBroadcast({
      recipientGroup,
      channel,
      messageText,
    });

    if (ok) {
      alert(`Broadcast successfully dispatched via ${channel}! Units deducted.`);
      setMessageText('');
    } else {
      alert('Insufficient SMS balance! Please top up your units.');
      setIsTopUpModalOpen(true);
    }
  };

  const handleApplyTemplate = (tpl: typeof quickTemplates[0]) => {
    setMessageText(tpl.text);
    setRecipientGroup(tpl.group);
  };

  const handleBuyUnits = (units: number, cost: number) => {
    topUpSms(units, cost);
    setIsTopUpModalOpen(false);
    alert(`Successfully credited ${units.toLocaleString()} SMS/WhatsApp units to ${schoolConfig.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            SMS & WhatsApp Notification Gateway
          </h2>
          <p className="text-xs text-slate-500">
            Instant school broadcast center for fee recovery notices, daily absence triggers, and emergency alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
            <Zap className="w-4 h-4 text-emerald-700" />
            <span className="text-emerald-950 font-medium">Balance:</span>
            <strong className="font-mono text-emerald-900 font-bold">{schoolConfig.smsCreditsBalance.toLocaleString()} units</strong>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Top Up Units</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Broadcast Composer & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Compose Automated Dispatch</h3>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Target Audience</label>
                <select
                  value={recipientGroup}
                  onChange={(e) => setRecipientGroup(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="All Parents">All Parents & Guardians ({students.length} recipients)</option>
                  <option value="Debtors Only">Debtors Only ({debtorsCount} recipients)</option>
                  <option value="Staff Only">Teaching & Non-Teaching Staff (24 recipients)</option>
                  <option value="Specific Class">Class Representatives (30 recipients)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Dispatch Gateway / Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="Both SMS & WhatsApp">Both SMS & WhatsApp (High Deliverability)</option>
                  <option value="WhatsApp">WhatsApp Official Business API Only</option>
                  <option value="SMS">Direct GSM Telecom SMS Only</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-600 font-medium">Broadcast Message Text *</label>
                <span className="text-[11px] font-mono text-slate-400">
                  {messageText.length} characters · {Math.ceil(messageText.length / 160) || 1} SMS page(s)
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your official announcement or fee reminder here..."
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
              Sender ID: <strong className="text-slate-800 font-mono">CALIZION</strong> (Regulated DND-bypass header registered with NCC & Telcos).
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transmit Broadcast Now</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Verified Templates (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Pre-Approved School Templates</h3>
          <p className="text-xs text-slate-500">One-click templates tailored for school administration.</p>

          <div className="space-y-3">
            {quickTemplates.map((tpl, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyTemplate(tpl)}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>{tpl.title}</span>
                  <span className="text-[10px] text-emerald-800 font-normal">{tpl.group}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{tpl.text}</p>
                <span className="text-[10px] text-emerald-700 font-semibold block pt-1">
                  Click to use template →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast History Log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Broadcast Transmissions History
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{smsBroadcasts.length} Dispatches Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Target Group</th>
                <th className="py-3 px-3">Gateway</th>
                <th className="py-3 px-3">Message Snippet</th>
                <th className="py-3 px-3">Units Used</th>
                <th className="py-3 px-4 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {smsBroadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">{b.sentAt}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{b.recipientGroup}</td>
                  <td className="py-3 px-3 text-slate-600">{b.channel}</td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{b.messageText}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.costUnits}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal (Recurring Add-on Monetization) */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Purchase SMS & WhatsApp Unit Credits</h3>
              </div>
              <button
                onClick={() => setIsTopUpModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Calizion SchoolSuite bulk units never expire and can be used for automated fees collection notices,
                examination result alerts, and daily attendance roll call reports.
              </p>

              <div className="space-y-3">
                <div
                  onClick={() => handleBuyUnits(1000, 5000)}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">1,000 Communication Units</div>
                    <div className="text-[11px] text-slate-500">₦5.00 per unit · Standard delivery</div>
                  </div>
                  <div className="font-mono font-bold text-emerald-800 text-sm">₦5,000</div>
                </div>

                <div
                  onClick={() => handleBuyUnits(2500, 11500)}
                  className="p-3.5 rounded-lg border-2 border-emerald-600 bg-emerald-50/50 cursor-pointer transition-all flex items-center justify-between relative"
                >
                  <span className="absolute -top-2 right-4 bg-emerald-700 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                    Most Popular
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">2,500 Communication Units</div>
                    <div className="text-[11px] text-slate-500">₦4.60 per unit · Priority gateway</div>
                  </div>
                  <div className="font-mono font-bold text-emerald-800 text-sm">₦11,500</div>
                </div>

                <div
                  onClick={() => handleBuyUnits(6000, 25000)}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">6,000 Communication Units</div>
                    <div className="text-[11px] text-slate-500">₦4.16 per unit · Institutional volume</div>
                  </div>
                  <div className="font-mono font-bold text-emerald-800 text-sm">₦25,000</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 text-center">
                Secure payment verified via Paystack / Direct Bank Transfer.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
