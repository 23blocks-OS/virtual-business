import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import './ChatBoard.css';

export default function ChatBoard() {
  const activeAgentId = useStore((state) => state.activeAgentId);
  const agents = useStore((state) => state.agents);
  const messages = useStore((state) => state.messages);
  const isTyping = useStore((state) => state.isTyping);
  const sendMessage = useStore((state) => state.sendMessage);
  const setActiveAgent = useStore((state) => state.setActiveAgent);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeAgent = agents.find((a) => a.id === activeAgentId);
  const chatMessages = activeAgentId ? messages[activeAgentId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (input.trim() && activeAgentId) {
      sendMessage(activeAgentId, input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeAgent) return null;

  return (
    <div className="chat-board">
      <div className="chat-header" style={{ borderLeftColor: activeAgent.color }}>
        <div className="agent-info">
          <div className="agent-avatar" style={{ backgroundColor: activeAgent.color }}>
            {activeAgent.name[0]}
          </div>
          <div>
            <h3>{activeAgent.name}</h3>
            <p>{activeAgent.role}</p>
          </div>
        </div>
        <button className="close-btn" onClick={() => setActiveAgent(null)}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {chatMessages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation with {activeAgent.name}</p>
            <span>{activeAgent.description}</span>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="message agent">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${activeAgent.name}...`}
          rows={3}
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
