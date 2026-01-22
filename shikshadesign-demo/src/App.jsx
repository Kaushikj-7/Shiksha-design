import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Basics from './pages/Basics';
import ProblemOutcome from './pages/ProblemOutcome';
import Stakeholders from './pages/Stakeholders';
import Activities from './pages/Activities';
import Framework from './pages/Framework';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Global Navigation Header */}
        <Navigation />
        
        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/basics" element={<Basics />} />
            <Route path="/problem-outcome" element={<ProblemOutcome />} />
            <Route path="/stakeholders" element={<Stakeholders />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-gray-800 text-gray-300 py-4 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm">
            <p>ShikshaDesign © 2026 • Building Better NGO Programs through Logical Framework Analysis • v2.1 (Active)</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
