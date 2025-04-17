const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzBvzmhuqTQEPDNeIeEe3okMfAH3s9-LHaAXTOyko4MZE1SK2gVCO37kV3l7G3wCP-irw/exec';

async function updateBanner(type) {
  const imgId = `banner-${type.toLowerCase()}-img`;
  const linkId = `banner-${type.toLowerCase()}-link`;

  try {
    const response = await fetch(`${WEB_APP_URL}?type=${type}`);
    const data = await response.json();
    if (!data.imageUrl || !data.linkUrl) {
      console.warn(`⚠️ [${type}] API 응답에 필요한 값이 없음`, data);
      return;
    }

    console.log(`✅ [${type}] 배너 로드 완료`);
    console.log(`🖼️ 이미지 URL: ${data.imageUrl}`);
    console.log(`🔗 링크 URL: ${data.linkUrl}`);

    const img = document.getElementById(imgId);
    const link = document.getElementById(linkId);

    if (!img || !link) {
      console.warn(`⚠️ [${type}] DOM 요소를 찾을 수 없음`, { imgId, linkId });
      return;
    }

    preloadImage(data.imageUrl, (loadedSrc) => {
      document.querySelector(`#${imgId}-spinner`)?.classList.remove('hidden');
      if (loadedSrc) {
        img.style.opacity = 0;
        img.src = loadedSrc;
        img.onload = () => {
          setTimeout(() => {
            img.style.opacity = 1;
            document.querySelector(`#${imgId}-spinner`)?.classList.add('hidden');
          }, 50);
        };
        link.href = data.linkUrl;
      } else {
        img.src = '/assets/fallback.jpg';
        document.querySelector(`#${imgId}-spinner`)?.classList.add('hidden');
      }
    });

  } catch (error) {
    console.error(`❌ [${type}] 배너 로드 실패`, error);
  }
}

function preloadImage(url, onLoad) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => onLoad(url);
  img.onerror = () => {
    console.warn(`❌ 이미지 사전 로딩 실패: ${url}`);
    onLoad(null);
  };
  img.src = url;
}

['A', 'B'].forEach(type => {
  updateBanner(type);
  setInterval(() => updateBanner(type), 10000);
});
