import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam, getStudents, saveMarks, type Exam, type Student, type Mark } from '../services/mockData';
import { ArrowLeft, ClipboardList, Calendar, Users, Edit3, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';

export function ExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEnterMarksOpen, setIsEnterMarksOpen] = useState(false);
  const [marks, setMarks] = useState<Record<string, number | ''>>({});

  useEffect(() => {
    if (!examId) return;
    getExam(examId).then(asmt => {
      if (!asmt) {
        setLoading(false);
        return;
      }
      setExam(asmt);
      getStudents(asmt.classId).then(stus => {
        setStudents(stus);
        setLoading(false);
      });
    });
  }, [examId]);

  const openEnterMarks = () => {
    const initialMarks: Record<string, number | ''> = {};
    students.forEach(s => initialMarks[s.id] = '');
    setMarks(initialMarks);
    setIsEnterMarksOpen(true);
  };

  const handleSaveMarks = async () => {
    if (!exam) return;
    const records: Mark[] = students.map(s => ({ 
      studentId: s.id, 
      examId: exam.id, 
      score: marks[s.id] === '' ? null : Number(marks[s.id]) 
    }));
    await saveMarks(exam.id, records);
    alert('Marks saved successfully!');
    setIsEnterMarksOpen(false);
    // Locally mock status update for demo
    setExam({ ...exam, status: 'Submitted' });
  };

  if (loading) return <div>Loading exam details...</div>;
  if (!exam) return <div>Exam not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/app/exams')} style={{ alignSelf: 'flex-start', border: 'none', padding: 0 }}>
        <ArrowLeft size={20} /> Back to Exams
      </button>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{exam.title}</h1>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ClipboardList size={18} /> {exam.subject} (Class {exam.classId})</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={18} /> {new Date(exam.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {exam.status === 'Draft' ? (
            <button className="btn btn-primary" onClick={openEnterMarks}>
              <Edit3 size={18} /> Enter Marks
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold' }}>
              <CheckCircle size={24} /> Marks Submitted
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} /> Class Roster & Marks
        </h2>
        
        <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--secondary-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Roll Number</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{s.rollNumber}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '1rem' }}>
                    {exam.status === 'Draft' ? (
                      <span style={{ color: 'var(--text-secondary)' }}>Pending</span>
                    ) : (
                      <span style={{ fontWeight: 'bold' }}>{Math.floor(Math.random() * exam.maxMarks)} / {exam.maxMarks}</span>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No students found in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isEnterMarksOpen} 
        onClose={() => setIsEnterMarksOpen(false)} 
        title={`Enter Marks: ${exam.title}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {students.map(s => (
              <div key={s.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{s.name} ({s.rollNumber})</span>
                <input 
                  type="number" 
                  min="0" 
                  max={exam.maxMarks} 
                  value={marks[s.id] ?? ''}
                  onChange={e => setMarks(prev => ({ ...prev, [s.id]: e.target.value === '' ? '' : Number(e.target.value) }))}
                  placeholder={`/ ${exam.maxMarks}`}
                  style={{ width: '100px', padding: '0.25rem 0.5rem' }}
                />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleSaveMarks} style={{ marginTop: '1rem', width: '100%' }}>
            Submit Marks
          </button>
        </div>
      </Modal>
    </div>
  );
}
