import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Code, 
  PenLine, 
  GraduationCap, 
  Heart, 
  Lightbulb,
  Mic,
  ChevronDown,
  Plus,
  Menu,
  X,
  RotateCcw,
  Copy,
  Check,
  Trash2
} from 'lucide-react';
import MessageContent from './MessageContent';
import '../styles/ChatInterface.css';
import '../styles/Enhancements.css';

const ChatInterface = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Sonnet 4.6');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const models = ['Sonnet 4.6', 'Sonnet 4.0', 'Opus 3.5', 'Haiku 3.0'];

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('astragpt_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('astragpt_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const quickActions = [
    { icon: <Code size={18} />, label: 'Code', color: '#3b82f6' },
    { icon: <PenLine size={18} />, label: 'Write', color: '#8b5cf6' },
    { icon: <GraduationCap size={18} />, label: 'Learn', color: '#10b981' },
    { icon: <Heart size={18} />, label: 'Life stuff', color: '#ef4444' },
    { icon: <Lightbulb size={18} />, label: "AstraGPT's choice", color: '#f59e0b' }
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom || messages[messages.length - 1]?.role === 'user') {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const copyMessage = (content, messageId) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const regenerateResponse = async (messageIndex) => {
    const messagesToKeep = messages.slice(0, messageIndex);
    setMessages(messagesToKeep);
    
    const lastUserMessage = messagesToKeep.reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      setTimeout(() => handleSend(), 100);
    }
  };

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      setMessages([]);
      localStorage.removeItem('astragpt_chat_history');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://925d-34-148-203-218.ngrok-free.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversation_history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: ''
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsStreaming(true);

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsStreaming(false);
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "⚠️ **Connection Error**\n\nSorry, I encountered an error while processing your request. This could be due to:\n- Network connectivity issues\n- API endpoint unavailability\n- Server timeout\n\nPlease check your connection and try again."
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    setInput(`Help me with ${action.label.toLowerCase()}`);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-container">
      {/* Streaming Progress Bar */}
      {isStreaming && (
        <div className="streaming-progress">
          <div className="streaming-progress-bar"></div>
        </div>
      )}
      
      {/* Sidebar Toggle */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Sparkles size={24} className="logo-icon" />
            <span className="logo-text">AstraGPT</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <button className="new-chat-btn" onClick={clearChat}>
          <Plus size={18} />
          <span>New chat</span>
        </button>

        {messages.length > 0 && (
          <button className="clear-chat-btn" onClick={clearChat}>
            <Trash2 size={16} />
            <span>Clear chat</span>
          </button>
        )}

        <div className="chat-history">
          <div className="history-section">
            <h3>Today</h3>
            <div className="history-item active">
              <span>Getting started with AstraGPT</span>
            </div>
          </div>
          
          <div className="history-section">
            <h3>Yesterday</h3>
            <div className="history-item">
              <span>React component help</span>
            </div>
            <div className="history-item">
              <span>CSS styling tips</span>
            </div>
          </div>

          <div className="history-section">
            <h3>Previous 7 Days</h3>
            <div className="history-item">
              <span>JavaScript debugging</span>
            </div>
            <div className="history-item">
              <span>Python web scraping</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        <header className="chat-header">
          <div className="header-left">
            <button className="plan-badge">Free plan</button>
            <button className="upgrade-btn">Upgrade</button>
          </div>
          
          <div className="model-selector" onClick={() => setShowModelMenu(!showModelMenu)}>
            <span>{selectedModel}</span>
            <ChevronDown size={16} />
            
            {showModelMenu && (
              <div className="model-menu">
                {models.map(model => (
                  <div 
                    key={model}
                    className={`model-option ${selectedModel === model ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModel(model);
                      setShowModelMenu(false);
                    }}
                  >
                    {model}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <Sparkles size={48} />
              </div>
              <h1 className="welcome-title">Hey there, {userName}</h1>
              <p className="welcome-subtitle">How can I help you today?</p>
              <p className="welcome-info">💾 Your chats are automatically saved</p>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`message ${message.role}`}
                  onMouseEnter={() => setHoveredMessageId(message.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  <div className="message-avatar">
                    {message.role === 'user' ? (
                      <div className="user-avatar-small">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <Sparkles size={20} />
                    )}
                  </div>
                  <div className="message-body">
                    <MessageContent content={message.content} role={message.role} />
                    
                    {hoveredMessageId === message.id && (
                      <div className="message-actions">
                        <button
                          className="action-btn"
                          onClick={() => copyMessage(message.content, message.id)}
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        
                        {message.role === 'assistant' && (
                          <button
                            className="action-btn"
                            onClick={() => regenerateResponse(index)}
                            title="Regenerate response"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                        
                        <button
                          className="action-btn delete"
                          onClick={() => deleteMessage(message.id)}
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <Sparkles size={20} />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div className="input-section">
          {messages.length === 0 && (
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action)}
                  style={{ '--action-color': action.color }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="message-input"
              placeholder="How can I help you today?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            
            <div className="input-actions">
              <button className="voice-btn" title="Use voice mode">
                <Mic size={18} />
              </button>
              
              <button 
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {(isLoading || isStreaming) && (
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>{isLoading ? 'Thinking...' : 'Streaming response...'}</span>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
