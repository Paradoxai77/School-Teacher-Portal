import { useState, useEffect } from 'react';
import { getClasses, type ClassInfo } from '../services/mockData';
import { Users, ChevronRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Classes() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getClasses().then(data => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading classes...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Classes</h1>
        <p>Manage your assigned classes, attendance, and student lists.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {classes.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer' }} onClick={() => navigate(`/app/classes/${c.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{c.name} - Section {c.section}</h3>
                <div style={{ color: 'var(--text-secondary)' }}>{c.subject}</div>
              </div>
              {c.isClassTeacher && (
                <span className="badge badge-success" style={{ display: 'flex', gap: '0.25rem' }}>
                  <UserCheck size={14} /> Class Teacher
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <Users size={18} /> {c.studentsCount} Students
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                View Class Workspace <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

