import { useState, useEffect } from 'react';
import { getExams, createExam, getStudents, saveMarks, type Exam, type Student, type Mark } from '../services/mockData';
import { ClipboardList, Calendar, Edit3, CheckCircle, FileText } from 'lucide-react';
import { Modal } from './Modal';

export function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalType, setModalType] = useState<'new' | 'enter_marks' | 'view_marks' | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, number | ''>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('C1');
  const [date, setDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');

  const loadData = () => {
    getExams().then(data => {
      setExams(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    await createExam({
      title,
      subject,
      classId,
      date,
      maxMarks: Number(maxMarks),
      status: 'Draft'
    });
    alert('Assessment created successfully!');
    setModalType(null);
    setTitle('');
    setSubject('');
    setDate('');
    loadData();
  };

  const openMarksModal = async (exam: Exam, type: 'enter_marks' | 'view_marks') => {
    setSelectedExam(exam);
    setModalType(type);
    const data = await getStudents(exam.classId);
    setStudents(data);
    if (type === 'enter_marks') {
      const initialMarks: Record<string, number | ''> = {};
      data.forEach(s => initialMarks[s.id] = '');
      setMarks(initialMarks);
    }
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) return;
    const records: Mark[] = students.map(s => ({ 
      studentId: s.id, 
      examId: selectedExam.id, 
      score: marks[s.id] === '' ? null : Number(marks[s.id]) 
    }));
    await saveMarks(selectedExam.id, records);
    alert('Marks saved successfully!');
    setModalType(null);
  };

  const getStatusBadge = (status: Exam['status']) => {
    switch (status) {
      case 'Published': return <span className="badge badge-success">Published</span>;
      case 'Submitted': return <span className="badge badge-warning">Submitted</span>;
      default: return <span className="badge" style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>Draft</span>;
    }
  };

  if (loading) return <div>Loading exams...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Exams & Marks</h1>
          <p>Manage assessments and enter marks for your classes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalType('new')}>
          <FileText size={18} /> New Assessment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {exams.map(exam => (
          <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 600 }}>{exam.title}</h3>
                <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                   <ClipboardList size={16} /> {exam.subject} (Class {exam.classId})
                </div>
              </div>
              {getStatusBadge(exam.status)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} /> {new Date(exam.date).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Max Marks:</span> {exam.maxMarks}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              {exam.status === 'Draft' ? (
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openMarksModal(exam, 'enter_marks')}>
                  <Edit3 size={18} /> Enter Marks
                </button>
              ) : (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => openMarksModal(exam, 'view_marks')}>
                  <CheckCircle size={18} /> View Marks
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalType === 'new'} onClose={() => setModalType(null)} title="Schedule New Assessment">
        <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subject</label>
            <input required type="text" value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Class</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="C1">Grade 10 - A</option>
              <option value="C2">Grade 10 - B</option>
              <option value="C3">Grade 11 - Science</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Maximum Marks</label>
            <input required type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Schedule Assessment</button>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'enter_marks'} onClose={() => setModalType(null)} title={`Enter Marks: ${selectedExam?.title}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {students.map(s => (
              <div key={s.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{s.name}</span>
                <input 
                  type="number" 
                  min="0" 
                  max={selectedExam?.maxMarks} 
                  value={marks[s.id] ?? ''}
                  onChange={e => setMarks(prev => ({ ...prev, [s.id]: e.target.value === '' ? '' : Number(e.target.value) }))}
                  placeholder={`/ ${selectedExam?.maxMarks}`}
                  style={{ width: '100px', padding: '0.25rem 0.5rem' }}
                />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleSaveMarks} style={{ marginTop: '1rem', width: '100%' }}>
            Save Marks
          </button>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'view_marks'} onClose={() => setModalType(null)} title={`Marks for ${selectedExam?.title}`}>
        <p>This is a simulated screen. You would typically see the saved marks here.</p>
        <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setModalType(null)}>Close</button>
      </Modal>
    </div>
  );
}
