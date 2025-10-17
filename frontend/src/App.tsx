import { Route, Routes, useNavigate } from 'react-router-dom';

import './Style/App.scss';

import Navbar from './Component/Navbar';
import SlideRecord from './Pages/SlideRecord';
import SpeedSlalomRecord from './Pages/SpeedSlalomRecord';
import AthleteReg from './Pages/AthleteReg';
import SSResultRecored from './Pages/SSResultRecored';
import ClassicSlalomRecord from './Pages/ClassicSlalomRecord';
import Guideline from './Pages/Guideline';
import LoginForm from './Pages/LoginForm';
import { useState } from 'react';

//import './Style/temp.scss';

const host = 'localhost:3001'

function App() {
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleLogin = async (phone: string, birthMonth: string) => {
    try {
      const response = await fetch(`http://${host}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, birthMonth })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'login failed');
      }

      // proceess login success
      console.log('Login success:', data.user);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error occurred');
    }
  };
  return (
    <div className='Home'>
      <div className='Nav'>
        <Navbar />
      </div>
      <main>
        <div className='Container'>
          <p>Inline freestyle</p>
          <Routes>
            <Route path='/Pages/SSResultRecored' element={<SSResultRecored />} />
            <Route path="/Pages/SlideRecord" element={<SlideRecord />} />
            <Route path="/Pages/SpeedSlalomRecord" element={<SpeedSlalomRecord />} />
            <Route path="/Pages/ClassicSlalomRecord" element={<ClassicSlalomRecord />} />
            <Route path="/Pages/AthleteReg" element={<AthleteReg />} />
            <Route path="/Pages/Guideline" element={<Guideline />} />
            <Route path="/Pages/Login" element={<LoginForm onLogin={handleLogin} error={error} />} />
          </Routes>
        </div>
      </main>

    </div>
  );
};

export default App;