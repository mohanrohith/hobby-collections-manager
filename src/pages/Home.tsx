import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>
        Welcome to Hobby Collections Manager
      </h1>
      <p style={{ fontSize: 18, color: '#475569', marginTop: 16 }}>
        Use the navigation above to test authentication, emulator setup, and more.
      </p>
    </div>
  );
};

export { Home };
