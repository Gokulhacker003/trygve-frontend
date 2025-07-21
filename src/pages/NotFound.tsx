import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <button onClick={() => navigate('/home')} style={styles.button}>Go Home</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center' as 'center',
    padding: '40px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};
