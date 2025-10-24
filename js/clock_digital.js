(() => {
  const zeroPad = n => n.toString().padStart(2, "0");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  const formatDate = d =>
    `${d.getFullYear()}年 ${zeroPad(d.getMonth() + 1)}月 ${zeroPad(d.getDate())}日 ${weekdays[d.getDay()]}曜日`;

  const formatTime = d =>
    `${zeroPad(d.getHours())}時 ${zeroPad(d.getMinutes())}分 ${zeroPad(d.getSeconds())}秒`;

  window.addEventListener("DOMContentLoaded", () => {
    const dateEl = document.getElementById("date");
    const clockEl = document.getElementById("clock");
    let lastDate = null;

    setInterval(() => {
      const now = new Date();
      if (lastDate !== now.getDate()) {
        lastDate = now.getDate();
        dateEl.innerText = formatDate(now);
      }
      clockEl.innerText = formatTime(now);
    }, 1000);
  });
})();