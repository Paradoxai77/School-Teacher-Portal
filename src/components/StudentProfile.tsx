import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, type Student } from '../services/mockData';
import { User, ArrowLeft, Book, Award, Clock } from 'lucide-react';

export function StudentProfile() {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    getStudent(studentId).then(data => {
      setStudent(data);
      setLoading(false);
    });
  }, [studentId]);

  if (loading) return <div>Loading student profile...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button className="btn btn-secondary" onClick={() => navigate(`/app/classes/${classId}`)} style={{ alignSelf: 'flex-start', border: 'none', padding: 0 }}>
        <ArrowLeft size={20} /> Back to Class Details
      </button>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: 'var(--primary-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white'
        }}>
          <User size={40} />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{student.name}</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.25rem' }}>
            Roll Number: {student.rollNumber}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={20} /> Attendance Overview
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>92%</div>
          <div style={{ color: 'var(--text-secondary)' }}>Present in 46/50 classes</div>
        </div>
        
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Award size={20} /> Academic Performance
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>A-</div>
          <div style={{ color: 'var(--text-secondary)' }}>Overall Grade Average</div>
        </div>

        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Book size={20} /> Pending Assignments
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>2</div>
          <div style={{ color: 'var(--text-secondary)' }}>Due this week</div>
        </div>
      </div>
    </div>
  );
}
