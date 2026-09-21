import { useState, useEffect } from 'react';
import { getClasses, type ClassInfo } from '../services/mockData';
import { Users, AlertCircle, BookOpen, Clock, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentTeacher } = useAuth();

  useEffect(() => {
    getClasses().then(data => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome back, {currentTeacher?.name.split(' ')[0]}
        </h1>
        <p>Here is what's happening today.</p>
        
        {/* Display Subjects */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {currentTeacher?.subjects?.map((sub, index) => (
            <span key={index} className="badge" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Tag size={12} style={{ color: 'var(--primary-color)' }} /> {sub}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{classes.length}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Assigned Classes</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
            <div style={{ color: 'var(--text-secondary)' }}>Pending Marks</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</div>
            <div style={{ color: 'var(--text-secondary)' }}>Active Assignments</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} /> Today's Schedule
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {classes.map((c, i) => (
            <div key={c.id} style={{ 
              padding: '1.5rem', 
              borderBottom: i < classes.length - 1 ? '1px solid var(--border-color)' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{c.name} - Section {c.section}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{c.subject}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="badge badge-success">09:00 AM</span>
                <button className="btn btn-secondary text-sm">Take Attendance</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
