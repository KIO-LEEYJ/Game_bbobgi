document.addEventListener('DOMContentLoaded', () => {
  const metaUrl = "https://kio-leeyj.github.io/manage_banner/meta.json";
  const GAS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzwErPG9dn3DgppQLQlzm-P4OM5uVb2m3p6S5cFA4Ig3pC32zClkLmCOTGRGdsQMyrn/exec";
  const A_PATH = "https://kio-leeyj.github.io/manage_banner/A/";
  const B_PATH = "https://kio-leeyj.github.io/manage_banner/B/";

  const bannerAImg = document.getElementById("bannerA");
  const bannerALink = document.getElementById("linkA");
  const bannerBImg = document.getElementById("bannerB");
  const bannerBLink = document.getElementById("linkB");

  let cycleA = [], cycleB = [];
  let indexA = 0, indexB = 0;

  fetch(metaUrl)
    .then(res => res.json())
    .then(data => {
      const today = new Date().toISOString().split("T")[0];
      const isValid = b =>
        b.active &&
        b.start <= today &&
        b.end >= today;

      const bannersA = data.filter(b => b.folder === "A" && isValid(b));
      const bannersB = data.filter(b => b.folder === "B" && isValid(b));

      function buildCycle(banners) {
        const result = [];
        banners.forEach(b => {
          for (let i = 0; i < b.priority; i++) result.push(b);
        });
        return shuffle(result);
      }

      function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      cycleA = buildCycle(bannersA);
      cycleB = buildCycle(bannersB);

      updateBanner('A');
      updateBanner('B');

      setInterval(() => updateBanner('A'), 10000);
      setInterval(() => updateBanner('B'), 10000);

      bannerALink.addEventListener("click", () => {
        const banner = cycleA[(indexA - 1 + cycleA.length) % cycleA.length];
        fetch(GAS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: banner.file,
            folder: "A",
            linkURL: banner.linkURL,
            page: "Game_bbobgi",
            type: "click",
            user_agent: navigator.userAgent
          })
        });
      });

      bannerBLink.addEventListener("click", () => {
        const banner = cycleB[(indexB - 1 + cycleB.length) % cycleB.length];
        fetch(GAS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: banner.file,
            folder: "B",
            linkURL: banner.linkURL,
            page: "Game_bbobgi",
            type: "click",
            user_agent: navigator.userAgent
          })
        });
      });
    });

  function updateBanner(side) {
    if (side === 'A') {
      if (!cycleA.length) return;
      const banner = cycleA[indexA];
      bannerAImg.src = A_PATH + banner.file;
      bannerALink.href = banner.linkURL;
      fetch(GAS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: banner.file,
          folder: side,
          page: "Game_bbobgi",
          type: "view",
          user_agent: navigator.userAgent
        })
      });
      indexA = (indexA + 1) % cycleA.length;
    } else {
      if (!cycleB.length) return;
      const banner = cycleB[indexB];
      bannerBImg.src = B_PATH + banner.file;
      bannerBLink.href = banner.linkURL;
      fetch(GAS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: banner.file,
          folder: side,
          page: "Game_bbobgi",
          type: "view",
          user_agent: navigator.userAgent
        })
      });
      indexB = (indexB + 1) % cycleB.length;
    }
  }
});
