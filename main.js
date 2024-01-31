// Based on: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API#a_sample_application_web_dictaphone

const ANALYSER_FFT = 2048;
const ANALYSER_BASE = 128.0;
const UPDATE_INTERVAL = 200; // milliseconds
const rangeDisplay = document.getElementById('range-display');

rangeDisplay.min = 0;
rangeDisplay.max = 128; // arbitrary

function display(value) {
  rangeDisplay.value = value;
}

function main() {
  if (!('getUserMedia' in navigator.mediaDevices)) {
    console.error('MediaDevices.getUserMedia() not supported on your browser!');
    return;
  }

  navigator
    .mediaDevices
    .getUserMedia({
      audio: true
    })
    .then((stream) => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = ANALYSER_FFT;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);
        const maxInput = Math.max(...dataArray);
        const value = maxInput - ANALYSER_BASE;
        display(value);
      }, UPDATE_INTERVAL);
    })
    .catch((err) => {
      console.log("The following error occured: " + err);
    });
}

main();
