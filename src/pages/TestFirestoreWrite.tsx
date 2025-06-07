import React, { useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const TestFirestoreWrite: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log('No user signed in, skipping manual Firestore write.');
      return;
    }
    const userId = user.uid;
    setDoc(doc(db, 'users', userId), {
      email: user.email || 'test@example.com',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }).catch((error) => {
      console.error('Manual user doc write failed:', error);
    });
  }, [user]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Test Firestore Write</h2>
      <p>
        This page will attempt to write a test user document to Firestore when loaded. Check the
        console for results.
      </p>
      <p>User: {user ? user.email : 'No user signed in'}</p>
    </div>
  );
};

export default TestFirestoreWrite;
