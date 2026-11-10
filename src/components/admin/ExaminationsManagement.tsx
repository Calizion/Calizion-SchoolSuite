import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FileText, Award, Edit3, Check, Calculator, Download } from 'lucide-react';

export const ExaminationsManagement: React.FC = () => {
  const { classes, students, reportCards, updateReportScore, setSelectedReportCard } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-ss2');
  const [editingScoreKey, setEditingScoreKey] = useState<string | null>(null);

  // Score edit state
  const [tempScores, setTempScores] = useState({
    ca1: 10,
    ca2: 10,
    midTerm: 8,
    exam: 50,
  });

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === activeClass?.id);

  // Available subjects for selected class
  const sampleCard = Object.values(reportCards)[0];
  const subjectList = sampleCard ? sampleCard.scores.map((s) => ({ id: s.subjectId, name: s.subjectName })) : [];

  const handleStartEdit = (studentId: string, subjectId: string, curr: { ca1: number; ca2: number; midTerm: number; exam: number }) => {
    setEditingScoreKey(`${studentId}_${subjectId}`);
    setTempScores(curr);
  };

  const handleSaveScore = (studentId: string, subjectId: string) => {
    updateReportScore(studentId, subjectId, tempScores);
    setEditingScoreKey(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Continuous Assessment & Terminal Result Computation
          </h2>
          <p className="text-xs text-slate-500">
            Automated grading, standard WAEC/NECO score weights (CA1: 15, CA2: 15, Mid-term: 10, Exam: 60), class ranking, and master broadsheet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900 shadow-xs focus:ring-1 focus:ring-emerald-600"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class: {cls.name} ({cls.section})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grading Scheme Reference Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong className="block text-emerald-900 font-bold">Standard Grading Scale Applied:</strong>
            <span className="text-emerald-800 text-[11px]">
              A1: 75-100% · B2: 70-74% · B3: 65-69% · C4: 60-64% · C5: 55-59% · C6: 50-54% · D7: 45-49% · E8: 40-44% · F9: 0-39%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded border border-emerald-300 text-emerald-900">
            CA Weight: 40% · Exam Weight: 60%
          </span>
        </div>
      </div>

      {/* Broadsheet Matrix Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Master Class Broadsheet — {activeClass?.name}
            </h3>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Broadsheet</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[11px] font-semibold">
                <th className="py-2.5 px-3 border-r border-slate-200">Adm No / Student</th>
                {subjectList.map((sub) => (
                  <th key={sub.id} className="py-2.5 px-2 border-r border-slate-200 text-center whitespace-nowrap min-w-[90px]">
                    {sub.name}
                  </th>
                ))}
                <th className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">Total Score</th>
                <th className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">Average</th>
                <th className="py-2.5 px-3 text-center font-bold text-emerald-900">Position</th>
                <th className="py-2.5 px-3 text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, sIdx) => {
                const report = reportCards[st.id] || sampleCard;
                return (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-900 whitespace-nowrap">
                      <div>
                        {st.lastName}, {st.firstName}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{st.admissionNo}</span>
                    </td>

                    {subjectList.map((sub) => {
                      const scoreItem = report?.scores.find((s) => s.subjectId === sub.id) || report?.scores[0];
                      const isEditing = editingScoreKey === `${st.id}_${sub.id}`;

                      if (!scoreItem) {
                        return (
                          <td key={sub.id} className="py-2.5 px-2 text-center text-slate-400 border-r border-slate-100">
                            -
                          </td>
                        );
                      }

                      return (
                        <td key={sub.id} className="py-2 px-2 text-center border-r border-slate-100 font-mono text-[11px]">
                          {isEditing ? (
                            <div className="flex flex-col gap-1 p-1 bg-amber-50 rounded border border-amber-300">
                              <div className="grid grid-cols-2 gap-1 text-[10px]">
                                <input
                                  type="number"
                                  title="CA1 (max 15)"
                                  value={tempScores.ca1}
                                  onChange={(e) => setTempScores({ ...tempScores, ca1: Number(e.target.value) })}
                                  className="w-full p-0.5 border text-center rounded bg-white"
                                />
                                <input
                                  type="number"
                                  title="CA2 (max 15)"
                                  value={tempScores.ca2}
                                  onChange={(e) => setTempScores({ ...tempScores, ca2: Number(e.target.value) })}
                                  className="w-full p-0.5 border text-center rounded bg-white"
                                />
                                <input
                                  type="number"
                                  title="Mid (max 10)"
                                  value={tempScores.midTerm}
                                  onChange={(e) => setTempScores({ ...tempScores, midTerm: Number(e.target.value) })}
                                  className="w-full p-0.5 border text-center rounded bg-white"
                                />
                                <input
                                  type="number"
                                  title="Exam (max 60)"
                                  value={tempScores.exam}
                                  onChange={(e) => setTempScores({ ...tempScores, exam: Number(e.target.value) })}
                                  className="w-full p-0.5 border text-center rounded bg-white"
                                />
                              </div>
                              <button
                                onClick={() => handleSaveScore(st.id, sub.id)}
                                className="px-1.5 py-0.5 bg-emerald-700 text-white rounded text-[9px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                handleStartEdit(st.id, sub.id, {
                                  ca1: scoreItem.ca1,
                                  ca2: scoreItem.ca2,
                                  midTerm: scoreItem.midTerm,
                                  exam: scoreItem.exam,
                                })
                              }
                              className="cursor-pointer group flex items-center justify-center gap-1 hover:bg-slate-100 py-1 px-1.5 rounded transition-colors"
                              title="Click to edit CA & Exam scores"
                            >
                              <span className="font-bold text-slate-900">{scoreItem.total}</span>
                              <span
                                className={`text-[10px] ${
                                  scoreItem.grade.startsWith('A')
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-slate-600'
                                }`}
                              >
                                ({scoreItem.grade})
                              </span>
                              <Edit3 className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover:opacity-100" />
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono font-bold text-slate-900">
                      {report?.totalScore || 620}
                    </td>

                    <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono font-bold text-emerald-800">
                      {report?.averageScore || 77.5}%
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-700">
                      {sIdx + 1}
                      {sIdx === 0 ? 'st' : sIdx === 1 ? 'nd' : sIdx === 2 ? 'rd' : 'th'}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedReportCard(report)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Award className="w-3 h-3" />
                        <span>Report Card</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
