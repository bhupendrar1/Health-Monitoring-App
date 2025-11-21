import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MetricInput from './components/MetricInput';
import GoalSetting from './components/GoalSetting';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthData, setHealthData] = useState(() => {
    const saved = localStorage.getItem('healthData');
    return saved ? JSON.parse(saved) : {
      steps: 0,
      calories: 0,
      sleep: 0,
      water: 0,
      weight: 0,
      history: []
    };
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('healthGoals');
    return saved ? JSON.parse(saved) : {
      steps: 10000,
      calories: 2000,
      sleep: 8,
      water: 8,
      weight: 70
    };
  });

 
  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(healthData));
  }, [healthData]);

  useEffect(() => {
    localStorage.setItem('healthGoals', JSON.stringify(goals));
  }, [goals]);

  const updateMetric = (metric, value) => {
    const today = new Date().toDateString();
    setHealthData(prev => {
      const newData = { ...prev, [metric]: value };
      
      
      const lastEntry = prev.history[prev.history.length - 1];
      if (!lastEntry || lastEntry.date !== today) {
        newData.history = [...prev.history, {
          date: today,
          steps: metric === 'steps' ? value : prev.steps,
          calories: metric === 'calories' ? value : prev.calories,
          sleep: metric === 'sleep' ? value : prev.sleep,
          water: metric === 'water' ? value : prev.water,
          weight: metric === 'weight' ? value : prev.weight
        }].slice(-7); 
      } else {
       
        newData.history = prev.history.map((entry, index) => 
          index === prev.history.length - 1 
            ? { ...entry, [metric]: value }
            : entry
        );
      }
      
      return newData;
    });
  };

  const updateGoal = (metric, value) => {
    setGoals(prev => ({ ...prev, [metric]: value }));
  };

  const resetData = (confirmReset = false) => {
    if (!confirmReset) return false;
    
    localStorage.removeItem('healthData');
    localStorage.removeItem('healthGoals');
   
    setHealthData({ steps: 0, calories: 0, sleep: 0, water: 0, weight: 0, history: [] });
    setGoals({ steps: 10000, calories: 2000, sleep: 8, water: 8, weight: 70 });
    return true;
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard healthData={healthData} goals={goals} />;
      case 'input':
        return <MetricInput healthData={healthData} updateMetric={updateMetric} />;
      case 'goals':
        return <GoalSetting goals={goals} updateGoal={updateGoal} resetData={resetData} />;
      default:
        return <Dashboard healthData={healthData} goals={goals} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <div className="container">
          <div className="header">
            <div className="header-content">
              <div className="header-text">
                <h1>🏥 Health Monitor</h1>
                <p>Track your daily health metrics and achieve your wellness goals</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <nav className="nav-tabs">
            <button 
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-button ${activeTab === 'input' ? 'active' : ''}`}
              onClick={() => setActiveTab('input')}
            >
              📝 Update Metrics
            </button>
            <button 
              className={`nav-button ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              🎯 Set Goals
            </button>
          </nav>

          {renderActiveTab()}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;