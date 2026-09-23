import { useState, useEffect } from 'react';
import { getClasses, getAttendanceHistory, type ClassInfo } from '../services/mockData';
import { Calendar, Clock, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AttendanceWorkspace() {
  const [activeTab, setActiveTab] = useState<'entry' | 'history' | 'correction'>('entry');
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getClasses(),
      getAttendanceHistory()
    ]).then(([cls, hist]) => {
      setClasses(cls);
      setHistory(hist);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading attendance data...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Attendance Workspace</h1>
        <p>Manage daily attendance, view past records, and request corrections.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'entry' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('entry')}
        >
          <Calendar size={18} /> Attendance Entry
        </button>
        <button 
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} /> Attendance History
        </button>
        <button 
          className={`btn ${activeTab === 'correction' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('correction')}
        >
          <Edit3 size={18} /> Correction Request
        </button>
      </div>

      {activeTab === 'entry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Select a Class to Take Attendance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {classes.map(c => (
              <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>{c.name} - Section {c.section}</h3>
                  <div style={{ color: 'var(--text-secondary)' }}>{c.studentsCount} Students</div>
                </div>
                <button className="btn btn-primary" onClick={() => navigate(`/app/classes/${c.id}`)}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Past Attendance Records</h2>
          <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--secondary-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Class</th>
                  <th style={{ padding: '1rem' }}>Present / Total</th>
                </tr>
              </thead>
              <tbody>
                {history.map(record => {
                  const cls = classes.find(c => c.id === record.classId);
                  const presentCount = record.records?.filter((r: any) => r.present).length || 0;
                  const totalCount = record.records?.length || 0;
                  return (
                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>{new Date(record.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{cls ? `${cls.name} - ${cls.section}` : record.classId}</td>
                      <td style={{ padding: '1rem' }}>{presentCount} / {totalCount}</td>
                    </tr>
                  );
                })}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No attendance history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'correction' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Request Attendance Correction</h2>
          <div className="card" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Class</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                  <option value="">Select a class...</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date of Attendance</label>
                <input type="date" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Reason for Correction</label>
                <textarea rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} placeholder="Explain why the attendance record needs to be corrected..."></textarea>
              </div>
              <button className="btn btn-primary" onClick={() => alert('Correction request submitted to administration.')}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
