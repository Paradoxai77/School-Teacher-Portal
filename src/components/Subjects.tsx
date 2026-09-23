import { useState, useEffect } from 'react';
import { getTeacherSubjects, type Subject } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTeacher } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentTeacher) return;
    getTeacherSubjects(currentTeacher.id).then(data => {
      setSubjects(data);
      setLoading(false);
    });
  }, [currentTeacher]);

  if (loading) return <div>Loading subjects...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Subjects</h1>
        <p>Manage the subjects you teach and view subject-specific performance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {subjects.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer' }} onClick={() => navigate(`/app/subjects/${s.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.name}</h3>
              </div>
              <span className="badge badge-primary" style={{ display: 'flex', gap: '0.25rem' }}>
                <BookOpen size={14} /> Subject
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} /> {s.classesCount} Classes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> {s.studentsCount} Students Total
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                View Subject Workspace <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
