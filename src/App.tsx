/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentsManagement } from './components/admin/StudentsManagement';
import { FeesManagement } from './components/admin/FeesManagement';
import { ExaminationsManagement } from './components/admin/ExaminationsManagement';
import { ReportCardsView } from './components/admin/ReportCardsView';
import { AttendanceModule } from './components/admin/AttendanceModule';
import { CbtManager } from './components/admin/CbtManager';
import { SmsBroadcast } from './components/admin/SmsBroadcast';
import { SubscriptionBilling } from './components/admin/SubscriptionBilling';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { StudentPortal } from './components/student/StudentPortal';
import { ParentPortal } from './components/parent/ParentPortal';
import { PublicSchoolWebsite } from './components/website/PublicSchoolWebsite';
import { ReceiptModal } from './components/receipts/ReceiptModal';
import { PrintableReportCard } from './components/reports/PrintableReportCard';
import { CbtExamRoom } from './components/cbt/CbtExamRoom';

const MainAppContent: React.FC = () => {
  const { role, activeTab } = useSchool();

  const renderContent = () => {
    // If viewing public website
    if (activeTab === 'website') {
      return <PublicSchoolWebsite />;
    }

    // Role-specific routing
    if (role === 'teacher') {
      if (activeTab === 'attendance') return <AttendanceModule />;
      if (activeTab === 'exams') return <ExaminationsManagement />;
      if (activeTab === 'cbt') return <CbtManager />;
      return <TeacherPortal />;
    }

    if (role === 'student') {
      if (activeTab === 'reportcards') return <ReportCardsView />;
      return <StudentPortal />;
    }

    if (role === 'parent') {
      if (activeTab === 'reportcards') return <ReportCardsView />;
      if (activeTab === 'attendance') return <AttendanceModule />;
      if (activeTab === 'broadcast') return <SmsBroadcast />;
      return <ParentPortal />;
    }

    // Admin default routing
    switch (activeTab) {
      case 'students':
        return <StudentsManagement />;
      case 'fees':
        return <FeesManagement />;
      case 'exams':
        return <ExaminationsManagement />;
      case 'reportcards':
        return <ReportCardsView />;
      case 'attendance':
        return <AttendanceModule />;
      case 'cbt':
        return <CbtManager />;
      case 'broadcast':
        return <SmsBroadcast />;
      case 'subscription':
        return <SubscriptionBilling />;
      case 'overview':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar with Brand & Role Selector */}
      <Header />

      {/* Workspace Area */}
      <div className="flex-1 flex w-full">
        {/* Sidebar Navigation (hidden when on standalone website tab) */}
        {activeTab !== 'website' && <Sidebar />}

        {/* Content Viewport */}
        <main
          className={`flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all ${
            activeTab === 'website' ? 'max-w-6xl' : ''
          }`}
        >
          {renderContent()}
        </main>
      </div>

      {/* Global Modals for Receipts, Report Cards & CBT Examination */}
      <ReceiptModal />
      <PrintableReportCard />
      <CbtExamRoom />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
