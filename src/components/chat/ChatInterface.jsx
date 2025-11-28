import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Loader2 } from 'lucide-react';
import { fetchChatResponse, sendChatMessage, getChatHistory } from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = ({ city, onBack, characterSettings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const setInitialGreeting = () => {
        const greeting = `${characterSettings?.name || 'AI'} 과의 채팅방입니다`;
        setMessages([{
            id: 'greeting',
            sender: 'bot',
            text: greeting
        }]);
    };

    const [mateImage, setMateImage] = useState(null);

    useEffect(() => {
        const storedImage = localStorage.getItem(`mate_image_${city.name}`);
        if (storedImage) {
            setMateImage(storedImage);
        } else if (characterSettings?.image) {
            setMateImage(characterSettings.image);
        }
    }, [city.name, characterSettings]);

    useEffect(() => {
        const loadHistory = async () => {
            setHistoryLoading(true);
            try {
                if (characterSettings?.chatBotId) {
                    const history = await getChatHistory(characterSettings.chatBotId);

                    if (Array.isArray(history) && history.length > 0) {
                        const formattedMessages = history.map((msg, index) => ({
                            id: msg.id || index,
                            sender: msg.speaker === 'MEMBER' ? 'user' : 'bot',
                            text: msg.content,
                            images: msg.imageUrls || []
                        }));
                        setMessages(formattedMessages);
                    } else {
                        setInitialGreeting();
                    }
                } else {
                    setInitialGreeting();
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
                setInitialGreeting();
            } finally {
                setHistoryLoading(false);
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

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            let replyText;
            let replyImages = [];


            const response = await sendChatMessage(characterSettings.chatBotId, input);
            console.log("Bot Response:", response);

            if (typeof response === 'string') {
                replyText = response;
            } else if (typeof response === 'object') {
                replyText = response.response || response.text || response.message || response.reply || JSON.stringify(response);
                if (response.imageUrls && Array.isArray(response.imageUrls)) {
                    replyImages = response.imageUrls;
                }
            } else {
                replyText = String(response);
            }

            const botMsg = { id: Date.now() + 1, sender: 'bot', text: replyText, images: replyImages };
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
            position: 'relative',
            width: '100%'
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
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 0.5rem 8rem 0.5rem' }}>
                <div style={{
                    width: '100%',    // 수정됨: 너비를 항상 100%로 고정
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    {historyLoading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                            flexDirection: 'column',
                            gap: '1rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <Loader2 className="spin" size={32} />
                            <p>대화 내용을 불러오는 중입니다...</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="slide-in-up"
                                    style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '100%',
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
                                        ) : mateImage ? (
                                            <img src={mateImage} alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Bot size={18} color="white" />
                                        )}
                                    </div>
                                    <div style={{
                                        background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'var(--surface)',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '20px',
                                        borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
                                        borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
                                        color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                                        lineHeight: '1.5',
                                        boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                                        fontSize: '0.95rem',
                                        border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.5)' : 'none',
                                        minWidth: 0
                                    }}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.5rem' }} {...props} />,
                                                ul: ({ node, ...props }) => <ul style={{ margin: 0, paddingLeft: '1.2rem', marginBottom: '0.5rem' }} {...props} />,
                                                ol: ({ node, ...props }) => <ol style={{ margin: 0, paddingLeft: '1.2rem', marginBottom: '0.5rem' }} {...props} />,
                                                li: ({ node, ...props }) => <li style={{ marginBottom: '0.2rem' }} {...props} />,
                                                a: ({ node, ...props }) => <a style={{ color: 'inherit', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" {...props} />,
                                                code: ({ node, inline, className, children, ...props }) => {
                                                    return inline ? (
                                                        <code style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em' }} {...props}>
                                                            {children}
                                                        </code>
                                                    ) : (
                                                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px', margin: '0.5rem 0', overflowX: 'auto' }}>
                                                            <code style={{ fontSize: '0.9em' }} {...props}>
                                                                {children}
                                                            </code>
                                                        </div>
                                                    );
                                                }
                                            }}
                                        >
                                            {msg.text || ''}
                                        </ReactMarkdown>
                                        {msg.images && msg.images.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                overflowX: 'auto',
                                                marginTop: '0.8rem',
                                                paddingBottom: '0.5rem',
                                                maxWidth: '100%',
                                                width: '100%',
                                                scrollBehavior: 'smooth',
                                                WebkitOverflowScrolling: 'touch'
                                            }}>
                                                {msg.images.map((imgUrl, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={imgUrl}
                                                        alt="Recommended place"
                                                        style={{
                                                            height: '140px',
                                                            borderRadius: '12px',
                                                            objectFit: 'cover',
                                                            flexShrink: 0,
                                                            aspectRatio: '4/3',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="slide-in-up" style={{ display: 'flex', gap: '0.8rem', maxWidth: '100%' }}>
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
                        </>
                    )}
                </div>
            </div>

            {/* Floating Input Area */}
            <div className="chat-input-area">
                <form onSubmit={handleSend} className="chat-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="여행에 대해 무엇이든 물어보세요..."
                        className="chat-input"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="chat-send-button"
                        style={{
                            opacity: input.trim() ? 1 : 0.5,
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