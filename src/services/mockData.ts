export interface Teacher {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Class Teacher' | 'Subject Teacher' | 'Both';
  avatar: string;
  subjects: string[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
  studentsCount: number;
  subject: string;
  isClassTeacher: boolean;
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

const API_URL = 'http://localhost:3000';

export const getTeachers = async (): Promise<Teacher[]> => {
  const res = await fetch(`${API_URL}/teachers`);
  return res.json();
};

export const getClasses = async (): Promise<ClassInfo[]> => {
  const res = await fetch(`${API_URL}/classes`);
  return res.json();
};

export const getStudents = async (classId: string): Promise<Student[]> => {
  const res = await fetch(`${API_URL}/students?classId=${classId}`);
  return res.json();
};

export const getExams = async (): Promise<Exam[]> => {
  const res = await fetch(`${API_URL}/exams`);
  return res.json();
};

export const getAssignments = async (): Promise<Assignment[]> => {
  const res = await fetch(`${API_URL}/assignments`);
  return res.json();
};

export const createAssignment = async (data: Omit<Assignment, 'id'>): Promise<Assignment> => {
  const res = await fetch(`${API_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, id: `A${Date.now()}` }),
  });
  return res.json();
};

export const createExam = async (data: Omit<Exam, 'id'>): Promise<Exam> => {
  const res = await fetch(`${API_URL}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, id: `E${Date.now()}` }),
  });
  return res.json();
};

export const saveAttendance = async (classId: string, records: any[]): Promise<any> => {
  const res = await fetch(`${API_URL}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId, date: new Date().toISOString(), records, id: `ATT${Date.now()}` }),
  });
  return res.json();
};

export const saveMarks = async (examId: string, marks: Mark[]): Promise<any> => {
  const res = await fetch(`${API_URL}/marks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examId, marks, id: `MK${Date.now()}` }),
  });
  return res.json();
};
