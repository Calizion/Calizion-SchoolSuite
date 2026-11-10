import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LessonPlan } from '../../types';
import { BookOpen, CheckCircle, Clock, Plus, ClipboardList, CalendarCheck, Send, UserCheck, AlertCircle } from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const { lessonPlans, addLessonPlan, assignments, addAssignment, classes, setActiveTab, schoolConfig } = useSchool();
  const [activeTeacherTab, setActiveTeacherTab] = useState<'plans' | 'assignments'>('plans');
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isNewAssignmentModalOpen, setIsNewAssignmentModalOpen] = useState(false);

  // New Lesson Plan state
  const [planSubject, setPlanSubject] = useState('Physics');
  const [planClass, setPlanClass] = useState('SS 2 Science');
  const [weekNumber, setWeekNumber] = useState(8);
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [behavioralObjectives, setBehavioralObjectives] = useState('');
  const [instructionalMaterials, setInstructionalMaterials] = useState('');
  const [teachingActivities, setTeachingActivities] = useState('');
  const [evaluationQuestions, setEvaluationQuestions] = useState('');

  // New Assignment state
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState('Physics');
  const [asgClass, setAsgClass] = useState('SS 2 Science');
  const [asgDueDate, setAsgDueDate] = useState('2026-02-20');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgPoints, setAsgPoints] = useState(20);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !subTopic) {
      alert('Please fill in Topic and Sub-topic.');
      return;
    }

    addLessonPlan({
      teacherId: 'tch-01',
      teacherName: 'Dr. Kalu Nnamdi',
      subject: planSubject,
      classLevel: planClass,
      weekNumber,
      topic,
      subTopic,
      behavioralObjectives: behavioralObjectives.split('\n').filter(Boolean),
      instructionalMaterials: instructionalMaterials.split('\n').filter(Boolean),
      teachingActivities,
      evaluationQuestions: evaluationQuestions.split('\n').filter(Boolean),
    });

    setIsNewPlanModalOpen(false);
    alert('Lesson Plan submitted to Vice Principal (Academics) for review!');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle || !asgDesc) {
      alert('Please fill in Title and Assignment instructions.');
      return;
    }

    addAssignment({
      title: asgTitle,
      subject: asgSubject,
      targetClass: asgClass,
      assignedBy: 'Dr. Kalu Nnamdi',
      dueDate: asgDueDate,
      description: asgDesc,
      totalPoints: asgPoints,
      status: 'Active',
    });

    setIsNewAssignmentModalOpen(false);
    alert('Homework assignment published to Student Portal!');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Ribbon */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-lg">
            KN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Dr. Kalu Nnamdi</h2>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Senior Science Master & Form Tutor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned Subjects: Physics, Further Mathematics · Form Class: SS 2 Science
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Morning Roll Call</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors"
          >
            <span>Enter CA Scores</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTeacherTab('plans')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            activeTeacherTab === 'plans'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curriculum Scheme & Weekly Lesson Plans</span>
          <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-white">
            {lessonPlans.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTeacherTab('assignments')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            activeTeacherTab === 'assignments'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>E-Learning & Assignments</span>
          <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-white">
            {assignments.length}
          </span>
        </button>
      </div>

      {/* Lesson Plans Tab */}
      {activeTeacherTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Scheme of Work & Lesson Notes</h3>
              <p className="text-xs text-slate-500">
                Submit pedagogical objectives and instructional strategies for administrative approval.
              </p>
            </div>
            <button
              onClick={() => setIsNewPlanModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Draft Week&apos;s Lesson Plan</span>
            </button>
          </div>

          <div className="space-y-4">
            {lessonPlans.map((lp) => (
              <div key={lp.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Week {lp.weekNumber} · {lp.subject} ({lp.classLevel})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          lp.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lp.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-2">{lp.topic}</h4>
                    <p className="text-xs font-medium text-slate-600">Sub-Topic: {lp.subTopic}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Submitted: {lp.submissionDate}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <strong className="text-slate-800 block text-[11px] uppercase">Behavioral Objectives:</strong>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {lp.behavioralObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <strong className="text-slate-800 block text-[11px] uppercase">Instructional Materials:</strong>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {lp.instructionalMaterials.map((mat, i) => (
                        <li key={i}>{mat}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {lp.adminNotes && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-900">
                    <strong className="block text-[11px] uppercase font-bold text-emerald-950">
                      Academic Supervisor&apos;s Feedback:
                    </strong>
                    &ldquo;{lp.adminNotes}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTeacherTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Homework & Digital Assignments</h3>
              <p className="text-xs text-slate-500">Assign exercises and review student homework submissions.</p>
            </div>
            <button
              onClick={() => setIsNewAssignmentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assignment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {asg.subject} · {asg.targetClass}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{asg.totalPoints} pts</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3">{asg.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Due: {asg.dueDate}</span>
                  <span className="font-semibold text-emerald-800">
                    {asg.submissionsCount} submitted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Lesson Plan Modal */}
      {isNewPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Create Weekly Pedagogical Lesson Plan</h3>
              <button
                onClick={() => setIsNewPlanModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={planSubject}
                    onChange={(e) => setPlanSubject(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Class</label>
                  <input
                    type="text"
                    value={planClass}
                    onChange={(e) => setPlanClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Topic *</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Electric Fields & Coulomb's Law"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Sub-Topic *</label>
                <input
                  type="text"
                  required
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
                  placeholder="e.g. Electric field lines and electrostatic force calculation"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Behavioral Objectives (1 per line)</label>
                <textarea
                  rows={2}
                  value={behavioralObjectives}
                  onChange={(e) => setBehavioralObjectives(e.target.value)}
                  placeholder="e.g. State Coulomb's inverse square law&#10;Calculate electrostatic force between point charges"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Instructional Materials</label>
                <input
                  type="text"
                  value={instructionalMaterials}
                  onChange={(e) => setInstructionalMaterials(e.target.value)}
                  placeholder="e.g. Van de Graaff generator, charged rods, digital slides"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Teaching & Learning Activities</label>
                <textarea
                  rows={2}
                  value={teachingActivities}
                  onChange={(e) => setTeachingActivities(e.target.value)}
                  placeholder="Step-by-step teacher facilitation activities..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewPlanModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Submit Plan to Administration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {isNewAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Publish Student Assignment</h3>
              <button
                onClick={() => setIsNewAssignmentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Coulomb's Law Problem Set 3"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Class</label>
                  <input
                    type="text"
                    value={asgClass}
                    onChange={(e) => setAsgClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Total Points</label>
                  <input
                    type="number"
                    value={asgPoints}
                    onChange={(e) => setAsgPoints(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Homework Description / Questions *</label>
                <textarea
                  rows={3}
                  required
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="List instructions or specific problems to solve..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
