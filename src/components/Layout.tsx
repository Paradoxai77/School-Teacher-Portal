import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList, 
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const navigate = useNavigate();
  const { currentTeacher, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{
        width: '260px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        borderRight: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
          }}>SE</div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>School<br/>Enterprise</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavLink to="/app" end className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/app/classes" className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <Users size={20} /> My Classes
          </NavLink>
          <NavLink to="/app/subjects" className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <BookOpen size={20} /> My Subjects
          </NavLink>
          <NavLink to="/app/attendance" className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <ClipboardList size={20} /> Attendance
          </NavLink>
          <NavLink to="/app/assignments" className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <BookOpen size={20} /> Assignments
          </NavLink>
          <NavLink to="/app/exams" className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <ClipboardList size={20} /> Exams & Marks
          </NavLink>
          <NavLink to="/app/reports" className={({isActive}) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
            <LayoutDashboard size={20} /> Reports
          </NavLink>
        </nav>

        {currentTeacher && (
          <div style={{
            marginTop: 'auto',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <img src={currentTeacher.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border-color)' }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentTeacher.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentTeacher.role}</div>
            </div>
          </div>
        )}
        
        <button onClick={handleLogout} className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', border: 'none', color: 'var(--danger)' }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="glass" style={{
          height: '70px',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="animate-fade-in" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .active-nav {
          background-color: var(--primary-color) !important;
          color: white !important;
          box-shadow: var(--shadow-glow);
        }
      `}</style>
    </div>
  );
}
