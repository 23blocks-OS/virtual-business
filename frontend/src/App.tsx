import { useEffect } from 'react';
import VirtualOffice from './components/VirtualOffice';
import ChatBoard from './components/ChatBoard';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const initializeSocket = useStore((state) => state.initializeSocket);

  useEffect(() => {
    initializeSocket();
  }, [initializeSocket]);

  return (
    <div className="app">
      <div className="header">
        <h1>Virtual AI Office</h1>
        <p>Click on any agent to start a conversation</p>
      </div>
      <VirtualOffice />
      <ChatBoard />
    </div>
  );
}

export default App;
