import db from '../../db.json';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Class Teacher' | 'Subject Teacher' | 'Both';
  avatar: string;
  subjects: string[];
  classesTaught?: string[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  attendancePct?: number;
  academicAverage?: number;
  pendingAssignments?: number;
  recentPerformance?: 'Up' | 'Down' | 'Stable';
  status?: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
}

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
  studentsCount: number;
  subject: string;
  isClassTeacher: boolean;
  // Extended fields for Class Workspace
  teacherName?: string;
  todayAttendance?: string;
  overallAttendance?: string;
  pendingAssignments?: number;
  upcomingExams?: number;
  academicYear?: string;
  currentTerm?: string;
}

export interface Exam {
  id: string;
  title: string;
  classId: string;
  subject: string;
  date: string;
  maxMarks: number;
  status: 'Draft' | 'Submitted' | 'Published';
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  subject: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
  status: 'Active' | 'Closed';
}

export interface Mark {
  studentId: string;
  examId: string;
  score: number | null;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  status: 'Graded' | 'Ungraded' | 'Late';
  score?: number;
  feedback?: string;
}

export interface Subject {
  id: string;
  name: string;
  classesCount: number;
  studentsCount: number;
}

export interface ClassSubject {
  id: string;
  subjectName: string;
  subjectTeacherName: string;
  recentAssessment: string;
  classAverage: string;
  pendingActivity: string;
}

// IMPORTANT: Replace this with your live Render Web Service URL (e.g. 'https://school-teacher-portal-backend.onrender.com')
// Local testing: 'http://localhost:3000'
const API_URL = 'YOUR_RENDER_URL_HERE';

export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const res = await fetch(`${API_URL}/teachers`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for teachers');
    return db.teachers as Teacher[];
  }
};

