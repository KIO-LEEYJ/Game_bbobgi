let boardData = []

function getFirebaseImageUrl(filename) {
  const encoded = encodeURIComponent(`banner/${filename}`);
  const tokenMap = {
    'Banner_A-01.jpg': '12e10a44-8950-4ef5-a374-6d20e31af843',
    'wony.gif': '토큰값을-여기에-입력',
  };
  const token = tokenMap[filename] || '';
  return `https://firebasestorage.googleapis.com/v0/b/kiolab-banner.appspot.com/o/${encoded}?alt=media&token=${token}`;
}

async function updateBanner(type, imgId, linkId) {
  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbycPlbKIdi871uncqIz2ApYZ9C5GN4DKbUoqQP76cIlshJbwtYWVgfxI1c5akaEW9ajQA/exec?type=${type}`);
    const data = await res.json();
    console.log(`✅ ${type} 배너 로드 성공`);
    console.log(`🖼️ imageUrl: ${data.imageUrl}`);
    console.log(`🔗 linkUrl: ${data.linkUrl}`);

    const img = document.getElementById(imgId);
    const link = document.getElementById(linkId);

    if (img && link && data.imageUrl && data.linkUrl) {
      const filename = data.imageUrl.split('/').pop().split('?')[0].split('%2F').pop();
      const finalUrl = getFirebaseImageUrl(filename);

      img.style.opacity = 0;
      img.onload = () => (img.style.opacity = 1);
      img.onerror = () => {
        console.warn(`⚠️ ${type} 이미지 로드 실패. 기본 fallback 이미지 사용.`);
        img.src = "/assets/fallback.jpg";
      };
      img.src = finalUrl;
      link.href = data.linkUrl;

      const preloadId = `preload-${type}`;
      let preload = document.getElementById(preloadId);
      if (!preload) {
        preload = document.createElement("link");
        preload.id = preloadId;
        preload.rel = "preload";
        preload.as = "image";
        document.head.appendChild(preload);
      }
      preload.href = finalUrl;
    } else {
      console.warn(`⚠️ ${type} 배너 정보가 유효하지 않습니다.`);
    }
  } catch (e) {
    console.error(`❌ ${type} 배너 불러오기 실패`, e);
  }
}

['A', 'B'].forEach(type => {
  updateBanner(type, `banner-${type.toLowerCase()}-img`, `banner-${type.toLowerCase()}-link`);
  setInterval(() => updateBanner(type, `banner-${type.toLowerCase()}-img`, `banner-${type.toLowerCase()}-link`), 10000);
});
