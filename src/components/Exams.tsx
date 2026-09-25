import { useState, useEffect } from 'react';
import { getExams, createExam, type Exam } from '../services/mockData';
import { ClipboardList, Calendar, ChevronRight, FileText } from 'lucide-react';
import { Modal } from './Modal';
import { useNavigate } from 'react-router-dom';

export function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

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
    setIsNewModalOpen(false);
    setTitle('');
    setSubject('');
    setDate('');
    loadData();
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
        <button className="btn btn-primary" onClick={() => setIsNewModalOpen(true)}>
          <FileText size={18} /> New Assessment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {exams.map(exam => (
          <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer' }} onClick={() => navigate(`/app/exams/${exam.id}`)}>
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

            <div style={{ display: 'flex', marginTop: 'auto', paddingTop: '1rem' }}>
              <button className="btn btn-secondary text-sm" style={{ padding: '0.4rem 0.8rem' }}>
                View Exam Workspace <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="Schedule New Assessment">
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
    </div>
  );
}
