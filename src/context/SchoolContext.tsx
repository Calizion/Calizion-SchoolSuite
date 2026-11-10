import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  ClassGrade,
  PaymentRecord,
  AttendanceRecord,
  ReportCard,
  CbtExam,
  CbtSubmission,
  LessonPlan,
  Assignment,
  SmsBroadcast,
  SchoolConfig,
  SchoolTier,
} from '../types';
import {
  initialSchoolConfig,
  initialClasses,
  initialStudents,
  initialPaymentRecords,
  initialAttendanceRecords,
  sampleReportCardSS2,
  sampleReportCardJSS1,
  initialCbtExams,
  initialLessonPlans,
  initialAssignments,
  initialSmsBroadcasts,
} from '../data/mockData';

interface SchoolContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  schoolConfig: SchoolConfig;
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  updateTier: (tier: SchoolTier) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'admissionNo' | 'totalFeesPaid' | 'rollNo'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  classes: ClassGrade[];
  payments: PaymentRecord[];
  recordPayment: (payment: {
    studentId: string;
    amountPaid: number;
    paymentMethod: PaymentRecord['paymentMethod'];
    breakdownNotes?: string;
  }) => PaymentRecord;
  attendance: AttendanceRecord[];
  markAttendance: (
    classId: string,
    arm: string,
    date: string,
    records: { studentId: string; studentName: string; status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks?: string }[]
  ) => void;
  reportCards: Record<string, ReportCard>;
  updateReportScore: (studentId: string, subjectId: string, scores: { ca1: number; ca2: number; midTerm: number; exam: number }) => void;
  cbtExams: CbtExam[];
  addCbtExam: (exam: Omit<CbtExam, 'id'>) => void;
  cbtSubmissions: CbtSubmission[];
  submitExam: (submission: Omit<CbtSubmission, 'id' | 'submittedAt'>) => void;
  lessonPlans: LessonPlan[];
  addLessonPlan: (plan: Omit<LessonPlan, 'id' | 'submissionDate' | 'status'>) => void;
  updateLessonPlanStatus: (id: string, status: LessonPlan['status'], adminNotes?: string) => void;
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'submissionsCount'>) => void;
  smsBroadcasts: SmsBroadcast[];
  sendBroadcast: (broadcast: { recipientGroup: SmsBroadcast['recipientGroup']; channel: SmsBroadcast['channel']; messageText: string }) => boolean;
  topUpSms: (units: number, costNaira: number) => void;
  // Active selection helpers
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedReceipt: PaymentRecord | null;
  setSelectedReceipt: (receipt: PaymentRecord | null) => void;
  selectedReportCard: ReportCard | null;
  setSelectedReportCard: (card: ReportCard | null) => void;
  activeExamToTake: CbtExam | null;
  setActiveExamToTake: (exam: CbtExam | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem('calizion_config');
    return saved ? JSON.parse(saved) : initialSchoolConfig;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('calizion_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [classes, setClasses] = useState<ClassGrade[]>(() => {
    const saved = localStorage.getItem('calizion_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('calizion_payments');
    return saved ? JSON.parse(saved) : initialPaymentRecords;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('calizion_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [reportCards, setReportCards] = useState<Record<string, ReportCard>>(() => {
    const saved = localStorage.getItem('calizion_reportcards');
    if (saved) return JSON.parse(saved);
    return {
      'std-001': sampleReportCardSS2,
      'std-003': sampleReportCardJSS1,
    };
  });

  const [cbtExams, setCbtExams] = useState<CbtExam[]>(() => {
    const saved = localStorage.getItem('calizion_cbtexams');
    return saved ? JSON.parse(saved) : initialCbtExams;
  });

  const [cbtSubmissions, setCbtSubmissions] = useState<CbtSubmission[]>(() => {
    const saved = localStorage.getItem('calizion_cbtsubmissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => {
    const saved = localStorage.getItem('calizion_lessonplans');
    return saved ? JSON.parse(saved) : initialLessonPlans;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('calizion_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [smsBroadcasts, setSmsBroadcasts] = useState<SmsBroadcast[]>(() => {
    const saved = localStorage.getItem('calizion_sms');
    return saved ? JSON.parse(saved) : initialSmsBroadcasts;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-001');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);
  const [activeExamToTake, setActiveExamToTake] = useState<CbtExam | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('calizion_config', JSON.stringify(schoolConfig));
  }, [schoolConfig]);

  useEffect(() => {
    localStorage.setItem('calizion_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('calizion_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('calizion_reportcards', JSON.stringify(reportCards));
  }, [reportCards]);

  useEffect(() => {
    localStorage.setItem('calizion_cbtexams', JSON.stringify(cbtExams));
  }, [cbtExams]);

  useEffect(() => {
    localStorage.setItem('calizion_lessonplans', JSON.stringify(lessonPlans));
  }, [lessonPlans]);

  const updateSchoolConfig = (updates: Partial<SchoolConfig>) => {
    setSchoolConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateTier = (tier: SchoolTier) => {
    setSchoolConfig((prev) => ({ ...prev, currentTier: tier }));
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'admissionNo' | 'totalFeesPaid' | 'rollNo'>): Student => {
    const id = `std-${Date.now().toString().slice(-4)}`;
    const randomRoll = Math.floor(Math.random() * 20) + 10;
    const year = new Date().getFullYear();
    const admissionNo = `CAL/${year}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent: Student = {
      ...studentData,
      id,
      admissionNo,
      rollNo: randomRoll,
      totalFeesPaid: 0,
      totalFeesOwed: studentData.totalFeesOwed || 185000,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Also update class count
    setClasses((prev) =>
      prev.map((cls) => (cls.id === studentData.classId ? { ...cls, studentCount: cls.studentCount + 1 } : cls))
    );

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const recordPayment = ({
    studentId,
    amountPaid,
    paymentMethod,
    breakdownNotes,
  }: {
    studentId: string;
    amountPaid: number;
    paymentMethod: PaymentRecord['paymentMethod'];
    breakdownNotes?: string;
  }): PaymentRecord => {
    const student = students.find((s) => s.id === studentId);
    const targetClass = classes.find((c) => c.id === student?.classId);
    const termFee = student?.totalFeesOwed || targetClass?.termFeeAmount || 200000;
    const prevPaid = student?.totalFeesPaid || 0;
    const newTotalPaid = prevPaid + amountPaid;
    const remaining = Math.max(0, termFee - newTotalPaid);

    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNo,
      studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : 'Student',
      admissionNo: student ? student.admissionNo : 'CAL/2026/000',
      classArm: student ? `${targetClass?.name || 'Class'} ${student.arm}` : 'Class',
      amountPaid,
      totalTermFee: termFee,
      remainingBalance: remaining,
      paymentMethod,
      referenceNo: `REF_${Date.now().toString().slice(-8)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      term: schoolConfig.currentTerm,
      session: '2025/2026',
      receivedBy: 'Calizion Digital Bursary',
      status: 'Verified',
      feeBreakdown: [
        { item: breakdownNotes || 'Term School Fees & Levies', amount: amountPaid },
      ],
    };

    setPayments((prev) => [newRecord, ...prev]);
    // update student payment balance
    updateStudent(studentId, {
      totalFeesPaid: newTotalPaid,
    });

    return newRecord;
  };

  const markAttendance = (
    classId: string,
    arm: string,
    date: string,
    records: { studentId: string; studentName: string; status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks?: string }[]
  ) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      classId,
      arm,
      date,
      records,
    };
    setAttendance((prev) => [newRecord, ...prev.filter((a) => !(a.classId === classId && a.arm === arm && a.date === date))]);
  };

  const updateReportScore = (
    studentId: string,
    subjectId: string,
    scores: { ca1: number; ca2: number; midTerm: number; exam: number }
  ) => {
    setReportCards((prev) => {
      const existing = prev[studentId];
      if (!existing) return prev;

      const total = scores.ca1 + scores.ca2 + scores.midTerm + scores.exam;
      let grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9' = 'F9';
      let remark = 'Fail';

      if (total >= 75) {
        grade = 'A1';
        remark = 'Distinction';
      } else if (total >= 70) {
        grade = 'B2';
        remark = 'Very Good';
      } else if (total >= 65) {
        grade = 'B3';
        remark = 'Good';
      } else if (total >= 60) {
        grade = 'C4';
        remark = 'Credit';
      } else if (total >= 50) {
        grade = 'C5';
        remark = 'Credit';
      } else if (total >= 45) {
        grade = 'D7';
        remark = 'Pass';
      }

      const updatedScores = existing.scores.map((s) =>
        s.subjectId === subjectId
          ? {
              ...s,
              ...scores,
              total,
              grade,
              remark,
            }
          : s
      );

      const totalScore = updatedScores.reduce((acc, curr) => acc + curr.total, 0);
      const averageScore = Math.round((totalScore / updatedScores.length) * 10) / 10;

      return {
        ...prev,
        [studentId]: {
          ...existing,
          scores: updatedScores,
          totalScore,
          averageScore,
        },
      };
    });
  };

  const addCbtExam = (exam: Omit<CbtExam, 'id'>) => {
    const newExam: CbtExam = {
      ...exam,
      id: `cbt-${Date.now().toString().slice(-4)}`,
    };
    setCbtExams((prev) => [newExam, ...prev]);
  };

  const submitExam = (submission: Omit<CbtSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: CbtSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setCbtSubmissions((prev) => [newSubmission, ...prev]);
  };

  const addLessonPlan = (plan: Omit<LessonPlan, 'id' | 'submissionDate' | 'status'>) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: `lp-${Date.now().toString().slice(-4)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
    };
    setLessonPlans((prev) => [newPlan, ...prev]);
  };

  const updateLessonPlanStatus = (id: string, status: LessonPlan['status'], adminNotes?: string) => {
    setLessonPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, adminNotes: adminNotes ?? p.adminNotes } : p))
    );
  };

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'submissionsCount'>) => {
    const newAsg: Assignment = {
      ...assignment,
      id: `asg-${Date.now().toString().slice(-4)}`,
      submissionsCount: 0,
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const sendBroadcast = (broadcast: {
    recipientGroup: SmsBroadcast['recipientGroup'];
    channel: SmsBroadcast['channel'];
    messageText: string;
  }): boolean => {
    const countMap: Record<SmsBroadcast['recipientGroup'], number> = {
      'All Parents': students.length,
      'Debtors Only': students.filter((s) => s.totalFeesOwed - s.totalFeesPaid > 0).length,
      'Staff Only': 24,
      'Specific Class': 30,
    };
    const recipientCount = countMap[broadcast.recipientGroup] || 25;
    const unitsPerMessage = broadcast.channel === 'Both SMS & WhatsApp' ? 2 : 1;
    const totalUnits = recipientCount * unitsPerMessage;

    if (schoolConfig.smsCreditsBalance < totalUnits) {
      return false; // insufficient units
    }

    const newBroadcast: SmsBroadcast = {
      id: `sms-${Date.now()}`,
      recipientGroup: broadcast.recipientGroup,
      channel: broadcast.channel,
      recipientCount,
      messageText: broadcast.messageText,
      costUnits: totalUnits,
      sentAt: new Date().toLocaleString(),
      deliveryStatus: 'Delivered',
    };

    setSmsBroadcasts((prev) => [newBroadcast, ...prev]);
    setSchoolConfig((prev) => ({
      ...prev,
      smsCreditsBalance: prev.smsCreditsBalance - totalUnits,
    }));
    return true;
  };

  const topUpSms = (units: number) => {
    setSchoolConfig((prev) => ({
      ...prev,
      smsCreditsBalance: prev.smsCreditsBalance + units,
    }));
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        schoolConfig,
        updateSchoolConfig,
        updateTier,
        students,
        addStudent,
        updateStudent,
        classes,
        payments,
        recordPayment,
        attendance,
        markAttendance,
        reportCards,
        updateReportScore,
        cbtExams,
        addCbtExam,
        cbtSubmissions,
        submitExam,
        lessonPlans,
        addLessonPlan,
        updateLessonPlanStatus,
        assignments,
        addAssignment,
        smsBroadcasts,
        sendBroadcast,
        topUpSms,
        selectedStudentId,
        setSelectedStudentId,
        selectedReceipt,
        setSelectedReceipt,
        selectedReportCard,
        setSelectedReportCard,
        activeExamToTake,
        setActiveExamToTake,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
