import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { useSpring } from 'framer-motion';
import geoData from '../../assets/data/skorea-provinces-2018-geo.json';
import { cityData, provinceFocus } from '../../data/cities';

import { provinceMapping, groupDisplayNames, provinceColors } from '../../data/provinces';

const KoreaMap = ({ onSelectProvince, selectedProvince, onSelectCity }) => {
    const [tooltipContent, setTooltipContent] = useState('');
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [position, setPosition] = useState({ coordinates: [127.5, 35.8], zoom: 1 });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Animation springs
    const springConfig = { stiffness: 150, damping: 20, mass: 1 };
    const zoomMotion = useSpring(1, springConfig);
    const xMotion = useSpring(127.5, springConfig);
    const yMotion = useSpring(35.8, springConfig);

    const [animatedPosition, setAnimatedPosition] = useState({
        coordinates: [127.5, 35.8],
        zoom: 1
    });

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

    // Sync springs with target position
    useEffect(() => {
        zoomMotion.set(position.zoom);
        xMotion.set(position.coordinates[0]);
        yMotion.set(position.coordinates[1]);
    }, [position, zoomMotion, xMotion, yMotion]);

    // Update state on spring change to trigger re-render
    useEffect(() => {
        const unsubscribeZoom = zoomMotion.on("change", (latest) => {
            setAnimatedPosition(prev => ({ ...prev, zoom: latest }));
        });
        const unsubscribeX = xMotion.on("change", (latest) => {
            setAnimatedPosition(prev => ({ ...prev, coordinates: [latest, prev.coordinates[1]] }));
        });
        const unsubscribeY = yMotion.on("change", (latest) => {
            setAnimatedPosition(prev => ({ ...prev, coordinates: [prev.coordinates[0], latest] }));
        });

        return () => {
            unsubscribeZoom();
            unsubscribeX();
            unsubscribeY();
        };
    }, [zoomMotion, xMotion, yMotion]);

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
                background: 'var(--gradient-text)',
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
                        zoom={animatedPosition.zoom}
                        center={animatedPosition.coordinates}
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
        </div>
    );
};

export default KoreaMap;
