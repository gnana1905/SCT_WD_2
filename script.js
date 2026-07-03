let startTime = 0;
let elapsedTime = 0;
let timer = null;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const laps = document.getElementById("laps");

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    return (
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0") + "." +
        String(milliseconds).padStart(3, "0")
    );
}

function updateTime() {
    const currentTime = Date.now() - startTime + elapsedTime;
    timeDisplay.textContent = formatTime(currentTime);
}

startBtn.addEventListener("click", () => {
    if (timer) return;

    startTime = Date.now();

    timer = setInterval(updateTime, 10);
});

pauseBtn.addEventListener("click", () => {
    if (!timer) return;

    clearInterval(timer);
    timer = null;

    elapsedTime += Date.now() - startTime;
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    startTime = 0;
    elapsedTime = 0;
    timeDisplay.textContent = "00:00:00.000";
    laps.innerHTML = "";
});

lapBtn.addEventListener("click", () => {
    if (timeDisplay.textContent === "00:00:00.000") return;

    const li = document.createElement("li");
    li.textContent = timeDisplay.textContent;
    laps.prepend(li);
});