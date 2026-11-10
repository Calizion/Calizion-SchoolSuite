export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type SchoolTier = 'Basic' | 'Standard' | 'Premium';

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female';
  dob: string;
  classId: string;
  arm: string;
  rollNo: number;
  passportUrl: string;
  bloodGroup: string;
  genotype: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress: string;
  guardianRelationship: string;
  admissionDate: string;
  status: 'Active' | 'Suspended' | 'Alumni' | 'Pending';
  totalFeesOwed: number;
  totalFeesPaid: number;
}

export interface ClassGrade {
  id: string;
  name: string; // e.g. "JSS 1", "JSS 2", "SS 1", "Primary 4"
  section: 'Nursery' | 'Primary' | 'Junior Secondary' | 'Senior Secondary';
  arms: string[]; // ["Gold", "Emerald", "Diamond"]
  classTeacherName: string;
  termFeeAmount: number;
  studentCount: number;
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  isCompulsory: boolean;
  category: 'Tuition' | 'Development' | 'ICT & CBT' | 'Lab' | 'Uniform & Books' | 'Sports';
}

export interface PaymentRecord {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classArm: string;
  amountPaid: number;
  totalTermFee: number;
  remainingBalance: number;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'POS' | 'Paystack / Online Card';
  referenceNo: string;
  paymentDate: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  session: string;
  receivedBy: string;
  feeBreakdown: { item: string; amount: number }[];
  status: 'Verified' | 'Pending';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  arm: string;
  records: {
    studentId: string;
    studentName: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    remarks?: string;
  }[];
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  ca1: number; // Max 15
  ca2: number; // Max 15
  midTerm: number; // Max 10
  exam: number; // Max 60
  total: number; // Max 100
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  remark: string;
  classHighest: number;
  classLowest: number;
  classAverage: number;
  positionInSubject: number;
}

export interface ReportCard {
  id: string;
  studentId: string;
  session: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  classArm: string;
  scores: SubjectScore[];
  totalScore: number;
  averageScore: number;
  classPosition: number;
  totalStudentsInClass: number;
  timesSchoolOpened: number;
  timesPresent: number;
  timesAbsent: number;
  affectiveDomain: {
    punctuality: number; // 1-5
    neatness: number;
    politeness: number;
    honesty: number;
    leadership: number;
    attentiveness: number;
  };
  psychomotorDomain: {
    handwriting: number;
    sports: number;
    crafts: number;
    musicalSkill: number;
  };
  classTeacherComment: string;
  principalComment: string;
  nextTermBegins: string;
  nextTermFees: number;
}

export interface CbtQuestion {
  id: string;
  questionText: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  points: number;
}

export interface CbtExam {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  scheduledDate: string;
  instructions: string;
  isPublished: boolean;
  questions: CbtQuestion[];
}

export interface CbtSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[];
}

export interface LessonPlan {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  classLevel: string;
  weekNumber: number;
  topic: string;
  subTopic: string;
  behavioralObjectives: string[];
  instructionalMaterials: string[];
  teachingActivities: string;
  evaluationQuestions: string[];
  submissionDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Revision Requested';
  adminNotes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  assignedBy: string;
  dueDate: string;
  description: string;
  totalPoints: number;
  submissionsCount: number;
  status: 'Active' | 'Graded' | 'Closed';
}

export interface StudentAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  submittedDate: string;
  score?: number;
  feedback?: string;
  status: 'Submitted' | 'Graded';
}

export interface SmsBroadcast {
  id: string;
  recipientGroup: 'All Parents' | 'Debtors Only' | 'Staff Only' | 'Specific Class';
  channel: 'SMS' | 'WhatsApp' | 'Both SMS & WhatsApp';
  recipientCount: number;
  messageText: string;
  costUnits: number;
  sentAt: string;
  deliveryStatus: 'Delivered' | 'In Progress' | 'Failed';
}

export interface SchoolConfig {
  name: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  establishedYear: number;
  currentSession: string;
  currentTerm: '1st Term' | '2nd Term' | '3rd Term';
  principalName: string;
  logoUrl: string;
  currentTier: SchoolTier;
  subscriptionRenewalDate: string;
  smsCreditsBalance: number;
}
