import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Clock, AlertTriangle, ArrowLeft, ArrowRight, Flag, CheckCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CbtExamRoom: React.FC = () => {
  const { activeExamToTake, setActiveExamToTake, submitExam, selectedStudentId, students } = useSchool();
  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  useEffect(() => {
    if (activeExamToTake) {
      setSecondsRemaining(activeExamToTake.durationMinutes * 60);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setIsSubmitted(false);
      setExamResult(null);
      setCurrentQuestionIndex(0);
    }
  }, [activeExamToTake]);

  useEffect(() => {
    if (!activeExamToTake || isSubmitted || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExamToTake, isSubmitted, secondsRemaining]);

  if (!activeExamToTake) return null;

  const currentQ = activeExamToTake.questions[currentQuestionIndex];
  const totalQuestions = activeExamToTake.questions.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (label: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: label,
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const calculateResults = () => {
    let earnedMarks = 0;
    const answerBreakdown = activeExamToTake.questions.map((q) => {
      const picked = selectedAnswers[q.id];
      const isCorrect = picked === q.correctAnswer;
      if (isCorrect) {
        earnedMarks += q.points;
      }
      return {
        questionId: q.id,
        selectedAnswer: picked || 'None',
        isCorrect,
      };
    });

    const percentage = Math.round((earnedMarks / activeExamToTake.totalMarks) * 100);
    const passed = percentage >= activeExamToTake.passPercentage;

    const result = {
      score: earnedMarks,
      totalMarks: activeExamToTake.totalMarks,
      percentage,
      passed,
    };

    setExamResult(result);
    setIsSubmitted(true);

    submitExam({
      examId: activeExamToTake.id,
      studentId: selectedStudentId,
      studentName: currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : 'Candidate',
      score: earnedMarks,
      totalMarks: activeExamToTake.totalMarks,
      percentage,
      passed,
      answers: answerBreakdown,
    });

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleAutoSubmit = () => {
    calculateResults();
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <div className="text-xs text-emerald-400 font-mono tracking-wide uppercase">Calizion Secure CBT Examination</div>
            <h2 className="text-base font-bold text-white tracking-tight">{activeExamToTake.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                  secondsRemaining < 300 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-white'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={() => setActiveExamToTake(null)}
              className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {isSubmitted ? 'Close Room' : 'Exit Exam'}
            </button>
          </div>
        </div>

        {/* Candidate Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-600">
          <div>
            Candidate: <strong className="text-slate-900">{currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : 'Candidate'}</strong> · {currentStudent?.admissionNo}
          </div>
          <div>
            Answered: <strong className="text-emerald-700">{answeredCount}</strong> / {totalQuestions}
          </div>
        </div>

        {/* Main Examination View or Result View */}
        {!isSubmitted ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question & Options Area */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <button
                    onClick={handleToggleFlag}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors ${
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                  </button>
                </div>

                <div className="text-base font-medium text-slate-900 leading-relaxed min-h-[60px]">
                  {currentQ.questionText}
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt.label;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectOption(opt.label)}
                        className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-slate-900 font-medium ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                        className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={calculateResults}
                        className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Final Examination</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Palette Grid */}
              <div className="border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Question Palette</h4>
                <div className="grid grid-cols-4 gap-2">
                  {activeExamToTake.questions.map((q, idx) => {
                    const isAnswered = Boolean(selectedAnswers[q.id]);
                    const isFlagged = Boolean(flaggedQuestions[q.id]);
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded font-mono text-xs font-bold transition-all ${
                          isCurrent
                            ? 'ring-2 ring-slate-900 ring-offset-1 bg-slate-800 text-white'
                            : isFlagged
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="text-[11px] text-slate-500 space-y-1.5 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                    <span>Flagged for review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                    <span>Unanswered ({totalQuestions - answeredCount})</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={calculateResults}
                    className="w-full py-2.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors text-center"
                  >
                    Finish & Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results Breakdown & Question Review */
          <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="text-center max-w-md mx-auto space-y-2">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-2xl ${
                  examResult?.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {examResult?.passed ? '✓' : '!'}
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {examResult?.passed ? 'Examination Passed Successfully!' : 'Assessment Completed'}
              </h3>
              <p className="text-xs text-slate-600">
                Candidate: {currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : 'Candidate'} (
                {currentStudent?.admissionNo})
              </p>
            </div>

            {/* Scorecard Strip */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase">Marks Earned</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {examResult?.score} / {examResult?.totalMarks}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase">Percentage</span>
                <span
                  className={`text-lg font-bold font-mono ${
                    examResult?.passed ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {examResult?.percentage}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block uppercase">Result Status</span>
                <span
                  className={`text-xs font-bold inline-block px-2.5 py-1 rounded-sm mt-1 ${
                    examResult?.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {examResult?.passed ? 'PASSED' : 'RETAKE REQUIRED'}
                </span>
              </div>
            </div>

            {/* Answer Review Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Detailed Question Corrections & Explanations
              </h4>

              <div className="space-y-4">
                {activeExamToTake.questions.map((q, idx) => {
                  const studentPick = selectedAnswers[q.id];
                  const isCorrect = studentPick === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border text-xs space-y-2 ${
                        isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between font-semibold text-slate-900">
                        <span>
                          Q{idx + 1}. {q.questionText}
                        </span>
                        <span
                          className={`font-mono shrink-0 px-2 py-0.5 rounded text-[11px] ${
                            isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {isCorrect ? `+${q.points} pts` : '0 pts'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                        <div>
                          Your Answer:{' '}
                          <span className={`font-bold ${isCorrect ? 'text-emerald-800' : 'text-rose-700'}`}>
                            {studentPick || 'Unanswered'}
                          </span>
                        </div>
                        <div>
                          Correct Answer: <span className="font-bold text-emerald-800">{q.correctAnswer}</span>
                        </div>
                      </div>

                      {q.explanation && (
                        <div className="text-slate-600 bg-white/70 p-2 rounded border border-slate-200 mt-1">
                          <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setExamResult(null);
                  setSelectedAnswers({});
                  setSecondsRemaining(activeExamToTake.durationMinutes * 60);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test Practice</span>
              </button>
              <button
                onClick={() => setActiveExamToTake(null)}
                className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
