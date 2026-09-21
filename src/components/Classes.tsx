import { useState, useEffect } from 'react';
import { getClasses, getStudents, saveAttendance, type ClassInfo, type Student } from '../services/mockData';
import { Users, ChevronRight, UserCheck } from 'lucide-react';
import { Modal } from './Modal';

export function Classes() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalType, setModalType] = useState<'attendance' | 'students' | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getClasses().then(data => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  const openModal = async (c: ClassInfo, type: 'attendance' | 'students') => {
    setSelectedClass(c);
    setModalType(type);
    const data = await getStudents(c.id);
    setStudents(data);
    if (type === 'attendance') {
      const initialAtt: Record<string, boolean> = {};
      data.forEach(s => initialAtt[s.id] = true);
      setAttendance(initialAtt);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedClass(null);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) return;
    const records = students.map(s => ({ studentId: s.id, present: attendance[s.id] }));
    await saveAttendance(selectedClass.id, records);
    alert('Attendance saved successfully!');
    closeModal();
  };

  if (loading) return <div>Loading classes...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Classes</h1>
        <p>Manage your assigned classes, attendance, and student lists.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {classes.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openModal(c, 'attendance')}>Attendance</button>
              <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="View Students" onClick={() => openModal(c, 'students')}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={modalType === 'students'} 
        onClose={closeModal} 
        title={`Students in ${selectedClass?.name} - ${selectedClass?.section}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {students.map(s => (
            <div key={s.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{s.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>Roll: {s.rollNumber}</span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={modalType === 'attendance'} 
        onClose={closeModal} 
        title={`Take Attendance: ${selectedClass?.name} - ${selectedClass?.section}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {students.map(s => (
              <div key={s.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{s.name}</span>
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
            Save Attendance
          </button>
        </div>
      </Modal>
    </div>
  );
}
