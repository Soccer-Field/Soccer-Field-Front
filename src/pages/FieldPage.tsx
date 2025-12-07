import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Search } from 'lucide-react';
import { FieldSidebar } from '../components/FieldSidebar';
import type { ReviewFormData } from '../components/ReviewModal';
import type { FieldData, ReviewData } from '../types/index';
import 'leaflet/dist/leaflet.css';
import './FieldPage.css';
import L from 'leaflet';

// 커스텀 마커 아이콘
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

const initialMockFields: FieldData[] = [
  {
    id: '1',
    name: '을숙도인조잔디축구장',
    address: '부산광역시 사하구 하단동 낙동남로1233번길 59',
    lat: 35.0915,
    lng: 128.9636,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    grassType: { code: 'AG', name: '인조잔디' },
    shoeType: { code: 'TF', name: '풋살용' },
    grassCondition: { hard: 34, short: 34, slippery: 34, bumpy: 34 },
    rating: {
      average: 4.0,
      distribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 },
    },
  },
  {
    id: '2',
    name: '서울월드컵경기장 보조구장',
    address: '서울특별시 마포구 성산동',
    lat: 37.5665,
    lng: 126.897,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=600&fit=crop',
    grassType: { code: 'NG', name: '천연잔디' },
    shoeType: { code: 'FG', name: '천연잔디용' },
    grassCondition: { hard: 20, short: 30, slippery: 25, bumpy: 25 },
    rating: {
      average: 4.5,
      distribution: { 5: 5, 4: 3, 3: 1, 2: 0, 1: 0 },
    },
  },
];

const initialMockReviews: ReviewData[] = [
  {
    id: '1',
    fieldId: '1',
    author: '박지훈',
    grassType: 'AG',
    rating: 4,
    grassConditions: ['잔디 김', '관리 양호', '부드러움', '배수 양호'],
    recommendedShoe: 'AG',
    shoeLink: 'https://www.adidas.co.kr/predator-accuracy.3-ag',
    content: '잔디 길이가 적당하고 관리가 잘 되어 있습니다. AG 축구화가 딱 맞아요. 접지력도 좋고 부상 위험도 적습니다.',
    createdAt: '2024-01-20T10:30:00Z',
  },
];

export const FieldPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [fields, setFields] = useState<FieldData[]>(initialMockFields);
  const [reviews, setReviews] = useState<ReviewData[]>(initialMockReviews);
  const mapRef = useRef<L.Map | null>(null);

  const filteredFields = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return [];

    return fields.filter(
      (field) =>
        field.name.toLowerCase().includes(keyword) ||
        field.address.toLowerCase().includes(keyword)
    );
  }, [searchKeyword, fields]);

  const handleFieldSelect = (field: FieldData) => {
    setSelectedField(field);
    setSearchKeyword(field.name);
    setShowResults(false);
  };

  const handleMarkerClick = (field: FieldData) => {
    setSelectedField(field);
  };

  const handleCloseSidebar = () => {
    setSelectedField(null);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (filteredFields[0]) {
      handleFieldSelect(filteredFields[0]);
    } else {
      setShowResults(false);
    }
  };

  const handleReviewSubmit = (fieldId: string, reviewData: ReviewFormData) => {
    // 새 리뷰 생성
    const newReview: ReviewData = {
      id: Date.now().toString(),
      fieldId,
      author: '사용자',
      grassType: reviewData.grassType,
      rating: reviewData.rating,
      grassConditions: reviewData.grassConditions,
      recommendedShoe: reviewData.recommendedShoe,
      shoeLink: reviewData.shoeLink,
      content: reviewData.content,
      createdAt: new Date().toISOString(),
    };

    // 리뷰 추가
    setReviews([...reviews, newReview]);

    // 해당 필드의 평점 업데이트
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          const newDistribution = { ...field.rating.distribution };
          newDistribution[reviewData.rating as keyof typeof newDistribution]++;

          const totalReviews = Object.values(newDistribution).reduce((a, b) => a + b, 0);
          const totalRating = Object.entries(newDistribution).reduce(
            (sum, [rating, count]) => sum + parseInt(rating) * count,
            0
          );
          const newAverage = totalRating / totalReviews;

          const updatedField = {
            ...field,
            rating: {
              average: Math.round(newAverage * 10) / 10,
              distribution: newDistribution,
            },
          };

          // selectedField도 업데이트
          if (selectedField?.id === fieldId) {
            setSelectedField(updatedField);
          }

          return updatedField;
        }
        return field;
      })
    );

    alert('리뷰가 성공적으로 등록되었습니다!');
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
          center={[fields[0].lat, fields[0].lng]}
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
          {fields.map((field) => (
            <Marker
              key={field.id}
              position={[field.lat, field.lng]}
              icon={selectedField?.id === field.id ? selectedIcon : customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(field),
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

      {/* 사이드바 */}
      {selectedField && (
        <FieldSidebar
          field={selectedField}
          reviews={reviews.filter((r) => r.fieldId === selectedField.id)}
          onClose={handleCloseSidebar}
          onReviewSubmit={(reviewData) => handleReviewSubmit(selectedField.id, reviewData)}
        />
      )}
    </div>
  );
};
