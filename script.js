// ✅ Firebase 기반 배너 시스템 – 클린 버전

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwhJIUTq587n_vVzKp7H8KiEi6E69KNTGSbo32sPJ1xTaNx5i2Vw-yzLM76uLvBqaxAfw/exec';

function preloadImage(url, onLoad) {
  const img = new Image();
  img.onload = () => onLoad(img.src);
  img.onerror = () => {
    console.warn(`❌ 이미지 사전 로딩 실패: ${url}`);
    onLoad(null);
  };
  img.crossOrigin = 'anonymous';
  img.src = url;
}

async function updateBanner(type) {
  const imgId = `banner-${type.toLowerCase()}-img`;
  const linkId = `banner-${type.toLowerCase()}-link`;

  try {
    const response = await fetch(`${WEB_APP_URL}?type=${type}`);
    const data = await response.json();

    console.log(`✅ [${type}] 배너 로드 완료`);
    console.log(`🖼️ 이미지 URL: ${data.imageUrl}`);
    console.log(`🔗 링크 URL: ${data.linkUrl}`);

    const img = document.getElementById(imgId);
    const link = document.getElementById(linkId);

    if (!img || !link || !data.imageUrl || !data.linkUrl) {
      console.warn(`⚠️ [${type}] 유효하지 않은 데이터`);
      return;
    }

    // 이미지 미리 로딩 후 적용
    preloadImage(data.imageUrl, (loadedSrc) => {
      if (loadedSrc) {
        img.style.opacity = 0;
        img.onload = () => (img.style.opacity = 1);
        img.src = loadedSrc;
        link.href = data.linkUrl;
      } else {
        img.src = '/assets/fallback.jpg';
      }
    });

  } catch (error) {
    console.error(`❌ [${type}] 배너 로드 실패`, error);
  }
}

// A/B 배너 동시 업데이트 및 주기적 새로고침
['A', 'B'].forEach(type => {
  updateBanner(type);
  setInterval(() => updateBanner(type), 10000);
});
