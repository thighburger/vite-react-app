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

    useEffect(() => {
        const loadHistory = async () => {
            if (characterSettings?.chatBotId) {
                try {
                    const history = await getChatHistory(characterSettings.chatBotId);
                    console.log("Chat history:", history);

                    // Assuming history is an array of objects like { sender: 'user'|'bot', text: '...' }
                    // Adjust mapping based on actual API response
                    if (Array.isArray(history)) {
                        const formattedMessages = history.map((msg, index) => ({
                            id: msg.id || index, // Use ID from server or index
                            sender: msg.sender || (msg.isUser ? 'user' : 'bot'), // Adjust based on API
                            text: msg.text || msg.message
                        }));
                        setMessages(formattedMessages);
                    } else {
                        // If no history or not an array, set initial greeting
                        setInitialGreeting();
                    }
                } catch (error) {
                    console.error("Failed to load chat history:", error);
                    setInitialGreeting();
                }
            } else {
                setInitialGreeting();
            }
        };

        const setInitialGreeting = () => {
            setMessages([
                {
                    id: 1,
                    sender: 'bot',
                    text: characterSettings?.personality
                        ? `(설정된 페르소나: ${characterSettings.personality})\n안녕하세요! ${characterSettings.name || `${city.name} 여행 메이트`}입니다. 무엇을 도와드릴까요?`
                        : `안녕하세요! ${city.name} 여행 메이트입니다. 무엇을 도와드릴까요?`
                }
            ]);
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
            if (characterSettings?.chatBotId) {
                // Use the new chatbot API
                const response = await sendChatMessage(characterSettings.chatBotId, input);
                // Assuming response is the text string based on previous assumption, 
                // or if it's an object, we extract the text. 
                // The api.js function returns response.data, so let's handle it.
                replyText = typeof response === 'string' ? response : (response.text || JSON.stringify(response));
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
        <div className="container fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
            {/* Header */}
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--surface)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <button onClick={onBack} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {characterSettings?.name || `${city.name} 여행 메이트`}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                        {characterSettings?.appearance ? '커스텀 캐릭터 적용됨' : '● 온라인'}
                    </span>
                </div>
                {characterSettings?.appearance && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        (외모: {characterSettings.appearance})
                    </div>
                )}
            </header>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: msg.sender === 'user' ? 'var(--secondary)' : 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden'
                            }}>
                                {msg.sender === 'user' ? (
                                    <User size={20} color="white" />
                                ) : characterSettings?.image ? (
                                    <img src={characterSettings.image} alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Bot size={20} color="white" />
                                )}
                            </div>
                            <div style={{
                                background: msg.sender === 'user' ? 'var(--accent)' : 'var(--surface)',
                                padding: '1rem 1.5rem',
                                borderRadius: '20px',
                                borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
                                borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
                                color: 'var(--text-primary)',
                                lineHeight: '1.5',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', gap: '1rem', maxWidth: '80%' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={20} color="white" />
                            </div>
                            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '20px', borderTopLeftRadius: '4px', color: 'var(--text-secondary)' }}>
                                입력 중...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div style={{ padding: '2rem', background: 'var(--background)', borderTop: '1px solid var(--surface)' }}>
                <form onSubmit={handleSend} style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="여행에 대해 무엇이든 물어보세요..."
                        style={{
                            width: '100%',
                            padding: '1.2rem 3.5rem 1.2rem 1.5rem',
                            borderRadius: '30px',
                            border: '1px solid var(--surface)',
                            background: 'var(--surface)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--surface)'}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'var(--accent)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            opacity: input.trim() ? 1 : 0.5,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
