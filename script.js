/**
 * Accurate Stopwatch Application
 * Features: High-precision timing via performance.now(), lap history with
 * fastest/slowest lap detection, responsive layout, and keyboard shortcuts.
 */

// Timing state
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let animationFrameId = null;
let lastLapTime = 0;
let lapsData = [];

// DOM Elements
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const lapsList = document.getElementById("laps");
const statusIndicator = document.getElementById("status");
const lapCountBadge = document.getElementById("lap-count");
const noLapsState = document.getElementById("no-laps");
const lapTableHead = document.getElementById("lap-table-head");

/**
 * Format milliseconds into HH:MM:SS.mmm
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
  const safeMs = Math.max(0, Math.floor(ms));
  const hours = Math.floor(safeMs / 3600000);
  const minutes = Math.floor((safeMs % 3600000) / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  const milliseconds = safeMs % 1000;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
    String(milliseconds).padStart(3, "0")
  );
}

/**
 * Get current total elapsed time with high precision
 * @returns {number} Current elapsed time in milliseconds
 */
function getCurrentElapsed() {
  if (isRunning) {
    return elapsedTime + (performance.now() - startTime);
  }
  return elapsedTime;
}

/**
 * Continuous render loop using requestAnimationFrame
 */
function renderLoop() {
  if (!isRunning) return;

  const current = getCurrentElapsed();
  timeDisplay.textContent = formatTime(current);

  animationFrameId = requestAnimationFrame(renderLoop);
}

/**
 * Update UI controls and state indicator
 */
function updateUIState() {
  if (isRunning) {
    startBtn.disabled = true;
    startBtn.textContent = "Start";
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    resetBtn.disabled = false;

    statusIndicator.textContent = "Running";
    statusIndicator.className = "status-indicator running";
  } else if (elapsedTime > 0) {
    startBtn.disabled = false;
    startBtn.textContent = "Resume";
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = false;

    statusIndicator.textContent = "Paused";
    statusIndicator.className = "status-indicator paused";
  } else {
    startBtn.disabled = false;
    startBtn.textContent = "Start";
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = true;

    statusIndicator.textContent = "Ready";
    statusIndicator.className = "status-indicator ready";
  }
}

/**
 * Start or resume the stopwatch
 */
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startTime = performance.now();
  updateUIState();
  renderLoop();
}

/**
 * Pause the stopwatch
 */
function pauseTimer() {
  if (!isRunning) return;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  elapsedTime += performance.now() - startTime;
  isRunning = false;
  timeDisplay.textContent = formatTime(elapsedTime);
  updateUIState();
}

/**
 * Reset stopwatch and lap history
 */
function resetTimer() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  isRunning = false;
  startTime = 0;
  elapsedTime = 0;
  lastLapTime = 0;
  lapsData = [];

  timeDisplay.textContent = "00:00:00.000";
  updateUIState();
  renderLaps();
}

/**
 * Record a lap split time
 */
function recordLap() {
  // Prevent lap recording when stopwatch is stopped or reset
  if (!isRunning) return;

  const currentTotal = getCurrentElapsed();
  if (currentTotal <= 0) return;

  const lapDuration = currentTotal - lastLapTime;

  // Prevent duplicate/accidental double-clicks (< 20ms)
  if (lapDuration < 20 && lapsData.length > 0) return;

  lastLapTime = currentTotal;

  lapsData.push({
    id: lapsData.length + 1,
    duration: lapDuration,
    total: currentTotal,
  });

  renderLaps();
}

/**
 * Render the lap history list with fastest/slowest highlights
 */
function renderLaps() {
  lapCountBadge.textContent = String(lapsData.length);

  if (lapsData.length === 0) {
    noLapsState.style.display = "block";
    lapTableHead.style.display = "none";
    lapsList.innerHTML = "";
    return;
  }

  noLapsState.style.display = "none";
  lapTableHead.style.display = "grid";

  // Calculate fastest and slowest laps when at least 2 laps exist
  let minDuration = Infinity;
  let maxDuration = -Infinity;

  if (lapsData.length >= 2) {
    lapsData.forEach((lap) => {
      if (lap.duration < minDuration) minDuration = lap.duration;
      if (lap.duration > maxDuration) maxDuration = lap.duration;
    });
  }

  // Render newest laps first
  const fragment = document.createDocumentFragment();

  for (let i = lapsData.length - 1; i >= 0; i--) {
    const lap = lapsData[i];
    const isFastest = lapsData.length >= 2 && lap.duration === minDuration && minDuration !== maxDuration;
    const isSlowest = lapsData.length >= 2 && lap.duration === maxDuration && minDuration !== maxDuration;

    const li = document.createElement("li");
    li.className = "lap-item" + (isFastest ? " fastest" : "") + (isSlowest ? " slowest" : "");

    let tagHtml = "";
    if (isFastest) {
      tagHtml = '<span class="lap-tag fastest">Fastest</span>';
    } else if (isSlowest) {
      tagHtml = '<span class="lap-tag slowest">Slowest</span>';
    }

    li.innerHTML = `
      <div class="lap-col-id">
        <span>Lap ${String(lap.id).padStart(2, "0")}</span>
        ${tagHtml}
      </div>
      <div class="lap-col-duration">+${formatTime(lap.duration)}</div>
      <div class="lap-col-total">${formatTime(lap.total)}</div>
    `;

    fragment.appendChild(li);
  }

  lapsList.innerHTML = "";
  lapsList.appendChild(fragment);
}

// Event Listeners for Buttons
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);

// Keyboard Shortcuts
document.addEventListener("keydown", (event) => {
  // Do not intercept shortcuts if user is focusing an input or editable field
  const targetTag = event.target.tagName;
  if (
    targetTag === "INPUT" ||
    targetTag === "TEXTAREA" ||
    event.target.isContentEditable
  ) {
    return;
  }

  // Space: Start / Pause toggle
  if (event.code === "Space") {
    event.preventDefault();
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  // R: Reset (when allowed)
  if (event.key === "r" || event.key === "R") {
    if (!resetBtn.disabled) {
      event.preventDefault();
      resetTimer();
    }
  }

  // L: Lap (when running)
  if (event.key === "l" || event.key === "L") {
    if (isRunning && !lapBtn.disabled) {
      event.preventDefault();
      recordLap();
    }
  }
});

// Sync timer immediately when tab becomes visible again
document.addEventListener("visibilitychange", () => {
  if (isRunning) {
    timeDisplay.textContent = formatTime(getCurrentElapsed());
  }
});

// Initialize UI
updateUIState();