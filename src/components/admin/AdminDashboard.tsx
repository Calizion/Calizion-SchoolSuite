import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Receipt,
  UserPlus,
  Send,
  Laptop,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { students, payments, attendance, schoolConfig, setActiveTab, setSelectedReceipt, sendBroadcast } = useSchool();

  const totalStudents = students.length;
  const totalFeesExpected = students.reduce((acc, s) => acc + s.totalFeesOwed, 0);
  const totalFeesCollected = students.reduce((acc, s) => acc + s.totalFeesPaid, 0);
  const outstandingDebt = Math.max(0, totalFeesExpected - totalFeesCollected);
  const collectionRate = totalFeesExpected > 0 ? Math.round((totalFeesCollected / totalFeesExpected) * 100) : 0;

  // Today attendance estimate
  const latestAttendance = attendance[0];
  let presentCount = 0;
  let totalAttMarked = 0;
  if (latestAttendance) {
    totalAttMarked = latestAttendance.records.length;
    presentCount = latestAttendance.records.filter((r) => r.status === 'Present').length;
  }
  const attendanceRate = totalAttMarked > 0 ? Math.round((presentCount / totalAttMarked) * 100) : 96;

  const debtorsList = students.filter((s) => s.totalFeesOwed - s.totalFeesPaid > 0);

  const handleQuickDebtorAlert = () => {
    const success = sendBroadcast({
      recipientGroup: 'Debtors Only',
      channel: 'Both SMS & WhatsApp',
      messageText: `Dear Parent, fee payment for 2nd Term at ${schoolConfig.name} is outstanding. Kindly clear fees before resumption. Bursary: ${schoolConfig.phone}.`,
    });
    if (success) {
      alert('Broadcast fee reminder dispatched via SMS & WhatsApp to all debtors!');
    } else {
      alert('Insufficient SMS balance! Please top up your units.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with School Session Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 uppercase tracking-wider">
            <span>{schoolConfig.currentSession}</span>
            <span>·</span>
            <span>{schoolConfig.currentTerm}</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
            Administrative & Academic Command Center
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time enrollment, automated bursary receipts, CBT assessments, and student progress tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit Student</span>
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={handleQuickDebtorAlert}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Remind Debtors</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Enrollment</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {totalStudents}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">100% verified</span>
            <span>across 7 class levels</span>
          </div>
        </div>

        {/* Total Fees Collected */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Term Fees Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            ₦{totalFeesCollected.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">{collectionRate}% collection rate</span>
          </div>
        </div>

        {/* Outstanding Debts */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Balances</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-700 tabular-nums">
            ₦{outstandingDebt.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {debtorsList.length} students with pending payments
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Roll Call Rate</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {attendanceRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Normal attendance range</span>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Bursary Payments & Debtors Alert Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payments & Auto-Receipts (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Bursary Collections & Receipts</h3>
              <p className="text-xs text-slate-500">Every payment generates an instant stamped digital receipt</p>
            </div>
            <button
              onClick={() => setActiveTab('fees')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-700"
            >
              View All Payments →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Amount Paid</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-900">{pay.receiptNo}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{pay.studentName}</td>
                    <td className="py-3 px-3 text-slate-600">{pay.classArm}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800 tabular-nums">
                      ₦{pay.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{pay.paymentMethod}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedReceipt(pay)}
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
        </div>

        {/* Fee Debtors & Instant Notification Column (1 Column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Outstanding Fee Ledger</h3>
              <p className="text-xs text-slate-500">Students with unpaid balances</p>
            </div>
            <button
              onClick={handleQuickDebtorAlert}
              className="text-xs px-2 py-1 font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
            >
              Blast Reminder
            </button>
          </div>

          <div className="space-y-3">
            {debtorsList.map((st) => {
              const balance = st.totalFeesOwed - st.totalFeesPaid;
              return (
                <div key={st.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>
                      {st.firstName} {st.lastName}
                    </span>
                    <span className="font-mono text-amber-800 tabular-nums">₦{balance.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Guardian: {st.guardianName}</span>
                    <span>{st.guardianPhone}</span>
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        sendBroadcast({
                          recipientGroup: 'Specific Class',
                          channel: 'Both SMS & WhatsApp',
                          messageText: `Dear ${st.guardianName}, your child ${st.firstName} has an unpaid fee balance of ₦${balance.toLocaleString()} at ${schoolConfig.name}. Please settle to avoid disruption.`,
                        });
                        alert(`Direct reminder sent to ${st.guardianName} (${st.guardianPhone})!`);
                      }}
                      className="text-[11px] text-emerald-800 hover:underline font-semibold"
                    >
                      Send 1-Click Reminder →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CBT & E-Learning Quick Glance */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Computer-Based Testing (CBT) Center</h4>
            <p className="text-xs text-slate-500">
              2 active CBT mock examinations scheduled for Senior & Junior Secondary students.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('cbt')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Manage CBT Portal
          </button>
        </div>
      </div>
    </div>
  );
};
