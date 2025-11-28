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

        </div>
    );
};

export default LoadingScreen;
