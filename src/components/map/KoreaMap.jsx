import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import geoData from '../../assets/data/skorea-provinces-2018-geo.json';
import { cityData, provinceFocus } from '../../data/cities';

import { provinceMapping, groupDisplayNames, provinceColors } from '../../data/provinces';

const KoreaMap = ({ onSelectProvince, selectedProvince, onSelectCity }) => {
    const [tooltipContent, setTooltipContent] = useState('');
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [position, setPosition] = useState({ coordinates: [127.5, 35.8], zoom: 1 });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (selectedProvince && provinceFocus[selectedProvince.id]) {
            const focus = provinceFocus[selectedProvince.id];
            setPosition({ coordinates: focus.center, zoom: focus.zoom });
        } else {
            setPosition({ coordinates: [127.5, 35.8], zoom: 1 });
        }
    }, [selectedProvince]);

    const cities = selectedProvince ? (cityData[selectedProvince.id] || []) : [];

    // Responsive settings
    const isMobile = windowWidth < 768;
    const mapScale = selectedProvince
        ? (isMobile ? 6000 : 7000)
        : (isMobile ? 10000 : 4000);

    const containerStyle = {
        width: '100%',
        flex: 1, // Fill remaining vertical space
        minHeight: 0, // Crucial for flex nested scrolling/sizing
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative'
    };

    return (
        <div className="map-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100dvh', // Use dynamic viewport height for mobile
            flexDirection: 'column',
            width: '100%',
            overflow: 'hidden',
            padding: isMobile ? '0' : '2rem',
            paddingTop: isMobile && selectedProvince ? '80px' : (isMobile ? '2rem' : '2rem') // Clear nav bar
        }}>
            <h1 style={{
                marginBottom: '0.5rem',
                fontSize: isMobile ? '1.5rem' : '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #60a5fa, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                flexShrink: 0 // Prevent title from shrinking
            }}>
                {selectedProvince ? selectedProvince.name : '어디로 떠나볼까요?'}
            </h1>

            <div style={containerStyle}>
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: mapScale,
                        center: [127.5, 35.8]
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        transition: "all 0.5s ease-in-out"
                    }}
                >
                    <ZoomableGroup
                        zoom={position.zoom}
                        center={position.coordinates}
                        disablePanning
                        disableZooming
                        filterZoomEvent={() => false}
                    >
                        <Geographies geography={geoData}>
                            {({ geographies }) => (
                                <>
                                    {geographies.map((geo) => {
                                        const name = geo.properties.name;
                                        const mappedId = provinceMapping[name];
                                        const color = provinceColors[mappedId] || '#334155';
                                        const displayName = groupDisplayNames[mappedId] || name;
                                        const isSelected = selectedProvince && selectedProvince.id === mappedId;
                                        const isOther = selectedProvince && !isSelected;
                                        const isHovered = hoveredRegion === mappedId;

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                    if (!selectedProvince) {
                                                        setTooltipContent(displayName);
                                                        setHoveredRegion(mappedId);
                                                    }
                                                }}
                                                onMouseLeave={() => {
                                                    setTooltipContent('');
                                                    setHoveredRegion(null);
                                                }}
                                                onClick={() => {
                                                    if (!selectedProvince && mappedId) {
                                                        onSelectProvince({ id: mappedId, name: displayName });
                                                    }
                                                }}
                                                style={{
                                                    default: {
                                                        fill: isOther
                                                            ? 'var(--map-dimmed)'
                                                            : (isHovered && !selectedProvince ? "var(--text-primary)" : color),
                                                        outline: "none",
                                                        stroke: (selectedProvince && !isOther) ? color : "transparent",
                                                        strokeWidth: 0.5,
                                                        transition: "fill 500ms, opacity 500ms, filter 500ms",
                                                        opacity: isOther ? 0.3 : 1,
                                                        filter: (isHovered && !selectedProvince) ? "drop-shadow(0 0 10px var(--accent-glow))" : "none"
                                                    },
                                                    hover: {
                                                        fill: isOther
                                                            ? 'var(--map-dimmed)'
                                                            : (selectedProvince ? color : "var(--text-primary)"),
                                                        outline: "none",
                                                        stroke: (selectedProvince && !isOther) ? color : "transparent",
                                                        strokeWidth: 0.5,
                                                        cursor: selectedProvince ? "default" : "pointer",
                                                        filter: selectedProvince ? "none" : "drop-shadow(0 0 10px var(--accent-glow))",
                                                        opacity: isOther ? 0.3 : 1
                                                    },
                                                    pressed: {
                                                        fill: color,
                                                        outline: "none"
                                                    }
                                                }}
                                            />
                                        );
                                    })}

                                    {/* Province Labels (Only show when not zoomed in) */}
                                    {!selectedProvince && geographies.map((geo) => {
                                        const centroid = geoCentroid(geo);
                                        const name = geo.properties.name;
                                        if (!name.endsWith('도')) return null;
                                        let labelName = name;
                                        if (name === '제주특별자치도') labelName = '제주도';

                                        return (
                                            <Marker key={`${geo.rsmKey}-name`} coordinates={centroid}>
                                                <text
                                                    y="2"
                                                    fontSize={28}
                                                    textAnchor="middle"
                                                    fill="var(--text-primary)"
                                                    style={{ pointerEvents: 'none', textShadow: '0 1px 2px var(--background)', fontWeight: 'bold' }}
                                                >
                                                    {labelName}
                                                </text>
                                            </Marker>
                                        );
                                    })}
                                </>
                            )}
                        </Geographies>

                        {/* City Markers (Only show when zoomed in) */}
                        {selectedProvince && cities.map((city) => (
                            <Marker key={city.id} coordinates={city.coordinates} onClick={() => onSelectCity(city)}>
                                <circle r={isMobile ? 3 : 4} fill="#F00" stroke="#fff" strokeWidth={2} style={{ cursor: 'pointer' }} />
                                <text
                                    textAnchor="middle"
                                    y={-10}
                                    style={{ fontFamily: "system-ui", fill: "var(--text-primary)", fontSize: isMobile ? "12px" : "14px", fontWeight: "bold", textShadow: "0 1px 2px var(--background)" }}
                                >
                                    {city.name}
                                </text>
                            </Marker>
                        ))}

                    </ZoomableGroup>
                </ComposableMap>
            </div>

            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', height: '20px', textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                {tooltipContent || (!selectedProvince ? '지도를 클릭하여 여행지를 선택하세요' : '도시를 선택하여 여행을 시작하세요')}
            </p>
        </div>
    );
};

export default KoreaMap;
