import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Smile, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { signup, login } from '../../services/api';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // Login logic
            if (username && password) {
                setIsLoading(true);
                try {
                    const userData = { username, password };
                    const response = await login(userData);
                    console.log('Login success:', response);
                    onLogin({ username, name: username });
                } catch (error) {
                    console.error('Login error:', error);
                    alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                alert('아이디와 비밀번호를 입력해주세요.');
            }
        } else {
            // Signup logic
            if (!username || !password || !passwordConfirm) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            if (password !== passwordConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            setIsLoading(true);
            try {
                const userData = {
                    username,
                    password,
                    passwordConfirm
                };
                const response = await signup(userData);
                console.log('Signup success:', response);
                // Auto login after signup
                onLogin({ username, name: username });
            } catch (error) {
                console.error('Signup error:', error);
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                {!isLogin && (
                    <button
                        onClick={() => setIsLogin(true)}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            left: '2rem',
                            background: 'transparent',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(to right, #60a5fa, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Travel Mate
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? '다시 오신 것을 환영합니다!' : '새로운 여행을 시작해보세요'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ position: 'relative' }}>
                        <User size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder={"닉네임"}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'var(--background)',
                                border: '1px solid var(--secondary)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'var(--background)',
                                border: '1px solid var(--secondary)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <CheckCircle size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    background: 'var(--background)',
                                    border: '1px solid var(--secondary)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            transition: 'opacity 0.2s',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setUsername('');
                            setPassword('');
                            setPasswordConfirm('');
                        }}
                        style={{
                            background: 'transparent',
                            color: 'var(--accent)',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? '회원가입하기' : '로그인하기'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
