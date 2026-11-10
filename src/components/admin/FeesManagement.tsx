import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentRecord } from '../../types';
import { CreditCard, Receipt, Search, Filter, Plus, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

export const FeesManagement: React.FC = () => {
  const { students, payments, classes, recordPayment, setSelectedReceipt, schoolConfig } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'debtors' | 'cleared'>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form for recording payment
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [amountPaidInput, setAmountPaidInput] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('Bank Transfer');
  const [breakdownNotes, setBreakdownNotes] = useState('Tuition & ICT Levies (Installment 1)');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const totalRevenue = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalBilled = students.reduce((acc, s) => acc + s.totalFeesOwed, 0);
  const totalOutstanding = Math.max(0, totalBilled - totalRevenue);

  const filteredStudents = students.filter((s) => {
    const balance = s.totalFeesOwed - s.totalFeesPaid;
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'debtors') return balance > 0;
    if (filterMode === 'cleared') return balance <= 0;
    return true;
  });

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || amountPaidInput <= 0) {
      alert('Please choose a student and enter a valid payment amount.');
      return;
    }

    const receipt = recordPayment({
      studentId: selectedStudentId,
      amountPaid: amountPaidInput,
      paymentMethod,
      breakdownNotes,
    });

    setIsRecordModalOpen(false);
    // Open receipt modal directly for preview & printing
    setSelectedReceipt(receipt);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">School Fees Ledger & Automatic Receipts</h2>
          <p className="text-xs text-slate-500">
            Track termly tuition, generate tamper-proof digital receipts, and monitor debt recovery.
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Fee Payment</span>
        </button>
      </div>

      {/* Financial Health Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block uppercase font-medium">Total Term Revenue Collected</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-800 mt-1 tabular-nums">
            ₦{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Total verified bursary credits</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block uppercase font-medium">Outstanding Balances (Debtors)</span>
          <div className="text-2xl font-extrabold font-mono text-amber-700 mt-1 tabular-nums">
            ₦{totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Recoverable student dues</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block uppercase font-medium">Automatic Receipt Count</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {payments.length} Stamped
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">100% digital audit trail</span>
        </div>
      </div>

      {/* Controls & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setFilterMode('debtors')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterMode === 'debtors' ? 'bg-white text-amber-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Debtors Only
          </button>
          <button
            onClick={() => setFilterMode('cleared')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterMode === 'cleared' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cleared (Fully Paid)
          </button>
        </div>
      </div>

      {/* Main Student Fee Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Student Billing & Clearance Ledger</h3>
          <span className="text-xs text-slate-500">{filteredStudents.length} Students Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Term Bill</th>
                <th className="py-3 px-3">Amount Paid</th>
                <th className="py-3 px-3">Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Receipt & Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const balance = st.totalFeesOwed - st.totalFeesPaid;
                const isCleared = balance <= 0;
                const studentPayments = payments.filter((p) => p.studentId === st.id);

                return (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {st.lastName}, {st.firstName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{st.admissionNo}</td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700 tabular-nums">
                      ₦{st.totalFeesOwed.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800 tabular-nums">
                      ₦{st.totalFeesPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold tabular-nums">
                      {isCleared ? (
                        <span className="text-slate-400">₦0</span>
                      ) : (
                        <span className="text-amber-800">₦{balance.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isCleared ? (
                        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 w-max">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {studentPayments.length > 0 ? (
                          <button
                            onClick={() => setSelectedReceipt(studentPayments[0])}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>View Receipt ({studentPayments[0].receiptNo.slice(-4)})</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No receipt yet</span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedStudentId(st.id);
                            setIsRecordModalOpen(true);
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                        >
                          + Record
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Record Bursary Fee Payment</h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Select Student Pupil *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-slate-50"
                >
                  {students.map((st) => {
                    const bal = st.totalFeesOwed - st.totalFeesPaid;
                    return (
                      <option key={st.id} value={st.id}>
                        {st.lastName}, {st.firstName} ({st.admissionNo}) — Owes: ₦{bal.toLocaleString()}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedStudent && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Term Dues:</span>{' '}
                    <strong className="font-mono">₦{selectedStudent.totalFeesOwed.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Already Paid:</span>{' '}
                    <strong className="font-mono text-emerald-800">₦{selectedStudent.totalFeesPaid.toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-medium mb-1">Amount Paid (₦) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Payment Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Bank Transfer">Bank Transfer (NIP)</option>
                    <option value="Paystack / Online Card">Paystack / Online Card</option>
                    <option value="POS">POS Terminal</option>
                    <option value="Cash">Cash at Bursary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Academic Session</label>
                  <input
                    type="text"
                    disabled
                    value={`${schoolConfig.currentSession} · ${schoolConfig.currentTerm}`}
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Fee Description / Installment Note</label>
                <input
                  type="text"
                  value={breakdownNotes}
                  onChange={(e) => setBreakdownNotes(e.target.value)}
                  placeholder="e.g. Tuition & Laboratory Levy"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Confirm & Generate Stamped Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
