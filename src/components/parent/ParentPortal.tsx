import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Users, CreditCard, Award, CalendarCheck, Receipt, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    reportCards,
    setSelectedReportCard,
    payments,
    recordPayment,
    setSelectedReceipt,
    schoolConfig,
    classes,
  } = useSchool();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(85000);
  const [payMethod, setPayMethod] = useState<'Paystack / Online Card' | 'Bank Transfer'>('Paystack / Online Card');
  const [parentMessage, setParentMessage] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);

  const ward = students.find((s) => s.id === selectedStudentId) || students[0];
  const wardClass = classes.find((c) => c.id === ward?.classId);
  const wardReport = reportCards[ward?.id || ''] || reportCards['std-001'];
  const wardPayments = payments.filter((p) => p.studentId === ward?.id);
  const balance = (ward?.totalFeesOwed || 0) - (ward?.totalFeesPaid || 0);

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    const receipt = recordPayment({
      studentId: ward.id,
      amountPaid: payAmount,
      paymentMethod: payMethod,
      breakdownNotes: 'Parent Portal Electronic Payment (Paystack Gateway)',
    });

    setIsPaymentModalOpen(false);
    setSelectedReceipt(receipt);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;
    setMessageSuccess(true);
    setTimeout(() => {
      setMessageSuccess(false);
      setParentMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Parent Welcome Strip */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Guardian Access: {ward?.guardianName}</h2>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Guardian
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Phone: {ward?.guardianPhone} · Address: {ward?.guardianAddress}
          </p>
        </div>

        {/* Ward switcher */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Viewing Ward:</label>
          <select
            value={ward?.id}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg text-xs font-bold focus:ring-1 focus:ring-emerald-600"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.firstName} {st.lastName} ({st.admissionNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ward Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Fee Due Card */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">School Fees Balance</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900">
              {balance > 0 ? (
                <span className="text-amber-700">₦{balance.toLocaleString()}</span>
              ) : (
                <span className="text-emerald-700">Fully Cleared (₦0)</span>
              )}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Paid: ₦{(ward?.totalFeesPaid || 0).toLocaleString()} / ₦{(ward?.totalFeesOwed || 0).toLocaleString()}
            </span>
          </div>

          <div className="pt-4">
            {balance > 0 ? (
              <button
                onClick={() => {
                  setPayAmount(balance);
                  setIsPaymentModalOpen(true);
                }}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
              >
                Pay Outstanding Fees Online
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded block text-center">
                All 2nd Term Fees Paid ✓
              </span>
            )}
          </div>
        </div>

        {/* Academic Performance */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Academic Standing</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
              {wardReport?.averageScore || 87.6}% Average
            </div>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">
              Rank: {wardReport?.classPosition || 2}
              {wardReport?.classPosition === 1 ? 'st' : wardReport?.classPosition === 2 ? 'nd' : 'rd'} in {wardClass?.name || 'Class'}
            </span>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                if (wardReport) setSelectedReportCard(wardReport);
              }}
              className="w-full py-2 px-3 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Download Report Card (PDF)
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Attendance & Punctuality</span>
              <CalendarCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
              {wardReport ? Math.round((wardReport.timesPresent / wardReport.timesSchoolOpened) * 100) : 98}%
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Present: {wardReport?.timesPresent || 64} days · Absent: {wardReport?.timesAbsent || 1} day
            </span>
          </div>

          <div className="pt-4 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Regular attendance record</span>
          </div>
        </div>
      </div>

      {/* Receipts & Payments History for Ward */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ward Bursary Payment Receipts</h3>
            <p className="text-xs text-slate-500">Official digital receipts with verified barcode & school stamp.</p>
          </div>
        </div>

        {wardPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Amount Paid</th>
                  <th className="py-2.5 px-3">Balance</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wardPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{p.receiptNo}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.paymentDate}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.paymentMethod}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      ₦{p.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums">
                      ₦{p.remainingBalance.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                      >
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded">
            No payments logged yet for this ward.
          </div>
        )}
      </div>

      {/* Direct Messaging to School */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Direct Communication to Class Tutor & Principal</h3>
          <p className="text-xs text-slate-500">
            Submit questions regarding your ward&apos;s academic performance, health notices, or bus routing.
          </p>
        </div>

        {messageSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
            Your message has been delivered to the Form Tutor and School Principal. You will receive an SMS response shortly.
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
          <textarea
            rows={3}
            required
            value={parentMessage}
            onChange={(e) => setParentMessage(e.target.value)}
            placeholder="Type your inquiry or message here..."
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 text-slate-900"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Send Message to School</span>
            </button>
          </div>
        </form>
      </div>

      {/* Online Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Pay School Fees Online</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayFee} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700">
                <div>Ward: <strong className="text-slate-900">{ward?.firstName} {ward?.lastName}</strong> ({ward?.admissionNo})</div>
                <div>Class: <strong className="text-slate-900">{wardClass?.name} ({ward?.arm})</strong></div>
                <div>Current Outstanding Debt: <strong className="text-amber-800 font-mono">₦{balance.toLocaleString()}</strong></div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Amount (₦) *</label>
                <input
                  type="number"
                  required
                  min="5000"
                  max={balance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-base font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Select Payment Gateway</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="Paystack / Online Card">Paystack (Debit Card / USSD / Bank Transfer)</option>
                  <option value="Bank Transfer">Direct Instant Bank Transfer (NIP)</option>
                </select>
              </div>

              <div className="text-[11px] text-slate-500 bg-emerald-50 p-3 rounded border border-emerald-200">
                Upon transaction confirmation, your official stamped school fee receipt will be generated automatically and downloadable immediately.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Pay ₦{payAmount.toLocaleString()} Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
