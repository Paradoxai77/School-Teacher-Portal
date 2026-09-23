import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeacherSubjects, type Subject } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, BookOpen, Users, Activity } from 'lucide-react';

export function SubjectDetails() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { currentTeacher } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTeacher || !subjectId) return;
    getTeacherSubjects(currentTeacher.id).then(data => {
      const found = data.find(s => s.id === subjectId);
      setSubject(found || null);
      setLoading(false);
    });
  }, [subjectId, currentTeacher]);

  if (loading) return <div>Loading subject details...</div>;
  if (!subject) return <div>Subject not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/app/subjects')} style={{ alignSelf: 'flex-start', border: 'none', padding: 0 }}>
        <ArrowLeft size={20} /> Back to My Subjects
      </button>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <BookOpen size={30} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{subject.name}</h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Subject Workspace</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/app/assignments')}>
            View Assignments
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BookOpen size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{subject.classesCount} Classes</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Currently enrolled</p>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Users size={32} color="var(--secondary-color)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{subject.studentsCount} Students</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Total students across all classes</p>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Activity size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Avg. Performance: B+</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Across all assessments</p>
        </div>
      </div>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Activity in {subject.name}</h2>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)' }}>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
