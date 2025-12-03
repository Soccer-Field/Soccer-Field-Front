import './HomePage.css';

export const HomePage = () => {

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">⚽</span>
            필드파인더
          </h1>
          <p className="hero-description">
            축구장 잔디 상태를 미리 확인하고,
            <br />
            최적의 축구화를 선택하세요
          </p>
          <button className="hero-cta">
            축구장 찾아보기
          </button>
        </div>

        <div className="hero-image">
          <div className="field-preview">
            <div className="field-lines" />
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="features-title">왜 필드파인더인가요?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3 className="feature-title">실시간 잔디 정보</h3>
            <p className="feature-description">
              커뮤니티가 함께 만드는 실시간 축구장 잔디 상태 정보를 확인하세요
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👟</div>
            <h3 className="feature-title">축구화 추천</h3>
            <p className="feature-description">
              잔디 타입에 맞는 최적의 축구화를 실제 경험을 바탕으로 추천받으세요
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">리뷰 공유</h3>
            <p className="feature-description">
              직접 경험한 축구장의 잔디 상태와 플레이 경험을 공유하세요
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">부상 예방</h3>
            <p className="feature-description">
              잘못된 축구화 선택으로 인한 부상을 미리 예방하세요
            </p>
          </div>
        </div>
      </div>

      <div className="grass-types-section">
        <h2 className="section-title">잔디 타입 알아보기</h2>
        <div className="grass-types-grid">
          <div className="grass-type-card">
            <div className="grass-badge">AG</div>
            <h3>인조잔디용</h3>
            <p>인조잔디 구장에 최적화된 스터드 디자인</p>
          </div>

          <div className="grass-type-card">
            <div className="grass-badge">FG</div>
            <h3>천연잔디용</h3>
            <p>천연 잔디에서 최고의 접지력 제공</p>
          </div>

          <div className="grass-type-card">
            <div className="grass-badge">MG</div>
            <h3>맨땅용</h3>
            <p>단단한 맨땅이나 딱딱한 인조잔디용</p>
          </div>

          <div className="grass-type-card">
            <div className="grass-badge">TF</div>
            <h3>풋살용</h3>
            <p>실내 또는 짧은 인조잔디 풋살장용</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">지금 바로 시작하세요</h2>
          <p className="cta-description">
            가까운 축구장의 잔디 상태를 확인하고, 최적의 축구화를 선택하세요
          </p>
          <button className="cta-button">
            축구장 찾아보기
          </button>
        </div>
      </div>
    </div>
  );
};
