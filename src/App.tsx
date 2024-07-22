import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
function App() {
  let navigate = useNavigate();
  return (
    <div className="App">
      <button onClick={()=>navigate('/2048')}>开始游戏</button>
    </div>
  );
}

export default App;
