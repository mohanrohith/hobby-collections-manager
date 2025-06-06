import React, { useState } from 'react';
import { auth, db, storage } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const EmulatorTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    auth: boolean;
    firestore: boolean;
    storage: boolean;
  }>({
    auth: false,
    firestore: false,
    storage: false,
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  // Test Authentication
  const testAuth = async () => {
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'test123456';

      // Test sign up
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      addLog('✅ Auth: User created successfully');

      // Test sign in
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      addLog('✅ Auth: User signed in successfully');

      setTestResults((prev) => ({ ...prev, auth: true }));
    } catch (error) {
      addLog(`❌ Auth Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Test Firestore
  const testFirestore = async () => {
    try {
      const testCollection = collection(db, 'test-collection');
      const testDoc = {
        message: 'Hello from emulator!',
        timestamp: new Date().toISOString(),
      };

      // Test write
      await addDoc(testCollection, testDoc);
      addLog('✅ Firestore: Document written successfully');

      // Test read
      const querySnapshot = await getDocs(testCollection);
      const docs = querySnapshot.docs.map((doc) => doc.data());
      addLog(`✅ Firestore: Read ${docs.length} documents`);

      setTestResults((prev) => ({ ...prev, firestore: true }));
    } catch (error) {
      addLog(`❌ Firestore Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Test Storage
  const testStorage = async () => {
    try {
      const testFile = new Blob(['Hello from emulator!'], { type: 'text/plain' });
      const storageRef = ref(storage, `test-files/test-${Date.now()}.txt`);

      // Test upload
      await uploadBytes(storageRef, testFile);
      addLog('✅ Storage: File uploaded successfully');

      // Test download URL
      const downloadURL = await getDownloadURL(storageRef);
      addLog(`✅ Storage: File URL generated: ${downloadURL}`);

      setTestResults((prev) => ({ ...prev, storage: true }));
    } catch (error) {
      addLog(`❌ Storage Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLogs([]);
    setTestResults({ auth: false, firestore: false, storage: false });

    addLog('Starting emulator tests...');
    await testAuth();
    await testFirestore();
    await testStorage();
    addLog('All tests completed!');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Emulator Tests</h1>
      <div className="mb-4">
        <button
          onClick={runAllTests}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run All Tests
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Test Results</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded ${testResults.auth ? 'bg-green-100' : 'bg-gray-100'}`}>
            Auth: {testResults.auth ? '✅' : '❌'}
          </div>
          <div className={`p-4 rounded ${testResults.firestore ? 'bg-green-100' : 'bg-gray-100'}`}>
            Firestore: {testResults.firestore ? '✅' : '❌'}
          </div>
          <div className={`p-4 rounded ${testResults.storage ? 'bg-green-100' : 'bg-gray-100'}`}>
            Storage: {testResults.storage ? '✅' : '❌'}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="font-mono text-sm mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
