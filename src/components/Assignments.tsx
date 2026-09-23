import { useState, useEffect } from 'react';
import { getAssignments, createAssignment, type Assignment } from '../services/mockData';
import { BookOpen, Calendar, ChevronRight, FilePlus, Users } from 'lucide-react';
import { Modal } from './Modal';
import { useNavigate } from 'react-router-dom';

export function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('C1');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    getAssignments().then(data => {
      setAssignments(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssignment({
      title,
      subject,
      classId,
      dueDate,
      submissionsCount: 0,
      totalStudents: 30, // Mock count
      status: 'Active'
    });
    alert('Assignment created successfully!');
    setIsNewModalOpen(false);
    setTitle('');
    setSubject('');
    setDueDate('');
    loadData();
  };

  const getStatusBadge = (status: Assignment['status']) => {
    if (status === 'Active') {
      return <span className="badge badge-success">Active</span>;
    }
    return <span className="badge" style={{ background: 'var(--border-color)', color: 'var(--text-secondary)' }}>Closed</span>;
  };

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assignments</h1>
          <p>Create, manage, and review student assignments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsNewModalOpen(true)}>
          <FilePlus size={18} /> New Assignment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {assignments.map(assignment => (
          <div key={assignment.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer' }} onClick={() => navigate(`/app/assignments/${assignment.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 600 }}>{assignment.title}</h3>
                <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                   <BookOpen size={16} /> {assignment.subject} (Class {assignment.classId})
                </div>
              </div>
              {getStatusBadge(assignment.status)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Calendar size={16} /> <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Due:</span> {new Date(assignment.dueDate).toLocaleDateString()}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                     <Users size={14} /> Submissions
                   </div>
                   <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                     {assignment.submissionsCount} / {assignment.totalStudents}
                   </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: assignment.status === 'Active' ? 'var(--primary-color)' : 'var(--text-secondary)', 
                    width: `${(assignment.submissionsCount / assignment.totalStudents) * 100}%` 
                  }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                View Assignment Workspace <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="Create New Assignment">
        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Due Date</label>
            <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Assignment</button>
        </form>
      </Modal>
    </div>
  );
}
