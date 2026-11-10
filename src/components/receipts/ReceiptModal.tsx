import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, schoolConfig } = useSchool();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0">
        {/* Actions bar at top - hidden during print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm tracking-wide">Calizion Verified Digital Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Receipt Content */}
        <div id="printable-receipt" className="p-8 bg-white font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                CSC
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {schoolConfig.name}
                </h1>
                <p className="text-xs text-slate-600 italic">{schoolConfig.motto}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {schoolConfig.address} · Tel: {schoolConfig.phone} · Email: {schoolConfig.email}
            </p>
            <div className="mt-3 inline-block bg-slate-100 border border-slate-300 px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 rounded-sm">
              Official School Fees E-Receipt
            </div>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <div className="text-slate-500">Student Name</div>
              <div className="font-bold text-sm text-slate-900">{selectedReceipt.studentName}</div>
            </div>
            <div>
              <div className="text-slate-500">Receipt Number</div>
              <div className="font-mono font-bold text-sm text-emerald-800">{selectedReceipt.receiptNo}</div>
            </div>
            <div>
              <div className="text-slate-500">Admission No / Class</div>
              <div className="font-medium text-slate-900">
                {selectedReceipt.admissionNo} · {selectedReceipt.classArm}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Payment Date & Method</div>
              <div className="font-medium text-slate-900">
                {selectedReceipt.paymentDate} · {selectedReceipt.paymentMethod}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Academic Session / Term</div>
              <div className="font-medium text-slate-900">
                {selectedReceipt.session} · {selectedReceipt.term}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Bank / Gateway Reference</div>
              <div className="font-mono text-xs text-slate-700">{selectedReceipt.referenceNo}</div>
            </div>
          </div>

          {/* Fee Itemized Table */}
          <div className="mb-6">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 uppercase font-semibold">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-right">Amount (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedReceipt.feeBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-800">{item.item}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium tabular-nums text-slate-900">
                      ₦{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-72 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Term Charges:</span>
                <span className="font-mono tabular-nums">₦{selectedReceipt.totalTermFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-emerald-800 border-t border-slate-200 pt-2">
                <span>Amount Paid:</span>
                <span className="font-mono tabular-nums">₦{selectedReceipt.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Balance Outstanding:</span>
                <span className={`font-mono tabular-nums font-semibold ${selectedReceipt.remainingBalance > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                  ₦{selectedReceipt.remainingBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Stamp */}
          <div className="grid grid-cols-2 gap-8 items-end pt-4 border-t border-slate-200 text-xs">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 mb-1 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Payment Status: VERIFIED & CLEARED</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Issued by: {selectedReceipt.receivedBy}
                <br />
                Computer generated electronic receipt. Valid without physical signature.
              </p>
            </div>
            <div className="text-right">
              {/* Official Seal Mock */}
              <div className="inline-block p-2 border-2 border-dashed border-emerald-700 text-emerald-800 rounded text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider">Calizion Crown College</div>
                <div className="text-[11px] font-black tracking-widest text-emerald-900">BURSARY STAMP</div>
                <div className="text-[9px] text-emerald-700 font-mono">PAID & ACKNOWLEDGED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-100 text-center text-[11px] text-slate-500 border-t border-slate-200 no-print">
          Powered by Calizion SchoolSuite · Secure School Records & Automated Receipts
        </div>
      </div>
    </div>
  );
};
