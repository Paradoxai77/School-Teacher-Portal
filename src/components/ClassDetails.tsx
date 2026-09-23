import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClass, getStudents, saveAttendance, type ClassInfo, type Student } from '../services/mockData';
import { Users, ArrowLeft, Calendar } from 'lucide-react';
import { Modal } from './Modal';

export function ClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!classId) return;
    Promise.all([
      getClass(classId),
      getStudents(classId)
    ]).then(([cls, stus]) => {
      setClassInfo(cls);
      setStudents(stus);
      setLoading(false);
    });
  }, [classId]);

  const openAttendance = () => {
    const initialAtt: Record<string, boolean> = {};
    students.forEach(s => initialAtt[s.id] = true);
    setAttendance(initialAtt);
    setIsAttendanceModalOpen(true);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSaveAttendance = async () => {
    if (!classInfo) return;
    const records = students.map(s => ({ studentId: s.id, present: attendance[s.id] }));
    await saveAttendance(classInfo.id, records);
    alert('Attendance saved successfully!');
    setIsAttendanceModalOpen(false);
  };

  if (loading) return <div>Loading class details...</div>;
  if (!classInfo) return <div>Class not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/app/classes')} style={{ alignSelf: 'flex-start', border: 'none', padding: 0 }}>
        <ArrowLeft size={20} /> Back to My Classes
      </button>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{classInfo.name} - Section {classInfo.section}</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Subject: {classInfo.subject}</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={openAttendance}>
            <Calendar size={18} /> Take Attendance
          </button>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} /> Class Student List ({classInfo.studentsCount})
        </h2>
        
        <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--secondary-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Roll Number</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{s.rollNumber}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary" onClick={() => navigate(`/app/classes/${classInfo.id}/student/${s.id}`)}>
                      Academic View
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No students enrolled in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isAttendanceModalOpen} 
        onClose={() => setIsAttendanceModalOpen(false)} 
        title={`Take Attendance: ${classInfo.name} - ${classInfo.section}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {students.map(s => (
              <div key={s.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{s.name} ({s.rollNumber})</span>
                <button 
                  onClick={() => toggleAttendance(s.id)}
                  className={`btn ${attendance[s.id] ? 'btn-success' : 'btn-secondary'}`}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: '80px' }}
                >
                  {attendance[s.id] ? 'Present' : 'Absent'}
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleSaveAttendance} style={{ marginTop: '1rem', width: '100%' }}>
            Submit Attendance
          </button>
        </div>
      </Modal>
    </div>
  );
}
