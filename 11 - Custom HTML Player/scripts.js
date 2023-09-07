/* eslint-disable no-console */
// Get Elements
const player = document.querySelector('.player');
const video = document.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const playbackSpeed = document.querySelector('h2');
const fullscreenButton = player.querySelector('.player__fullScreen_button');
// Build Functions
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function toggleFullscreen() {
    console.log(this);
}

function updateButton() {
    const icon = this.paused ? '▶️' : '⏸️';
    // eslint-disable-next-line no-console
    console.log('Update the button');
    toggle.textContent = icon;
}

function skip() {
    console.log(this.dataset);
    video.currentTime += parseFloat(this.dataset.skip);
}
function handleRangeUpdate() {
    video[this.name] = this.value;
    if (this.name === 'playbackRate') playbackSpeed.textContent = this.value;
    console.log(this.value);
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(e);
}

// Add event listeners
video.currentTime = 0;
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);

fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        player.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

skipButtons.forEach((button) => button.addEventListener('click', skip));
ranges.forEach((range) => range.addEventListener('change', handleRangeUpdate));
ranges.forEach((range) => range.addEventListener('mousedown', handleRangeUpdate));

progress.addEventListener('click', scrub);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));
