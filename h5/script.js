const pages = [...document.querySelectorAll(".h5-page")];
const pageDots = [...document.querySelectorAll(".page-dots button")];
const progress = document.querySelector(".page-progress span");
const toast = document.querySelector(".h5-toast");
const toastText = toast.querySelector("span");
const archiveStage = document.querySelector(".archive-stage");
const archiveImage = document.querySelector("[data-archive-image]");
const archiveName = document.querySelector("[data-archive-name]");
const archiveEnglish = document.querySelector("[data-archive-en]");
const archiveFamily = document.querySelector("[data-archive-family]");
const archiveMood = document.querySelector("[data-archive-mood]");
const archiveEdition = document.querySelector("[data-archive-edition]");
const tabs = [...document.querySelectorAll(".scent-tabs button")];
const isCaptureMode = new URLSearchParams(window.location.search).has("capture");
let activePage = 0;
let toastTimer;

if (isCaptureMode) {
  document.body.classList.add("capture-mode");
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min((index % 5) * 55, 220)}ms`;
  revealObserver.observe(item);
});

const pageObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;
    activePage = pages.indexOf(visible[0].target);
    pageDots.forEach((dot, index) => dot.classList.toggle("is-active", index === activePage));
    document.body.dataset.theme = visible[0].target.dataset.theme;
  },
  { threshold: [0.24, 0.5, 0.72] }
);

pages.forEach((page) => pageObserver.observe(page));

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const value = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${value}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

pageDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.go);
    pages[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-jump]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const index = Number(link.dataset.jump);
    pages[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const scentData = {
  orange: {
    image: "assets/cologne-orange.png",
    alt: "苦橙古龙水",
    name: "苦橙古龙水",
    english: "ORANGE BITTERS COLOGNE",
    family: "柑橘木质调",
    mood: "温暖明亮",
    edition: "YELLOW TARTAN · NO. 01"
  },
  tangerine: {
    image: "assets/cologne-tangerine.png",
    alt: "柑橘与蜂蜜古龙水",
    name: "柑橘与蜂蜜古龙水",
    english: "TANGERINE & HONEY COLOGNE",
    family: "柑橘蜂蜜调",
    mood: "轻盈甜美",
    edition: "YELLOW TARTAN · NO. 02"
  },
  vanilla: {
    image: "assets/cologne-vanilla.png",
    alt: "香草苏格兰古龙水",
    name: "香草苏格兰古龙水",
    english: "VANILLA SCOTCH COLOGNE",
    family: "香草木质调",
    mood: "温暖深沉",
    edition: "NAVY TARTAN · NO. 03"
  }
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.scent;
    const data = scentData[key];
    if (!data) return;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    archiveStage.classList.add("is-changing");
    setTimeout(() => {
      archiveStage.dataset.theme = key;
      archiveImage.src = data.image;
      archiveImage.alt = data.alt;
      archiveName.textContent = data.name;
      archiveEnglish.textContent = data.english;
      archiveFamily.textContent = data.family;
      archiveMood.textContent = data.mood;
      archiveEdition.textContent = data.edition;
      archiveStage.classList.remove("is-changing");
    }, 180);
  });
});

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

document.querySelector("[data-add-product]").addEventListener("click", () => {
  showToast(`${archiveName.textContent}已加入心愿清单`);
});

document.querySelectorAll("[data-add-gift]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("格纹奇遇限定礼盒已加入心愿清单");
  });
});

toast.querySelector("button").addEventListener("click", () => {
  toast.classList.remove("is-visible");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  const direction = event.key === "ArrowDown" ? 1 : -1;
  const next = Math.min(pages.length - 1, Math.max(0, activePage + direction));
  pages[next].scrollIntoView({ behavior: "smooth", block: "start" });
});
