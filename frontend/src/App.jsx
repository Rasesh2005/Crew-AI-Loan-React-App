import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WorkflowBuilder from './components/WorkflowBuilder';
import FileUpload from './components/FileUpload';
import LLMOutputPage from './components/ResultsDisplay'
function App() {
  const [step, setStep] = useState(0); // 0: WorkflowBuilder, 1: FileUpload, 2: ResultsDisplay

  return (
    <Router>
      <Routes>
        <Route path="/" element={ step===0?<WorkflowBuilder onNext={() => setStep(1)} />:<Navigate to="/upload" />}/>
        <Route path="/upload" element={step === 1 ? <FileUpload onNext={() => setStep(2)} onPrev={()=>setStep(0)} /> : <Navigate to="/results" />} />
        <Route path="/results" element={step === 2 ? <LLMOutputPage onPrev={()=>setStep(1)}/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;