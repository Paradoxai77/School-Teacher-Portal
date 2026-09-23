import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

export function ReportsWorkspace() {
  const [activeTab, setActiveTab] = useState<'subject' | 'class'>('subject');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reports & Analytics</h1>
        <p>View detailed performance metrics for your subjects and classes.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'subject' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('subject')}
        >
          <BarChart3 size={18} /> Subject Performance
        </button>
        <button 
          className={`btn ${activeTab === 'class' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('class')}
        >
          <Users size={18} /> Class Performance
        </button>
      </div>

      {activeTab === 'subject' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <TrendingUp size={18} /> Highest Average
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Mathematics</div>
              <div style={{ color: 'var(--success)' }}>88% Average</div>
            </div>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <PieChart size={18} /> Pass Rate
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>94%</div>
              <div style={{ color: 'var(--text-secondary)' }}>Across all subjects</div>
            </div>
          </div>
          
          <div className="card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Subject Breakdown</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Detailed graphs and tables for each subject would be displayed here.</p>
          </div>
        </div>
      )}

      {activeTab === 'class' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <Users size={18} /> Top Performing Class
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Grade 10 - A</div>
              <div style={{ color: 'var(--success)' }}>91% Average</div>
            </div>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <TrendingUp size={18} /> Most Improved
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Grade 11 - Sci</div>
              <div style={{ color: 'var(--primary-color)' }}>+5% from last term</div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Class Comparative Analysis</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Charts comparing class performance metrics across different assessments.</p>
          </div>
        </div>
      )}
    </div>
  );
}
