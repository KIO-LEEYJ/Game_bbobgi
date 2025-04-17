const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyDlUQglRol3VpSjKJQQu45L3zgI7_RxQeWAPojE4AXSRebJMD_weC53elq8Aem3EndsQ/exec';

async function updateBanner(type) {
  const imgId = `banner-${type.toLowerCase()}-img`;
  const linkId = `banner-${type.toLowerCase()}-link`;
  const spinnerId = `${imgId}-spinner`;

  try {
    const response = await fetch(`${WEB_APP_URL}?type=${type}`);
    const data = await response.json();

    if (!data.imageUrl || !data.linkUrl) {
      console.warn(`⚠️ [${type}] 배너 정보 없음`, data);
      return;
    }

    const img = document.getElementById(imgId);
    const link = document.getElementById(linkId);
    const spinner = document.getElementById(spinnerId);

    if (!img || !link || !spinner) {
      console.warn(`⚠️ [${type}] DOM 요소 누락`);
      return;
    }

    spinner.classList.remove('hidden');

    preloadImage(data.imageUrl, (loadedSrc) => {
      if (loadedSrc) {
        img.style.opacity = 0;
        img.src = loadedSrc;
        img.onload = () => {
          setTimeout(() => {
            img.style.opacity = 1;
            spinner.classList.add('hidden');
          }, 100);
        };
        link.href = data.linkUrl;
        link.target = '_blank';
      } else {
        img.src = '/assets/fallback.jpg';
        spinner.classList.add('hidden');
      }
    });

  } catch (error) {
    console.error(`❌ [${type}] 배너 불러오기 실패`, error);
  }
}

function preloadImage(url, onLoad) {
  const img = new Image();
  img.onload = () => onLoad(url);
  img.onerror = () => {
    console.warn(`❌ 이미지 로드 실패: ${url}`);
    onLoad(null);
  };
  img.src = url;
}

['A', 'B'].forEach(type => {
  updateBanner(type);
  setInterval(() => updateBanner(type), 10000);
});
