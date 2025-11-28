import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkChatBotExistence } from '../../services/api';

const CityDetail = ({ city, onBack, onStartSetup }) => {
    const navigate = useNavigate();
    const [existingBotId, setExistingBotId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkBot = async () => {
            setIsLoading(true);
            try {
                const botData = await checkChatBotExistence(city.id);
                if (botData && botData.chatBotId) {
                    setExistingBotId(botData.chatBotId);
                }
            } catch (error) {
                console.error("Error checking bot:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkBot();
    }, [city.id]);

    const handleContinue = () => {
        navigate(`/chat/${city.id}`, { state: { settings: { chatBotId: existingBotId } } });
    };

    return (
        <div className="container fade-in" style={{
            paddingTop: '2rem',
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
                    marginBottom: '2rem',
                    fontSize: '1rem',
                    alignSelf: 'flex-start'
                }}
            >
                <ArrowLeft size={20} />
                뒤로가기
            </button>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '2rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    {city.image ? (
                        <img
                            src={city.image}
                            alt={city.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'var(--surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            이미지가 없습니다
                        </div>
                    )}
                </motion.div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        {city.name}
                        <MapPin size={40} color="var(--accent)" />
                    </h1>
                    <p style={{
                        fontSize: '1.5rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        {city.desc}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isLoading ? null : (existingBotId ? handleContinue : onStartSetup)}
                    disabled={isLoading}
                    style={{
                        background: existingBotId
                            ? 'linear-gradient(to right, #34d399, #3b82f6)'
                            : 'linear-gradient(to right, var(--accent), #c084fc)',
                        color: 'white',
                        padding: '1.5rem 3rem',
                        borderRadius: '50px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: existingBotId
                            ? '0 10px 15px -3px rgba(52, 211, 153, 0.3)'
                            : '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="spin" size={24} />
                            확인 중...
                        </>
                    ) : existingBotId ? (
                        <>
                            <MessageCircle size={24} />
                            대화 이어하기
                        </>
                    ) : (
                        <>
                            <Sparkles size={24} />
                            여행 메이트 생성하기
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default CityDetail;
