import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles, User, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { generateCharacterImage } from '../../services/api';

const CharacterSetup = ({ city, onStartChat, onBack }) => {
    const [name, setName] = useState('');
    const [personality, setPersonality] = useState('');
    const [appearance, setAppearance] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const imageUrl = await generateCharacterImage({ name, personality, appearance });
            setGeneratedImage(imageUrl);
            setIsGenerated(true);

            // Save to localStorage
            localStorage.setItem('character_image', imageUrl);
            localStorage.setItem('character_info', JSON.stringify({ name, personality, appearance }));
        } catch (error) {
            console.error("Failed to generate character:", error);
            alert("메이트 생성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStartChatting = () => {
        onStartChat({ name, personality, appearance, image: generatedImage });
    };

    if (isGenerating) {
        return (
            <div className="container fade-in" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem'
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 size={64} color="var(--accent)" />
                </motion.div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>메이트 생성중...</h2>
                <p style={{ color: 'var(--text-secondary)' }}>잠시만 기다려주세요. 당신만의 여행 메이트가 오고 있어요!</p>
            </div>
        );
    }

    if (isGenerated) {
        return (
            <div className="container fade-in" style={{
                paddingTop: '2rem',
                maxWidth: '600px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#34d399' }}>
                        메이트 생성완료!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        이제 {name || '여행 메이트'}와 함께 여행을 떠나보세요.
                    </p>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    style={{
                        width: '300px',
                        height: '300px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        marginBottom: '3rem',
                        boxShadow: '0 0 30px rgba(96, 165, 250, 0.3)',
                        border: '4px solid var(--accent)'
                    }}
                >
                    <img
                        src={generatedImage}
                        alt="Generated Character"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </motion.div>

                <button
                    onClick={handleStartChatting}
                    style={{
                        background: 'linear-gradient(to right, var(--accent), #c084fc)',
                        color: 'white',
                        padding: '1.2rem 3rem',
                        borderRadius: '50px',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={24} />
                    메이트와 채팅하기
                </button>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{
            paddingTop: '2rem',
            maxWidth: '600px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <button
                onClick={onBack}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    alignSelf: 'flex-start'
                }}
            >
                <ArrowLeft size={20} />
                뒤로가기
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {city.name} 여행 메이트 설정
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    나만의 특별한 여행 메이트를 만들어보세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Name Section */}
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '4px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                            <User size={20} color="var(--accent)" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>메이트 이름</h3>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 순천이, 여행박사..."
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            background: 'var(--background)',
                            border: '1px solid var(--secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Personality Section */}
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                            <MessageSquare size={20} color="var(--accent)" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>메이트 성격</h3>
                    </div>
                    <textarea
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        placeholder="예: 친절하고 활기찬 말투, 역사적인 지식이 풍부함, 사투리를 사용함..."
                        style={{
                            width: '100%',
                            height: '80px',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            background: 'var(--background)',
                            border: '1px solid var(--secondary)',
                            color: 'var(--text-primary)',
                            resize: 'none',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Appearance Section */}
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '10px' }}>
                            <Sparkles size={20} color="#c084fc" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>메이트 외모</h3>
                    </div>
                    <textarea
                        value={appearance}
                        onChange={(e) => setAppearance(e.target.value)}
                        placeholder="예: 한복을 입은 20대 여성, 밝은 미소, 단발머리..."
                        style={{
                            width: '100%',
                            height: '80px',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            background: 'var(--background)',
                            border: '1px solid var(--secondary)',
                            color: 'var(--text-primary)',
                            resize: 'none',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        background: 'linear-gradient(to right, var(--accent), #c084fc)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginTop: '0.5rem',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    메이트 생성하기
                </button>

            </form>
        </div>
    );
};

export default CharacterSetup;
