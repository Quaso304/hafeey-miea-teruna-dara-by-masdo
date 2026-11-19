
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const ending = document.getElementById("ending");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const replayBtn = document.getElementById("replayBtn");

const stage = document.getElementById("stage");
const sceneLabel = document.getElementById("sceneLabel");
const speaker = document.getElementById("speaker");
const dialogue = document.getElementById("dialogue");
const chapterCount = document.getElementById("chapterCount");
const chapterDots = document.querySelectorAll(".chapter-dot");

const sceneProp = document.getElementById("sceneProp");
const floatingHeart = document.getElementById("floatingHeart");

const song = document.getElementById("song");
const playBtn = document.getElementById("playBtn");
const musicBtn = document.getElementById("musicBtn");
const seekBar = document.getElementById("seekBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const audioStatus = document.getElementById("audioStatus");

const lyricSection = document.getElementById("lyricSection");
const lyricText = document.getElementById("lyricText");
const lyricNext = document.getElementById("lyricNext");

let currentScene = 0;


// =====================================
// HAFEEY & MIEA STORY
// =====================================

const scenes = [
  {
    label: "CHAPTER 01 · THE CHEMISTRY ASSIGNMENT",
    speaker: "NARRATOR",
    dialogue:
      "Everything started with a Chemistry group assignment. Hafeey and Miea were placed in the same group. Just an ordinary assignment... or maybe the beginning of something special?",
    prop: "⚗",
    heart: "♡"
  },
  {
    label: "CHAPTER 02 · THE FIRST APPROACH",
    speaker: "NARRATOR",
    dialogue:
      "Miea started finding little ways to get closer to Hafeey. But Hafeey? He decided to play hard to get. Miea did not give up that easily!",
    prop: "♡",
    heart: "♥"
  },
  {
    label: "CHAPTER 03 · DAILY CONVERSATIONS",
    speaker: "NARRATOR",
    dialogue:
      "Day by day, their conversations became longer. It was no longer just about Chemistry assignments. They started sharing stories, jokes and little moments from their days.",
    prop: "✉",
    heart: "♥"
  },
  {
    label: "CHAPTER 04 · THE CONFESSION",
    speaker: "MIEA",
    dialogue:
      "One day, Miea finally gathered the courage to express her feelings. This time, it was not about Chemistry, homework or assignments. It was about someone special.",
    prop: "💌",
    heart: "♥"
  },
  {
    label: "CHAPTER 05 · THE ANSWER",
    speaker: "HAFEEY",
    dialogue:
      "Hafeey finally accepted Miea's feelings. The boy who once played hard to get had finally opened his heart. And just like that, a new chapter began.",
    prop: "♡",
    heart: "♥"
  },
  {
    label: "CHAPTER 06 · STILL FALLING FOR YOU",
    speaker: "NARRATOR",
    dialogue:
      "And here they are, still writing their story together. Hafeey is still caught in Miea's love... and perhaps still a little confused about how someone can be this lovable. Hihihi. ♡",
    prop: "✦",
    heart: "♥"
  }
];


// =====================================
// SHOW STORY SCENE
// =====================================

function displayScene(index) {
  const scene = scenes[index];

  currentScene = index;

  stage.className = "stage scene-" + index;

  sceneLabel.textContent = scene.label;
  speaker.textContent = scene.speaker;
  dialogue.textContent = scene.dialogue;

  chapterCount.textContent =
    String(index + 1).padStart(2, "0") +
    " / " +
    String(scenes.length).padStart(2, "0");

  sceneProp.textContent = scene.prop;
  floatingHeart.textContent = scene.heart;

  chapterDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  prevBtn.disabled = index === 0;

  nextBtn.textContent =
    index === scenes.length - 1
      ? "FINISH STORY ♡"
      : "NEXT SCENE →";
}


// =====================================
// SCREEN NAVIGATION
// =====================================

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(item => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

startBtn.addEventListener("click", () => {
  showScreen(main);
  displayScene(0);

  song.play().catch(() => {
    audioStatus.textContent =
      "Press the play button to start the soundtrack ♡";
  });
});

nextBtn.addEventListener("click", () => {
  if (currentScene < scenes.length - 1) {
    displayScene(currentScene + 1);
  } else {
    showScreen(ending);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentScene > 0) {
    displayScene(currentScene - 1);
  }
});

replayBtn.addEventListener("click", () => {
  song.currentTime = 0;
  displayScene(0);
  showScreen(main);

  song.play().catch(() => {
    audioStatus.textContent = "Press play to listen again ♡";
  });
});


// =====================================
// MUSIC PLAYER
// =====================================

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.floor(seconds % 60);

  return `${minutes}:${String(secondsLeft).padStart(2, "0")}`;
}

function updateMusicButtons() {
  const playing = !song.paused;

  playBtn.textContent = playing ? "Ⅱ" : "▶";
  musicBtn.textContent = playing ? "♫ MUSIC ON" : "♫ MUSIC OFF";
}

playBtn.addEventListener("click", () => {
  if (song.paused) {
    song.play().catch(() => {
      audioStatus.textContent = "Please check your MP3 file.";
    });
  } else {
    song.pause();
  }
});

musicBtn.addEventListener("click", () => {
  if (song.paused) {
    song.play().catch(() => {
      audioStatus.textContent = "Please check your MP3 file.";
    });
  } else {
    song.pause();
  }
});

song.addEventListener("play", updateMusicButtons);
song.addEventListener("pause", updateMusicButtons);

song.addEventListener("loadedmetadata", () => {
  seekBar.max = song.duration;
  duration.textContent = formatTime(song.duration);
  audioStatus.textContent = "Soundtrack ready ♡";
});

song.addEventListener("timeupdate", () => {
  seekBar.value = song.currentTime;
  currentTime.textContent = formatTime(song.currentTime);
  updateLyrics();
});

seekBar.addEventListener("input", () => {
  song.currentTime = Number(seekBar.value);
  updateLyrics();
});

song.addEventListener("ended", () => {
  updateMusicButtons();
  showScreen(ending);
});

song.addEventListener("error", () => {
  audioStatus.textContent =
    "MP3 not found. Put teruna-dara.mp3 in the same folder.";
});


// =====================================
// LYRICS TIMELINE
// =====================================

// This is a timing structure for your own lyric text.
// Add the line and its start time in seconds.
// Example:
// { time: 10, section: "VERSE", text: "Your own text" }

const lyricCues = [
  { time: 0, section: "INTRO", text: "♪ Our story begins... ♡" },
  { time: 27.92, section: "VERSE", text: "♪ The story begins..." },
  { time: 55.78, section: "PRE-CHORUS", text: "♪ A little closer..." },
  { time: 69.09, section: "CHORUS", text: "♪ A beautiful moment..." },
  { time: 98.45, section: "INSTRUMENTAL", text: "♪ ♡ ♪" },
  { time: 124.28, section: "PRE-CHORUS", text: "♪ Together again..." },
  { time: 137.63, section: "CHORUS", text: "♪ Our favourite chapter..." },
  { time: 165.16, section: "OUTRO", text: "♪ Until the next story..." }
];

function updateLyrics() {
  const now = song.currentTime;
  let activeIndex = -1;

  for (let i = 0; i < lyricCues.length; i++) {
    if (now >= lyricCues[i].time) {
      activeIndex = i;
    }
  }

  if (activeIndex === -1) return;

  const active = lyricCues[activeIndex];
  const next = lyricCues[activeIndex + 1];

  lyricSection.textContent = active.section;
  lyricText.textContent = active.text;

  lyricNext.textContent = next
    ? "UP NEXT · " + next.section
    : "♡ THE END ♡";
}


// =====================================
// INITIAL SETTINGS
// =====================================

displayScene(0);

seekBar.value = 0;
currentTime.textContent = "0:00";
duration.textContent = "0:00";

updateMusicButtons();
updateLyrics();