export const getClasses = async (): Promise<ClassInfo[]> => {
  try {
    const res = await fetch(`${API_URL}/classes`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for classes');
    return db.classes as ClassInfo[];
  }
};

export const getStudents = async (classId: string): Promise<Student[]> => {
  try {
    const res = await fetch(`${API_URL}/students?classId=${classId}`);
    if (!res.ok) throw new Error('API failed');
    const students: Student[] = await res.json();
    return enrichStudents(students);
  } catch (error) {
    console.warn('Falling back to local db.json for students');
    const students = (db as any).students.filter((s: any) => s.classId === classId) || [];
    return enrichStudents(students);
  }
};

function enrichStudents(students: any[]): Student[] {
  return students.map((s, idx) => {
    // Generate deterministic mock data based on index
    const attendancePct = 70 + (idx * 7) % 30; // 70 to 99
    const academicAverage = 65 + (idx * 5) % 35; // 65 to 100
    const pendingAssignments = (idx * 3) % 4; // 0 to 3
    
    let status: Student['status'] = 'Good';
    if (academicAverage > 90 && attendancePct > 90) status = 'Excellent';
    else if (academicAverage < 75 || attendancePct < 80) status = 'Needs Attention';
    if (academicAverage < 65 || attendancePct < 70) status = 'Critical';

    let recentPerformance: Student['recentPerformance'] = 'Stable';
    if (idx % 3 === 0) recentPerformance = 'Up';
    if (idx % 4 === 0) recentPerformance = 'Down';

    return {
      ...s,
      attendancePct,
      academicAverage,
      pendingAssignments,
      recentPerformance,
      status
    };
  });
}

export const getStudent = async (id: string): Promise<Student | null> => {
  try {
    const res = await fetch(`${API_URL}/students/${id}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for student');
    return (db as any).students.find((s: any) => s.id === id) || null;
  }
};

export const getExams = async (): Promise<Exam[]> => {
  try {
    const res = await fetch(`${API_URL}/exams`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for exams');
    return db.exams as Exam[];
  }
};

export const getAssignments = async (): Promise<Assignment[]> => {
  try {
    const res = await fetch(`${API_URL}/assignments`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for assignments');
    return db.assignments as Assignment[];
  }
};

export const createAssignment = async (data: Omit<Assignment, 'id'>): Promise<Assignment> => {
  try {
    const res = await fetch(`${API_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: `A${Date.now()}` }),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    return { ...data, id: `A${Date.now()}` } as Assignment;
  }
};

export const createExam = async (data: Omit<Exam, 'id'>): Promise<Exam> => {
  try {
    const res = await fetch(`${API_URL}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: `E${Date.now()}` }),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    return { ...data, id: `E${Date.now()}` } as Exam;
  }
};

export const saveAttendance = async (classId: string, records: any[]): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, date: new Date().toISOString(), records, id: `ATT${Date.now()}` }),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    return { success: true };
  }
};

export const saveMarks = async (examId: string, marks: Mark[]): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, marks, id: `MK${Date.now()}` }),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    return { success: true };
  }
};

export const getSubmissions = async (assignmentId: string): Promise<Submission[]> => {
  try {
    const res = await fetch(`${API_URL}/submissions?assignmentId=${assignmentId}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for submissions');
    return ((db as any).submissions || []).filter((s: Submission) => s.assignmentId === assignmentId);
  }
};

export const getTeacherSubjects = async (teacherId: string): Promise<Subject[]> => {
  // Mock logic to extract subjects from teacher
  const teacher = (db.teachers as Teacher[]).find(t => t.id === teacherId);
  if (!teacher) return [];
  return teacher.subjects.map((subj, idx) => ({
    id: `SUB${idx}`,
    name: subj,
    classesCount: Math.floor(Math.random() * 3) + 1,
    studentsCount: Math.floor(Math.random() * 50) + 20
  }));
};

export const getAssignment = async (id: string): Promise<Assignment | null> => {
  const assignments = await getAssignments();
  return assignments.find(a => a.id === id) || null;
};

export const getExam = async (id: string): Promise<Exam | null> => {
  const exams = await getExams();
  return exams.find(e => e.id === id) || null;
};

export const getClass = async (id: string): Promise<ClassInfo | null> => {
  const classes = await getClasses();
  const cls = classes.find(c => c.id === id);
  if (!cls) return null;
  
  // Inject mock data for extended workspace fields
  return {
    ...cls,
    teacherName: cls.teacherName || 'Sarah Jenkins',
    todayAttendance: cls.todayAttendance || '94%',
    overallAttendance: cls.overallAttendance || '92%',
    pendingAssignments: cls.pendingAssignments ?? 2,
    upcomingExams: cls.upcomingExams ?? 1,
    academicYear: cls.academicYear || '2026-2027',
    currentTerm: cls.currentTerm || 'Term 1'
  };
};

export const getAttendanceHistory = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}/attendance`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for attendance history');
    return (db as any).attendance || [];
  }
};

export const getClassSubjects = async (_classId: string): Promise<ClassSubject[]> => {
  // Mock data for Stage 1 requirements
  return [
    { id: 'CS1', subjectName: 'Mathematics', subjectTeacherName: 'Mr. Amit Sharma', recentAssessment: 'Unit Test 1', classAverage: '85%', pendingActivity: 'Grade Algebra Worksheet' },
    { id: 'CS2', subjectName: 'Physics', subjectTeacherName: 'Mrs. Neha Gupta', recentAssessment: 'Mid-Term Assessment', classAverage: '88%', pendingActivity: 'None' },
    { id: 'CS3', subjectName: 'Chemistry', subjectTeacherName: 'Mrs. Neha Gupta', recentAssessment: 'Lab Report', classAverage: '79%', pendingActivity: 'Assign Homework' },
    { id: 'CS4', subjectName: 'English Lit', subjectTeacherName: 'Ms. Sneha Patil', recentAssessment: 'Essay Draft 1', classAverage: '91%', pendingActivity: 'Grade Essays' },
    { id: 'CS5', subjectName: 'Economics', subjectTeacherName: 'Mr. Rohan Desai', recentAssessment: 'Chapter 4 Quiz', classAverage: '74%', pendingActivity: 'Review Quiz Results' },
  ];
};

export interface StudentSubjectRecord {
  id: string;
  subjectName: string;
  scorePct: number;
}

export interface StudentAssignmentRecord {
  id: string;
  assignmentTitle: string;
  subjectName: string;
  dueDate: string;
  status: 'Submitted' | 'Late' | 'Pending';
  score: string;
  feedback: string;
}

export interface StudentExamRecord {
  id: string;
  examTitle: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  status: 'Passed' | 'Failed' | 'Pending';
}

export interface StudentRemark {
  id: string;
  date: string;
  teacherName: string;
  remark: string;
}

export const getStudentSubjects = async (_studentId: string): Promise<StudentSubjectRecord[]> => {
  return [
    { id: '1', subjectName: 'Mathematics', scorePct: 84 },
    { id: '2', subjectName: 'Physics', scorePct: 76 },
    { id: '3', subjectName: 'English Lit', scorePct: 88 },
    { id: '4', subjectName: 'Chemistry', scorePct: 82 },
  ];
};

export const getStudentAssignments = async (_studentId: string): Promise<StudentAssignmentRecord[]> => {
  return [
    { id: '1', assignmentTitle: 'Algebra Worksheet', subjectName: 'Mathematics', dueDate: '2026-10-01', status: 'Submitted', score: '9/10', feedback: 'Good work' },
    { id: '2', assignmentTitle: 'Mid-Term Essay', subjectName: 'English Lit', dueDate: '2026-10-05', status: 'Pending', score: '-', feedback: '-' },
    { id: '3', assignmentTitle: 'Lab Report 3', subjectName: 'Physics', dueDate: '2026-09-20', status: 'Late', score: '7.5/10', feedback: 'Deducted for lateness' },
  ];
};

export const getStudentExams = async (_studentId: string): Promise<StudentExamRecord[]> => {
  return [
    { id: '1', examTitle: 'Unit Test 1', subjectName: 'Mathematics', marksObtained: 42, maxMarks: 50, percentage: 84, status: 'Passed' },
    { id: '2', examTitle: 'Mid-Term', subjectName: 'Physics', marksObtained: 38, maxMarks: 50, percentage: 76, status: 'Passed' },
    { id: '3', examTitle: 'Quarterly', subjectName: 'English Lit', marksObtained: 88, maxMarks: 100, percentage: 88, status: 'Passed' },
  ];
};

export const getStudentRemarks = async (_studentId: string): Promise<StudentRemark[]> => {
  return [
    { id: '1', date: '2026-09-15', teacherName: 'Mr. Amit Sharma', remark: 'Excellent participation in class discussions.' },
    { id: '2', date: '2026-08-20', teacherName: 'Mrs. Neha Gupta', remark: 'Needs to focus more during practical sessions.' },
  ];
};
