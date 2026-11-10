import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';
import { GraduationCap, ExternalLink, ShieldCheck, UserCheck, BookOpen, Users } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, schoolConfig, setActiveTab } = useSchool();

  const roleOptions: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'admin', label: 'Proprietor / Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'teacher', label: 'Teacher Portal', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'student', label: 'Student Portal', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'parent', label: 'Parent Portal', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 no-print">
      {/* Zone 1: Single-element brand wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black tracking-tight shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <span className="text-base font-extrabold tracking-tight text-slate-900 block font-['Plus_Jakarta_Sans',sans-serif]">
            Calizion SchoolSuite
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {schoolConfig.name.split('&')[0]} · {schoolConfig.currentTerm}
          </span>
        </div>
      </div>

      {/* Zone 2: Context Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 whitespace-nowrap shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          School Dashboard
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Fees & Receipts
        </button>
        <button
          onClick={() => setActiveTab('cbt')}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          CBT Examination
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className="flex items-center gap-1 hover:text-emerald-700 transition-colors text-emerald-800 font-bold whitespace-nowrap"
        >
          <span>Public School Website</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </nav>

      {/* Zone 3: Multi-role switcher & quick action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="px-2 text-[11px] text-slate-400 font-medium hidden sm:inline">Role:</span>
          {roleOptions.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.id);
                setActiveTab('overview');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all whitespace-nowrap ${
                role === r.id
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.icon}
              <span className="hidden lg:inline">{r.label}</span>
              <span className="lg:hidden">{r.id.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
