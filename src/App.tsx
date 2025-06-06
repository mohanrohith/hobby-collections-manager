import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { EmulatorTest } from './components/EmulatorTest';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/emulator-test">Emulator Test</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/emulator-test" element={<EmulatorTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
