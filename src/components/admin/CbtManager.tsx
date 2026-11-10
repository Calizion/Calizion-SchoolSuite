import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CbtExam, CbtQuestion } from '../../types';
import { Laptop, Plus, Play, CheckCircle2, Clock, Award, X, AlertCircle } from 'lucide-react';

export const CbtManager: React.FC = () => {
  const { cbtExams, addCbtExam, setActiveExamToTake, cbtSubmissions, classes } = useSchool();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating a new CBT test
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [targetClass, setTargetClass] = useState('SS 2');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [passPercentage, setPassPercentage] = useState(50);
  const [instructions, setInstructions] = useState('Answer all questions. Each question carries equal points.');

  const [questions, setQuestions] = useState<CbtQuestion[]>([
    {
      id: 'q1',
      questionText: 'What is the value of 5! (5 factorial)?',
      options: [
        { label: 'A', text: '60' },
        { label: 'B', text: '120' },
        { label: 'C', text: '24' },
        { label: 'D', text: '100' },
      ],
      correctAnswer: 'B',
      explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.',
      points: 5,
    },
    {
      id: 'q2',
      questionText: 'Which organelle is referred to as the powerhouse of the biological cell?',
      options: [
        { label: 'A', text: 'Ribosome' },
        { label: 'B', text: 'Endoplasmic reticulum' },
        { label: 'C', text: 'Mitochondrion' },
        { label: 'D', text: 'Golgi body' },
      ],
      correctAnswer: 'C',
      explanation: 'Mitochondria generate most of the chemical energy needed to power biochemical reactions (ATP).',
      points: 5,
    },
  ]);

  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const newQ: CbtQuestion = {
      id: `q${Date.now()}`,
      questionText: `Sample question ${nextNum} text goes here...`,
      options: [
        { label: 'A', text: 'Option A statement' },
        { label: 'B', text: 'Option B statement' },
        { label: 'C', text: 'Option C statement' },
        { label: 'D', text: 'Option D statement' },
      ],
      correctAnswer: 'A',
      explanation: 'Brief pedagogical explanation of the answer.',
      points: 5,
    };
    setQuestions([...questions, newQ]);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please provide an examination title.');
      return;
    }

    const totalMarks = questions.reduce((sum, q) => sum + q.points, 0);

    addCbtExam({
      title,
      subject,
      targetClass,
      durationMinutes,
      totalMarks,
      passPercentage,
      scheduledDate: new Date().toISOString().split('T')[0],
      instructions,
      isPublished: true,
      questions,
    });

    setIsCreateModalOpen(false);
    alert(`CBT Exam "${title}" published successfully! Students can now sit for the test in their portal.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Computer-Based Testing (CBT) Center</h2>
          <p className="text-xs text-slate-500">
            Timed mock examination system, question bank authoring, automated instant scoring, and anti-cheat controls.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New CBT Test</span>
        </button>
      </div>

      {/* Active CBT Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cbtExams.map((exam) => (
          <div key={exam.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold uppercase">
                  {exam.subject} · {exam.targetClass}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{exam.instructions}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                <span className="font-mono font-bold text-slate-900">{exam.durationMinutes} mins</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Questions</span>
                <span className="font-mono font-bold text-slate-900">{exam.questions.length} Items</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Marks</span>
                <span className="font-mono font-bold text-emerald-800">{exam.totalMarks} pts</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Scheduled: {exam.scheduledDate}</span>
              <button
                onClick={() => setActiveExamToTake(exam)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Launch Test Simulation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions & Results Log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Recent CBT Examination Submissions & Scores
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">{cbtSubmissions.length} Submissions Logged</span>
        </div>

        {cbtSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Laptop className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No CBT submissions recorded yet for this session.</p>
            <p className="text-[11px] text-slate-400">
              Click &quot;Launch Test Simulation&quot; on any test card above to experience the candidate test room.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-3">Exam Title</th>
                  <th className="py-3 px-3">Score Obtained</th>
                  <th className="py-3 px-3">Percentage</th>
                  <th className="py-3 px-3">Result</th>
                  <th className="py-3 px-4 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cbtSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="py-3 px-3 text-slate-700">
                      {cbtExams.find((e) => e.id === sub.examId)?.title || 'CBT Assessment'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {sub.score} / {sub.totalMarks}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">{sub.percentage}%</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                      {new Date(sub.submittedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create CBT Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Author New CBT Examination Paper</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Test Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 2nd Term Unified Physics Mock"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Target Class</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Pass Mark (%)</label>
                  <input
                    type="number"
                    min="30"
                    max="90"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Instructions for Candidates</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Questions List */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Questions Bank ({questions.length} Questions)</h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>Question {idx + 1}</span>
                        <span className="font-mono text-emerald-800">{q.points} Points</span>
                      </div>
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].questionText = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {q.options.map((opt, oIdx) => (
                          <div key={opt.label} className="flex items-center gap-1">
                            <span className="font-bold w-4 text-slate-600">{opt.label}:</span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[idx].options[oIdx].text = e.target.value;
                                setQuestions(updated);
                              }}
                              className="w-full p-1 border border-slate-200 rounded bg-white"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <span className="text-slate-500 font-medium">Correct Option:</span>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[idx].correctAnswer = e.target.value as any;
                            setQuestions(updated);
                          }}
                          className="p-1 border border-slate-200 rounded bg-white font-bold text-emerald-800"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Publish CBT Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
