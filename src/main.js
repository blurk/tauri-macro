import { Macro } from "./Macro.js";

const { moveWindow, Position } = window.__TAURI__.positioner;
moveWindow(Position.TopRight);

window.addEventListener("DOMContentLoaded", async () => {
  const soundStart = new Howl({
    src: ["./assets/sounds/start.mp3"],
    volume: 0.2,
  });

  const soundContinue = new Howl({
    src: ["./assets/sounds/continue.mp3"],
    volume: 0.2,
  });

  const soundStop = new Howl({
    src: ["./assets/sounds/stop.mp3"],
    volume: 0.2,
  });

  const soundReset = new Howl({
    src: ["./assets/sounds/reset.mp3"],
    volume: 0.2,
  });

  const soundWait = new Howl({
    src: ["./assets/sounds/wait.mp3"],
    volume: 0.2,
    loop: true,
  });

  const contentRes = await fetch("/files/content.txt");
  const content = await contentRes.text();

  const macro = new Macro({
    content: content,
    wait: 21000,
    delay: 987,
  });

  const txtCountDown = document.getElementById("txtCountDown");
  const btnStart = document.getElementById("btnStart");
  const btnStop = document.getElementById("btnStop");
  const btnContinue = document.getElementById("btnContinue");
  const btnReset = document.getElementById("btnReset");

  btnStart.onclick = () => {
    soundWait.play();
    txtCountDown.innerText = "Will run after 10s!";

    setTimeout(() => {
      soundWait.stop();
      soundStart.play();
      macro.run();
      txtCountDown.innerText = "Started!";
    }, 10 * 1000);
  };

  btnStop.onclick = () => {
    soundStop.play();
    macro.stop();
    txtCountDown.innerText = "Stopped!";
  };

  btnContinue.onclick = () => {
    soundWait.play();
    txtCountDown.innerText = "Will continue after 5s!";

    setTimeout(() => {
      soundWait.stop();

      soundContinue.play();
      macro.continue();
      txtCountDown.innerText = "Continued!";
    }, 5 * 1000);
  };

  btnReset.onclick = () => {
    soundReset.play();
    macro.reset();
  };
});
