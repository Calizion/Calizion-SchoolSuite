import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Award, Printer, Search, Filter, CheckCircle2, User } from 'lucide-react';

export const ReportCardsView: React.FC = () => {
  const { students, classes, reportCards, setSelectedReportCard, schoolConfig } = useSchool();
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleCard = Object.values(reportCards)[0];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const getClassName = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : 'Class';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Termly Academic Report Cards Hub</h2>
          <p className="text-xs text-slate-500">
            Generate, certify, and batch-print official continuous assessment and terminal examination report cards.
          </p>
        </div>

        <button
          onClick={() => {
            if (sampleCard) setSelectedReportCard(sampleCard);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
        >
          <Award className="w-4 h-4" />
          <span>Preview Exemplar Report Card</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student report card..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.section})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((st) => {
          const report = reportCards[st.id] || sampleCard;
          const isCertified = Boolean(report);

          return (
            <div
              key={st.id}
              className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs hover:border-emerald-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {getClassName(st.classId)} ({st.arm})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Certified
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={st.passportUrl}
                    alt={st.firstName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {st.lastName}, {st.firstName}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">{st.admissionNo}</span>
                  </div>
                </div>

                {report && (
                  <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50 rounded-lg border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Total</span>
                      <strong className="font-mono text-slate-800">{report.totalScore}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Average</span>
                      <strong className="font-mono text-emerald-800">{report.averageScore}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Position</span>
                      <strong className="font-mono text-amber-700">
                        {report.classPosition}
                        {report.classPosition === 1 ? 'st' : report.classPosition === 2 ? 'nd' : 'rd'}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{schoolConfig.currentTerm}</span>
                <button
                  onClick={() => setSelectedReportCard(report)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report Card</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
