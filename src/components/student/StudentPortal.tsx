import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Award, Laptop, ClipboardList, CreditCard, CalendarCheck, CheckCircle2, Play, Receipt } from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    reportCards,
    setSelectedReportCard,
    cbtExams,
    setActiveExamToTake,
    assignments,
    payments,
    setSelectedReceipt,
    classes,
  } = useSchool();

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const currentClass = classes.find((c) => c.id === currentStudent?.classId);
  const myReportCard = reportCards[currentStudent?.id || 'std-001'] || reportCards['std-001'];
  const myPayments = payments.filter((p) => p.studentId === currentStudent?.id);
  const isFeeCleared = (currentStudent?.totalFeesOwed || 0) <= (currentStudent?.totalFeesPaid || 0);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent?.passportUrl}
            alt={currentStudent?.firstName}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {currentStudent?.firstName} {currentStudent?.lastName}
              </h2>
              <span className="text-[11px] font-mono bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-semibold">
                {currentStudent?.admissionNo}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Class: {currentClass?.name || 'Class'} ({currentStudent?.arm}) · Roll No: #{currentStudent?.rollNo} · Blood Group: {currentStudent?.bloodGroup}
            </p>
          </div>
        </div>

        {/* Quick Student Switcher for Demo testing */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Switch Pupil:</span>
          <select
            value={currentStudent?.id}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="p-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg text-xs font-semibold focus:outline-hidden"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.firstName} {st.lastName} ({st.admissionNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Academic Rank */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Academic Standing</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {myReportCard?.classPosition || 2}
            {myReportCard?.classPosition === 1 ? 'st' : myReportCard?.classPosition === 2 ? 'nd' : 'rd'} Position
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Average: {myReportCard?.averageScore || 87.6}% (Distinction)
          </div>
        </div>

        {/* Fees Status */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Bursary Clearance</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {isFeeCleared ? (
              <span className="text-emerald-700">Cleared</span>
            ) : (
              <span className="text-amber-700">Balance Pending</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Paid: ₦{(currentStudent?.totalFeesPaid || 0).toLocaleString()} / ₦{(currentStudent?.totalFeesOwed || 0).toLocaleString()}
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Term Attendance</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {myReportCard ? Math.round((myReportCard.timesPresent / myReportCard.timesSchoolOpened) * 100) : 98}%
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            {myReportCard?.timesPresent || 64} of {myReportCard?.timesSchoolOpened || 65} school days attended
          </div>
        </div>
      </div>

      {/* Active CBT Test Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Available CBT Computer-Based Examinations</h3>
              <p className="text-xs text-slate-500">
                Authorized electronic tests for your class. Timed with automatic result scoring.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cbtExams.map((exam) => (
            <div key={exam.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {exam.subject}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">{exam.title}</h4>
                  <p className="text-xs text-slate-500">{exam.instructions}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="font-mono text-slate-600">
                  {exam.durationMinutes} mins · {exam.questions.length} questions
                </span>
                <button
                  onClick={() => setActiveExamToTake(exam)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  <Play className="w-3 h-3 text-emerald-400 fill-current" />
                  <span>Start CBT Test Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Card & Bursary Receipts Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Card Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Termly Academic Report Card</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your official termly continuous assessment scores, cognitive subject grades, affective behavioral domain, and
              principal&apos;s remarks are certified.
            </p>
            {myReportCard && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Term:</span>
                  <strong className="text-slate-900">{myReportCard.term} ({myReportCard.session})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Overall Score:</span>
                  <strong className="font-mono text-emerald-800">{myReportCard.totalScore} pts ({myReportCard.averageScore}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class Position:</span>
                  <strong className="font-mono text-amber-700">
                    {myReportCard.classPosition} out of {myReportCard.totalStudentsInClass}
                  </strong>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (myReportCard) setSelectedReportCard(myReportCard);
            }}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>View & Download Official Report Card</span>
          </button>
        </div>

        {/* Bursary Receipts Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Digital Fee Receipts</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every fee payment recorded by the bursary carries an automated digital receipt and security QR verification stamp.
            </p>

            <div className="space-y-2">
              {myPayments.length > 0 ? (
                myPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-emerald-900">{p.receiptNo}</div>
                      <div className="text-[11px] text-slate-500">{p.paymentDate} · {p.paymentMethod}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">₦{p.amountPaid.toLocaleString()}</span>
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-white border border-emerald-300 rounded hover:bg-emerald-50"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded">
                  No payment receipts recorded for this session yet.
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Certified by Calizion SchoolSuite Bursary Security
          </div>
        </div>
      </div>

      {/* Homework & Assignments List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900">Active Homework & Assignments</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asg) => (
            <div key={asg.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800">{asg.subject}</span>
                <span className="text-[11px] text-slate-500 font-mono">Due: {asg.dueDate}</span>
              </div>
              <h4 className="font-bold text-slate-900">{asg.title}</h4>
              <p className="text-slate-600 line-clamp-2">{asg.description}</p>
              <div className="pt-2 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Instructor: {asg.assignedBy}</span>
                <span className="font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                  Max: {asg.totalPoints} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
