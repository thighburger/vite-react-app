import React from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Map, List, ArrowLeft } from 'lucide-react';
import KoreaMap from './components/map/KoreaMap';
import ProvinceView from './components/map/ProvinceView';
import CharacterSetup from './components/chat/CharacterSetup';
import ChatInterface from './components/chat/ChatInterface';
import CityDetail from './components/city/CityDetail';
import { groupDisplayNames } from './data/provinces';
import { cityData } from './data/cities';

// Navigation Component
const Navigation = ({ provinceId, view }) => {
  const navigate = useNavigate();

  if (!provinceId) return null;

  return (
    <nav style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(10px)',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      display: 'flex',
      gap: '1rem',
      zIndex: 100,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '25px',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.target.style.color = 'white'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={18} />
        전국 지도
      </button>

      <div style={{ width: '1px', background: 'var(--text-secondary)', opacity: 0.3, margin: '0 0.5rem' }}></div>

      <button
        onClick={() => navigate(`/map/${provinceId}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '25px',
          background: view === 'map' ? 'var(--accent)' : 'transparent',
          color: view === 'map' ? 'white' : 'var(--text-secondary)',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
      >
        <Map size={18} />
        지도 보기
      </button>
      <button
        onClick={() => navigate(`/list/${provinceId}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '25px',
          background: view === 'list' ? 'var(--accent)' : 'transparent',
          color: view === 'list' ? 'white' : 'var(--text-secondary)',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
      >
        <List size={18} />
        목록 보기
      </button>
    </nav>
  );
};

const MapPage = () => {
  const { provinceId } = useParams();
  const navigate = useNavigate();
  const selectedProvince = provinceId ? { id: provinceId, name: groupDisplayNames[provinceId] } : null;

  const handleCitySelect = (city) => {
    if (city.id === 'suncheon') {
      navigate(`/city/${city.id}`);
    } else {
      navigate(`/setup/${city.id}`);
    }
  };

  return (
    <>
      <Navigation provinceId={provinceId} view="map" />
      <KoreaMap
        selectedProvince={selectedProvince}
        onSelectProvince={(p) => navigate(`/map/${p.id}`)}
        onSelectCity={handleCitySelect}
      />
    </>
  );
};

const ListPage = () => {
  const { provinceId } = useParams();
  const navigate = useNavigate();
  const selectedProvince = provinceId ? { id: provinceId, name: groupDisplayNames[provinceId] } : null;

  if (!selectedProvince) return <Navigate to="/" />;

  const handleCitySelect = (city) => {
    if (city.id === 'suncheon') {
      navigate(`/city/${city.id}`);
    } else {
      navigate(`/setup/${city.id}`);
    }
  };

  return (
    <>
      <Navigation provinceId={provinceId} view="list" />
      <ProvinceView
        province={selectedProvince}
        onBack={() => navigate(`/map/${provinceId}`)}
        onSelectCity={handleCitySelect}
      />
    </>
  );
};

const CityPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();

  // Find city object
  let city = null;
  let provinceId = null;
  for (const prov in cityData) {
    const found = cityData[prov].find(c => c.id === cityId);
    if (found) {
      city = found;
      provinceId = prov;
      break;
    }
  }

  if (!city) return <Navigate to="/" />;

  return (
    <CityDetail
      city={city}
      onStartSetup={() => navigate(`/setup/${cityId}`)}
      onBack={() => navigate(`/map/${provinceId}`)}
    />
  );
};

const SetupPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();

  // Find city object
  let city = null;
  for (const prov in cityData) {
    const found = cityData[prov].find(c => c.id === cityId);
    if (found) {
      city = found;
      break;
    }
  }

  if (!city) return <Navigate to="/" />;

  return (
    <CharacterSetup
      city={city}
      onStartChat={(settings) => navigate(`/chat/${cityId}`, { state: { settings } })}
      onBack={() => navigate(-1)}
    />
  );
};

const ChatPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Find city object
  let city = null;
  let provinceId = null;
  for (const prov in cityData) {
    const found = cityData[prov].find(c => c.id === cityId);
    if (found) {
      city = found;
      provinceId = prov;
      break;
    }
  }

  if (!city) return <Navigate to="/" />;
  if (!state?.settings) return <Navigate to={`/setup/${cityId}`} />;

  return (
    <ChatInterface
      city={city}
      characterSettings={state.settings}
      onBack={() => navigate(`/map/${provinceId}`)}
    />
  );
};

import LoadingScreen from './components/common/LoadingScreen';
import Login from './components/auth/Login';

import { Sun, Moon } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (userData) => {
    console.log("Logged in:", userData);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const location = useLocation();

  return (
    <>
      {isAuthenticated && location.pathname === '/' && (
        <button
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'var(--surface)',
            border: '1px solid var(--secondary)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/map/:provinceId" element={<MapPage />} />
          <Route path="/list/:provinceId" element={<ListPage />} />
          <Route path="/city/:cityId" element={<CityPage />} />
          <Route path="/setup/:cityId" element={<SetupPage />} />
          <Route path="/chat/:cityId" element={<ChatPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
