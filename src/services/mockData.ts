import db from '../../db.json';

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
    return await res.json();
  } catch (error) {
    console.warn('Falling back to local db.json for students');
    return (db as any).students || [];
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
