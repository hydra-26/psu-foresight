import React, { useState, useEffect } from 'react';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('Testing...');
  const [backendData, setBackendData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Health check
      const healthResponse = await fetch('http://localhost:5000/api/health');
      const healthData = await healthResponse.json();
      
      if (healthData.status === 'ok') {
        setBackendStatus('✅ Connected!');
        
        // Test 2: Get enrollment data
        const enrollmentResponse = await fetch('http://localhost:5000/api/enrollment');
        const enrollmentData = await enrollmentResponse.json();
        setBackendData(enrollmentData);
      } else {
        setBackendStatus('❌ Backend not responding');
      }
    } catch (err) {
      setBackendStatus('❌ Connection Failed');
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #0047AB', margin: '20px', borderRadius: '10px' }}>
      <h2 style={{ color: '#0047AB' }}>Backend Connection Test</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{backendStatus}</p>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
          <p style={{ fontSize: '12px', marginTop: '5px' }}>
            Make sure backend is running on http://localhost:5000
          </p>
        </div>
      )}
      
      {backendData && (
        <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <h3>Sample Data from Backend:</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(backendData, null, 2)}
          </pre>
        </div>
      )}
      
      <button 
        onClick={testConnection}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          background: '#FFD700',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Test Again
      </button>
    </div>
  );
};

export default ConnectionTest;