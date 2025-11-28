import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';

import { cityData } from '../../data/cities';


const ProvinceView = ({ province, onBack, onSelectCity }) => {
    const cities = cityData[province.id] || cityData.default;

    return (
        <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>

            <header style={{ marginBottom: '3rem', marginTop: '4rem' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{province.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>어느 도시로 떠나볼까요?</p>
            </header>

            <div className="province-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {cities.map((city, index) => (
                    <motion.div
                        key={city.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        onClick={() => onSelectCity(city)}
                        style={{
                            background: 'var(--surface)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                            <img
                                src={city.image}
                                alt={city.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {city.name}
                                <MapPin size={16} color="var(--accent)" />
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{city.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProvinceView;
