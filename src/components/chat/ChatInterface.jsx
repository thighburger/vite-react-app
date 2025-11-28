import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { fetchChatResponse, sendChatMessage, getChatHistory } from '../../services/api';

const ChatInterface = ({ city, onBack, characterSettings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const setInitialGreeting = () => {
        const greeting = `안녕하세요! 저는 ${city.name}의 여행 메이트 ${characterSettings?.name || 'AI'}입니다. 무엇을 도와드릴까요?`;
        setMessages([{
            id: 'greeting',
            sender: 'bot',
            text: greeting
        }]);
    };

    useEffect(() => {
        const loadHistory = async () => {
            if (characterSettings?.chatBotId) {
                try {
                    const history = await getChatHistory(characterSettings.chatBotId);
                    console.log("Chat history:", history);

                    if (Array.isArray(history) && history.length > 0) {
                        const formattedMessages = history.map((msg, index) => ({
                            id: msg.id || index,
                            sender: msg.speaker === 'MEMBER' ? 'user' : 'bot',
                            text: msg.content
                        }));
                        setMessages(formattedMessages);
                    } else {
                        setInitialGreeting();
                    }
                } catch (error) {
                    console.error("Failed to load chat history:", error);
                    setInitialGreeting();
                }
            }
        };

        loadHistory();
    }, [characterSettings, city.name]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            let replyText;
            if (characterSettings?.chatBotId) {
                // Use the new chatbot API
                const response = await sendChatMessage(characterSettings.chatBotId, input);
                console.log("Bot Response:", response);

                // Robustly extract text from various possible response formats
                if (typeof response === 'string') {
                    replyText = response;
                } else if (typeof response === 'object') {
                    replyText = response.response || response.text || response.message || response.reply || JSON.stringify(response);
                } else {
                    replyText = String(response);
                }
            } else {
                // Fallback to old mock API
                replyText = await fetchChatResponse(city.name, input);
            }

            const botMsg = { id: Date.now() + 1, sender: 'bot', text: replyText };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = { id: Date.now() + 1, sender: 'bot', text: "죄송합니다. 잠시 후 다시 시도해주세요." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            background: 'var(--background)',
            position: 'relative'
        }}>
            {/* Header */}
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--surface)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <button onClick={onBack} style={{
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {characterSettings?.name || `${city.name} 여행 메이트`}
                    </h2>
                </div>
            </header>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem 8rem 1rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="slide-in-up"
                            style={{
                                display: 'flex',
                                gap: '0.8rem',
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: msg.sender === 'user' ? 'var(--secondary)' : 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                {msg.sender === 'user' ? (
                                    <User size={18} color="white" />
                                ) : characterSettings?.image ? (
                                    <img src={characterSettings.image} alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Bot size={18} color="white" />
                                )}
                            </div>
                            <div style={{
                                background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'var(--surface)',
                                padding: '0.8rem 1.2rem',
                                borderRadius: '20px',
                                borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
                                borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                                lineHeight: '1.5',
                                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                                fontSize: '0.95rem',
                                border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.5)' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="slide-in-up" style={{ display: 'flex', gap: '0.8rem', maxWidth: '85%' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={18} color="white" />
                            </div>
                            <div style={{
                                background: 'var(--surface)',
                                padding: '0.8rem 1.2rem',
                                borderRadius: '20px',
                                borderTopLeftRadius: '4px',
                                color: 'var(--text-secondary)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(255,255,255,0.5)'
                            }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <span style={{ animation: 'pulse 1s infinite' }}>•</span>
                                    <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>•</span>
                                    <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>•</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Input Area */}
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '1.5rem',
                background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
                zIndex: 20
            }}>
                <form onSubmit={handleSend} style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative',
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'var(--surface)',
                    padding: '0.5rem',
                    borderRadius: '50px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(12px)'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="여행에 대해 무엇이든 물어보세요..."
                        style={{
                            flex: 1,
                            padding: '0.8rem 1.5rem',
                            borderRadius: '30px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        style={{
                            background: 'var(--gradient-primary)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            opacity: input.trim() ? 1 : 0.5,
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                            border: 'none',
                            cursor: input.trim() ? 'pointer' : 'default'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
