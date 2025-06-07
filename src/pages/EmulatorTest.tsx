import React, { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const statusColor = (status: string) => {
  switch (status) {
    case 'Working':
      return '#22c55e'; // green
    case 'Testing...':
      return '#eab308'; // yellow
    case 'Error':
      return '#ef4444'; // red
    case 'No data found':
    case 'No URL returned':
      return '#f59e42'; // orange
    default:
      return '#64748b'; // gray
  }
};

export const EmulatorTest: React.FC = () => {
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Not tested');
  const [authStatus, setAuthStatus] = useState<string>('Not tested');
  const [storageStatus, setStorageStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: 24,
    margin: '16px 0',
    maxWidth: 400,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const statusStyle = (status: string): React.CSSProperties => ({
    color: '#fff',
    background: statusColor(status),
    borderRadius: 8,
    padding: '2px 12px',
    fontWeight: 600,
    fontSize: 14,
    marginLeft: 8,
    minWidth: 80,
    textAlign: 'center',
    display: 'inline-block',
  });

  const buttonStyle: React.CSSProperties = {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 18px',
    fontWeight: 600,
    fontSize: 15,
    marginTop: 12,
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    fontSize: 15,
    width: '100%',
    wordBreak: 'break-word',
  };

  const detailedErrorStyle: React.CSSProperties = {
    color: '#991b1b',
    background: '#fef2f2',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    fontSize: 13,
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'monospace',
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
    color: '#1e293b',
    letterSpacing: '-1px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 18,
    color: '#475569',
    marginBottom: 32,
    fontWeight: 400,
  };

  const testFirestore = async () => {
    setFirestoreStatus('Testing...');
    setError(null);
    setDetailedError(null);
    try {
      const testCollection = collection(db, 'test');
      await addDoc(testCollection, { test: 'data', timestamp: Date.now() });
      const snapshot = await getDocs(testCollection);
      if (!snapshot.empty) {
        setFirestoreStatus('Working');
      } else {
        setFirestoreStatus('No data found');
      }
    } catch (err) {
      setFirestoreStatus('Error');
      const message = err instanceof Error ? err.message : String(err);
      setError('Firestore: ' + message);
      setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err)));
      console.error('Firestore test error:', err);
    }
  };

  const testAuth = async () => {
    setAuthStatus('Testing...');
    setError(null);
    setDetailedError(null);
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
      setAuthStatus('Working');
      await signOut(auth);
    } catch (err) {
      setAuthStatus('Error');
      const message = err instanceof Error ? err.message : String(err);
      setError('Auth: ' + message);
      setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err)));
      console.error('Auth test error:', err);
    }
  };

  const testStorage = async () => {
    setStorageStatus('Testing...');
    setError(null);
    setDetailedError(null);
    const auth = getAuth();
    if (!auth.currentUser) {
      setStorageStatus('Error');
      setError('User not authenticated');
      return;
    }
    try {
      const testRef = ref(storage, 'test/test.txt');
      const blob = new Blob(['test data'], { type: 'text/plain' });
      await uploadBytes(testRef, blob);
      const url = await getDownloadURL(testRef);
      if (url) {
        setStorageStatus('Working');
      } else {
        setStorageStatus('No URL returned');
      }
    } catch (err) {
      setStorageStatus('Error');
      const message = err instanceof Error ? err.message : String(err);
      setError('Storage: ' + message);
      setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err)));
      console.error('Storage test error:', err);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Firebase Emulator Test</div>
      <div style={subtitleStyle}>
        Test your local Firebase emulator setup for Firestore, Auth, and Storage.
      </div>
      <div
        style={{
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 900,
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
            Firestore
          </h2>
          <div>
            Status:
            <span style={statusStyle(firestoreStatus)}>{firestoreStatus}</span>
          </div>
          <button
            style={buttonStyle}
            onClick={testFirestore}
            disabled={firestoreStatus === 'Testing...'}
          >
            Test Firestore
          </button>
        </div>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Auth</h2>
          <div>
            Status:
            <span style={statusStyle(authStatus)}>{authStatus}</span>
          </div>
          <button style={buttonStyle} onClick={testAuth} disabled={authStatus === 'Testing...'}>
            Test Auth
          </button>
        </div>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
            Storage
          </h2>
          <div>
            Status:
            <span style={statusStyle(storageStatus)}>{storageStatus}</span>
          </div>
          <button
            style={buttonStyle}
            onClick={testStorage}
            disabled={storageStatus === 'Testing...'}
          >
            Test Storage
          </button>
        </div>
      </div>
      {error && <div style={errorStyle}>Error: {error}</div>}
      {detailedError && <pre style={detailedErrorStyle}>{detailedError}</pre>}
    </div>
  );
};
