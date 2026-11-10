import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';

export const PrintableReportCard: React.FC = () => {
  const { selectedReportCard, setSelectedReportCard, students, schoolConfig } = useSchool();

  if (!selectedReportCard) return null;

  const student = students.find((s) => s.id === selectedReportCard.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0 my-8 max-h-[92vh] overflow-y-auto">
        {/* Top Control Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Termly Continuous Assessment & Examination Report</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Report Card</span>
            </button>
            <button
              onClick={() => setSelectedReportCard(null)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div id="report-card-sheet" className="p-8 bg-white font-sans text-slate-800">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-emerald-900 text-white flex flex-col items-center justify-center font-bold shadow-xs">
                  <span className="text-xl">CSC</span>
                  <span className="text-[9px] tracking-widest text-emerald-300">EST. {schoolConfig.establishedYear}</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                    {schoolConfig.name}
                  </h1>
                  <p className="text-xs text-slate-600 italic font-medium">{schoolConfig.motto}</p>
                  <p className="text-[11px] text-slate-500">
                    {schoolConfig.address} · {schoolConfig.phone} · {schoolConfig.email}
                  </p>
                </div>
              </div>

              {/* Student Passport Photo */}
              <div className="text-center">
                <img
                  src={student?.passportUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="Student Passport"
                  className="w-20 h-24 object-cover rounded border-2 border-slate-300 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-slate-400 uppercase font-mono block mt-1">Official ID</span>
              </div>
            </div>

            <div className="mt-4 py-1.5 px-4 bg-emerald-900 text-white text-center text-xs font-bold uppercase tracking-wider rounded-xs">
              Continuous Assessment & Terminal Examination Report Card · {selectedReportCard.term} ({selectedReportCard.session})
            </div>
          </div>

          {/* Student Bio-Data & Attendance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs mb-5">
            <div>
              <span className="text-slate-500 block text-[11px]">Pupil / Student Name</span>
              <span className="font-bold text-slate-900">
                {student ? `${student.lastName}, ${student.firstName} ${student.middleName || ''}` : 'Student Name'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Admission No.</span>
              <span className="font-mono font-bold text-slate-900">{student?.admissionNo || 'CAL/2024/000'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Class & Arm</span>
              <span className="font-bold text-slate-900">{selectedReportCard.classArm}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Sex / Blood Group</span>
              <span className="font-medium text-slate-900">
                {student?.gender} · {student?.bloodGroup} ({student?.genotype})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Times School Opened</span>
              <span className="font-mono font-semibold">{selectedReportCard.timesSchoolOpened} days</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Times Present</span>
              <span className="font-mono font-semibold text-emerald-700">{selectedReportCard.timesPresent} days</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Times Absent</span>
              <span className="font-mono font-semibold text-amber-700">{selectedReportCard.timesAbsent} days</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Attendance Rate</span>
              <span className="font-mono font-bold text-emerald-800">
                {Math.round((selectedReportCard.timesPresent / selectedReportCard.timesSchoolOpened) * 100)}%
              </span>
            </div>
          </div>

          {/* Cognitive Domain Table */}
          <div className="mb-5 overflow-x-auto">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Section A: Cognitive Domain (Academic Achievement)</span>
              <span className="text-[11px] text-slate-500 lowercase font-normal">
                Grading: A1 (75-100), B2 (70-74), B3 (65-69), C4-C6 (50-64), D7-E8 (40-49), F9 (0-39)
              </span>
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-[11px]">
                  <th className="py-1.5 px-2 border-r border-slate-300">Subject</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">CA1 (15)</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">CA2 (15)</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">Mid (10)</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">Exam (60)</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center bg-slate-200/60 font-bold">Total (100)</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">Grade</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">Class Avg</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">Highest</th>
                  <th className="py-1.5 px-2 border-r border-slate-300 text-center">Pos</th>
                  <th className="py-1.5 px-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedReportCard.scores.map((score, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-1.5 px-2 font-medium text-slate-900 border-r border-slate-200">{score.subjectName}</td>
                    <td className="py-1.5 px-2 text-center font-mono border-r border-slate-200">{score.ca1}</td>
                    <td className="py-1.5 px-2 text-center font-mono border-r border-slate-200">{score.ca2}</td>
                    <td className="py-1.5 px-2 text-center font-mono border-r border-slate-200">{score.midTerm}</td>
                    <td className="py-1.5 px-2 text-center font-mono border-r border-slate-200">{score.exam}</td>
                    <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-900 bg-slate-100/50 border-r border-slate-200">
                      {score.total}
                    </td>
                    <td className="py-1.5 px-2 text-center font-bold border-r border-slate-200">
                      <span className={score.grade.startsWith('A') ? 'text-emerald-700' : score.grade.startsWith('B') ? 'text-blue-700' : 'text-slate-700'}>
                        {score.grade}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono text-slate-500 border-r border-slate-200">{score.classAverage}</td>
                    <td className="py-1.5 px-2 text-center font-mono text-slate-500 border-r border-slate-200">{score.classHighest}</td>
                    <td className="py-1.5 px-2 text-center font-mono text-slate-600 border-r border-slate-200">
                      {score.positionInSubject}
                      {score.positionInSubject === 1 ? 'st' : score.positionInSubject === 2 ? 'nd' : score.positionInSubject === 3 ? 'rd' : 'th'}
                    </td>
                    <td className="py-1.5 px-2 text-slate-700 text-[11px]">{score.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Summary Strip */}
          <div className="grid grid-cols-4 gap-3 bg-slate-900 text-white p-3 rounded mb-5 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Marks Obtained</span>
              <span className="font-mono text-base font-bold">
                {selectedReportCard.totalScore} / {selectedReportCard.scores.length * 100}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Term Average</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {selectedReportCard.averageScore}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Overall Class Position</span>
              <span className="font-mono text-base font-bold text-amber-300">
                {selectedReportCard.classPosition}
                {selectedReportCard.classPosition === 1 ? 'st' : selectedReportCard.classPosition === 2 ? 'nd' : selectedReportCard.classPosition === 3 ? 'rd' : 'th'}{' '}
                out of {selectedReportCard.totalStudentsInClass}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Outcome Decision</span>
              <span className="font-bold text-emerald-300 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> Passed with Distinction
              </span>
            </div>
          </div>

          {/* Affective & Psychomotor Domains (Nigerian Curriculum Standard) */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-5">
            {/* Affective */}
            <div className="border border-slate-300 rounded p-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">
                Section B: Affective Traits (Rating: 1 - 5)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                {Object.entries(selectedReportCard.affectiveDomain).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="capitalize text-slate-600">{key}:</span>
                    <span className="font-mono font-bold text-emerald-800">{val} / 5</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Psychomotor */}
            <div className="border border-slate-300 rounded p-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">
                Section C: Psychomotor Skills (Rating: 1 - 5)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                {Object.entries(selectedReportCard.psychomotorDomain).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="capitalize text-slate-600">{key}:</span>
                    <span className="font-mono font-bold text-emerald-800">{val} / 5</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments & Endorsements */}
          <div className="space-y-3 mb-5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block mb-1">Class Teacher&apos;s Remarks:</span>
              <p className="text-slate-700 italic">&ldquo;{selectedReportCard.classTeacherComment}&rdquo;</p>
              <div className="mt-2 text-[11px] text-slate-500 text-right">
                Signature: __________________ (Form Tutor)
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block mb-1">Principal&apos;s Remarks & Recommendation:</span>
              <p className="text-slate-700 italic">&ldquo;{selectedReportCard.principalComment}&rdquo;</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                <span>Principal: {schoolConfig.principalName}</span>
                <span className="font-semibold text-emerald-800">[Calizion Digital Seal & Signature Affixed]</span>
              </div>
            </div>
          </div>

          {/* Resumption & Next Term Fees */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-slate-800">
            <div>
              <span className="font-bold text-emerald-950 block">Next Academic Term Resumption:</span>
              <span className="font-medium">{selectedReportCard.nextTermBegins}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-950 block">Next Term School Fees:</span>
              <span className="font-mono font-bold text-emerald-900">₦{selectedReportCard.nextTermFees.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 text-center text-[11px] text-slate-500 border-t border-slate-200 no-print">
          Generated automatically by Calizion SchoolSuite · Complete School Management & Result Computation
        </div>
      </div>
    </div>
  );
};
