import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './FieldPage.css';
import L from 'leaflet';

// 커스텀 마커 아이콘 생성 (검은색)
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="58" height="76" viewBox="0 0 58 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 0C13.0132 0 0 13.0132 0 29C0 50.75 29 75.2236 29 75.2236C29 75.2236 58 50.75 58 29C58 13.0132 44.9868 0 29 0ZM29 39.3421C23.2868 39.3421 18.6579 34.7132 18.6579 29C18.6579 23.2868 23.2868 18.6579 29 18.6579C34.7132 18.6579 39.3421 23.2868 39.3421 29C39.3421 34.7132 34.7132 39.3421 29 39.3421Z" fill="black"/>
    </svg>
  `),
  iconSize: [40, 53],
  iconAnchor: [20, 53],
});

const selectedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="58" height="76" viewBox="0 0 58 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 0C13.0132 0 0 13.0132 0 29C0 50.75 29 75.2236 29 75.2236C29 75.2236 58 50.75 58 29C58 13.0132 44.9868 0 29 0ZM29 39.3421C23.2868 39.3421 18.6579 34.7132 18.6579 29C18.6579 23.2868 23.2868 18.6579 29 18.6579C34.7132 18.6579 39.3421 23.2868 39.3421 29C39.3421 34.7132 34.7132 39.3421 29 39.3421Z" fill="#3be878"/>
    </svg>
  `),
  iconSize: [44, 58],
  iconAnchor: [22, 58],
});

const mockFields = [
  {
    id: '1',
    name: '을숙도인조잔디축구장',
    address: '부산광역시 사하구 하단동 낙동남로1233번길 59',
    lat: 35.0915,
    lng: 128.9636,
  },
  {
    id: '2',
    name: '서울월드컵경기장 보조구장',
    address: '서울특별시 마포구 성산동',
    lat: 37.5665,
    lng: 126.897,
  },
];

export const FieldPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedField, setSelectedField] = useState<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  } | null>(mockFields[0]);
  const [showResults, setShowResults] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const filteredFields = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return [];

    return mockFields.filter(
      (field) =>
        field.name.toLowerCase().includes(keyword) ||
        field.address.toLowerCase().includes(keyword)
    );
  }, [searchKeyword]);

  const handleFieldSelect = (field: (typeof mockFields)[number]) => {
    setSelectedField(field);
    setSearchKeyword(field.name);
    setShowResults(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (filteredFields[0]) {
      handleFieldSelect(filteredFields[0]);
    } else {
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (!selectedField || !mapRef.current) return;
    mapRef.current.flyTo([selectedField.lat, selectedField.lng], 14, {
      duration: 1.2,
    });
  }, [selectedField]);

  return (
    <div className="field-page">
      {/* 검색창 */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="축구장 이름 또는 주소 검색..."
            value={searchKeyword}
            onFocus={() => setShowResults(true)}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setShowResults(true);
            }}
            className="search-input"
          />
        </form>
        {filteredFields.length > 0 && showResults && (
          <ul className="search-results">
            {filteredFields.map((field) => (
              <li
                key={field.id}
                className="search-result-item"
                onClick={() => handleFieldSelect(field)}
              >
                <span className="search-result-name">{field.name}</span>
                <span className="search-result-address">{field.address}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 축구장 추가 버튼 */}
      <button className="add-field-btn">축구장 추가</button>

      {/* 지도 */}
      <div
        style={{
          position: 'absolute',
          top: '81px',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'calc(100vh - 81px)',
        }}
      >
        <MapContainer
          center={[mockFields[0].lat, mockFields[0].lng]}
          zoom={7}
          style={{ width: '100%', height: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockFields.map((field) => (
            <Marker
              key={field.id}
              position={[field.lat, field.lng]}
              icon={selectedField?.id === field.id ? selectedIcon : customIcon}
              eventHandlers={{
                click: () => setSelectedField(field),
              }}
            >
              {selectedField?.id === field.id && (
                <Tooltip
                  direction="right"
                  offset={[14, 0]}
                  opacity={1}
                  permanent
                  className="field-name-tooltip"
                >
                  {field.name}
                </Tooltip>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
