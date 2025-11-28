import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'var(--background)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '2rem' }}
            >
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #60a5fa, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Travel Mate
                </h1>
            </motion.div>

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '3px solid var(--accent)',
                    borderTopColor: 'transparent'
                }}
            />

            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                여행을 준비하고 있습니다...
            </p>
        </div>
    );
};

export default LoadingScreen;
