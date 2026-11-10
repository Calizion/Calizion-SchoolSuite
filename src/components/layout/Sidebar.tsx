import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  FileText,
  ClipboardList,
  Laptop,
  MessageSquare,
  Globe,
  Crown,
  BookOpen,
  CalendarCheck,
  Award,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, schoolConfig, students } = useSchool();

  const adminNav: NavItem[] = [
    { id: 'overview', label: 'School Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Admissions & Students', icon: <GraduationCap className="w-4 h-4" />, badge: students.length },
    { id: 'fees', label: 'Fees & Auto-Receipts', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'exams', label: 'Scores & Broadsheet', icon: <FileText className="w-4 h-4" /> },
    { id: 'reportcards', label: 'Report Cards Hub', icon: <Award className="w-4 h-4" /> },
    { id: 'attendance', label: 'Daily Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'cbt', label: 'CBT Exam Platform', icon: <Laptop className="w-4 h-4" /> },
    { id: 'broadcast', label: 'SMS & WhatsApp Alerts', icon: <MessageSquare className="w-4 h-4" />, badge: `${schoolConfig.smsCreditsBalance} units` },
    { id: 'website', label: 'School Website Builder', icon: <Globe className="w-4 h-4" /> },
    { id: 'subscription', label: 'Calizion SaaS & Billing', icon: <Crown className="w-4 h-4" />, highlight: true },
  ];

  const teacherNav: NavItem[] = [
    { id: 'overview', label: 'Teacher Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'attendance', label: 'Class Roll Call', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'lessonplans', label: 'Scheme & Lesson Plans', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'exams', label: 'Continuous Assessment Scores', icon: <FileText className="w-4 h-4" /> },
    { id: 'assignments', label: 'Homework & Assignments', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'cbt', label: 'CBT Assessments', icon: <Laptop className="w-4 h-4" /> },
  ];

  const studentNav: NavItem[] = [
    { id: 'overview', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cbt', label: 'CBT Exam Test Room', icon: <Laptop className="w-4 h-4" /> },
    { id: 'reportcards', label: 'My Termly Report Card', icon: <Award className="w-4 h-4" /> },
    { id: 'assignments', label: 'Class Assignments', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'fees', label: 'Fees Clearance & Receipts', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const parentNav: NavItem[] = [
    { id: 'overview', label: 'Parent Ward Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'fees', label: 'Pay School Fees & Receipts', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'reportcards', label: 'Ward Report Cards', icon: <Award className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance Records', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'broadcast', label: 'School Notices & SMS', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const currentNav =
    role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : role === 'student' ? studentNav : parentNav;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between min-h-[calc(100vh-65px)] no-print">
      <div className="p-4 space-y-6">
        {/* Tier badge indicator for school */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Calizion Plan:</span>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
              {schoolConfig.currentTier} Tier
            </span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            SMS Balance: <strong className="text-slate-800 font-mono">{schoolConfig.smsCreditsBalance}</strong>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1">
            {role.toUpperCase()} NAVIGATION
          </div>
          {currentNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : item.highlight
                    ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Principal & Support info */}
      <div className="p-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2.5">
          <img
            src="/src/assets/images/school_principal_avatar_1794342284206.jpg"
            alt="School Principal"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="leading-tight truncate">
            <span className="font-bold text-slate-800 block truncate">{schoolConfig.principalName.split(',')[0]}</span>
            <span className="text-[10px] text-slate-400">Head of Institution</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 pt-1">
          Support: <a href="mailto:support@calizion.com" className="text-emerald-700 hover:underline">support@calizion.com</a>
        </div>
      </div>
    </aside>
  );
};
