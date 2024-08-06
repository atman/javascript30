const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            // OLD Way = window.URL.createObjectURL(localMediaStream)
            video.play();
        })
        .catch((err) => {
            alert('Webcam access not granted. Please allow webcam access');
            console.err('Error', err);
        });
}

function paintToCanvas() {
    const height = video.videoHeight;
    const width = video.videoWidth;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        // Get the pixel Data
        let pixels = ctx.getImageData(0, 0, width, height);
        // Change them
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        // Resert the pixel data with the new one

        ctx.putImageData(pixels, 0, 0);
        ctx.font = '48px serif';
        ctx.fillText('Hello world', 10, 50);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // Take data from the canvas frame
    const data = canvas.toDataURL('image/png', 0.5);

    // Create link and showimage
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome " />`;

    strip.insertBefore(link, strip.firstChild);

    // Record for 5 seconds
    mediaRecorder.start();
    console.log('Recording started...');
    setTimeout(() => {
        console.log('Timeout triggered...');
        mediaRecorder.stop();
    }, 5000);
    // console.log(data);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 150] = pixels.data[i + 2]; // BLUE
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i + 0];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];
        const alpha = pixels.data[i + 3];

        if (
            red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax
        ) {
            // take it out!
            pixels.data[i + 3] = 0;
            // console.log(pixels.data);
        }
    }
    return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvas);

// Video Recording
const videoStream = canvas.captureStream(25);
const mediaRecorder = new MediaRecorder(videoStream, {
    mimeType: 'video/webm;codecs=vp9',
    ignoreMutedMedia: true,
});

const chunks = [];
mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
        chunks.push(e.data);
    }
};

mediaRecorder.onstop = function (e) {
    console.log('Recording stopped...');
    console.log(chunks);
    setTimeout(() => {
        const blob = new Blob(chunks, {
            type: 'video/webm',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(url);
    }, 0);
    // video.src = videoURL;
};
