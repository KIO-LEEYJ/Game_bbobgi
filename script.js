function preloadImage(url) {
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "image";
  preload.href = url;
  document.head.appendChild(preload);
}

async function updateBanner(type, imgId, linkId) {
  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbycPlbKIdi871uncqIz2ApYZ9C5GN4DKbUoqQP76cIlshJbwtYWVgfxI1c5akaEW9ajQA/exec?type=${type}`);
    const data = await res.json();

    console.log(`✅ [${type}] banner loaded`);
    console.log(`🖼️ imageUrl: ${data.imageUrl}`);
    console.log(`🔗 linkUrl: ${data.linkUrl}`);

    const img = document.getElementById(imgId);
    const link = document.getElementById(linkId);

    if (!img || !link || !data.imageUrl || !data.linkUrl) {
      console.warn(`⚠️ Invalid banner data for ${type}`);
      return;
    }

    img.style.opacity = 0;
    img.onload = () => (img.style.opacity = 1);
    img.onerror = () => {
      console.warn(`⚠️ [${type}] Image load failed`);
      img.src = "/assets/fallback.jpg";
    };

    img.src = data.imageUrl;
    link.href = data.linkUrl;

    preloadImage(data.imageUrl);

  } catch (err) {
    console.error(`❌ Failed to load banner for ${type}`, err);
  }
}

['A', 'B'].forEach(type => {
  const imgId = `banner-${type.toLowerCase()}-img`;
  const linkId = `banner-${type.toLowerCase()}-link`;
  updateBanner(type, imgId, linkId);
  setInterval(() => updateBanner(type, imgId, linkId), 10000);
});
