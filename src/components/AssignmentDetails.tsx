import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignment, getSubmissions, type Assignment, type Submission } from '../services/mockData';
import { ArrowLeft, BookOpen, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Modal } from './Modal';

export function AssignmentDetails() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number | ''>('');

  useEffect(() => {
    if (!assignmentId) return;
    Promise.all([
      getAssignment(assignmentId),
      getSubmissions(assignmentId)
    ]).then(([asmt, subs]) => {
      setAssignment(asmt);
      setSubmissions(subs);
      setLoading(false);
    });
  }, [assignmentId]);

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    
    // In a real app, you would make an API call here.
    // For now, we update local state to mock it.
    const updatedSubmissions = submissions.map(s => 
      s.id === selectedSubmission.id 
        ? { ...s, status: 'Graded' as const, score: Number(score), feedback }
        : s
    );
    setSubmissions(updatedSubmissions);
    alert('Submission graded successfully!');
    setSelectedSubmission(null);
  };

  const openGradingModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || '');
    setScore(submission.score ?? '');
  };

  if (loading) return <div>Loading assignment details...</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/app/assignments')} style={{ alignSelf: 'flex-start', border: 'none', padding: 0 }}>
        <ArrowLeft size={20} /> Back to Assignments
      </button>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{assignment.title}</h1>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BookOpen size={18} /> {assignment.subject} (Class {assignment.classId})</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={18} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{assignment.submissionsCount} / {assignment.totalStudents}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Submitted</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} /> Student Submissions
        </h2>
        
        <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--secondary-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Student ID</th>
                <th style={{ padding: '1rem' }}>Submitted At</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{s.studentId}</td>
                  <td style={{ padding: '1rem' }}>{new Date(s.submittedAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    {s.status === 'Graded' ? (
                      <span className="badge badge-success"><CheckCircle size={14} /> Graded ({s.score})</span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--warning)', color: 'black' }}><Clock size={14} /> Needs Review</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary" onClick={() => openGradingModal(s)}>
                      {s.status === 'Graded' ? 'Edit Grade' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No submissions available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={!!selectedSubmission} 
        onClose={() => setSelectedSubmission(null)} 
        title={`Review Submission: ${selectedSubmission?.studentId}`}
      >
        <form onSubmit={handleGradeSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Score</label>
            <input required type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value ? Number(e.target.value) : '')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Feedback</label>
            <textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} placeholder="Provide constructive feedback..."></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Grade</button>
        </form>
      </Modal>
    </div>
  );
}
