import { moveWindow, Position } from "@tauri-apps/plugin-positioner";
import { Howl } from "howler";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import Macro from "./Macro";

moveWindow(Position.TopRight);

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

window.addEventListener("DOMContentLoaded", async () => {
  /** @type {Macro} */
  let macro;

  const txtCountDown = document.getElementById("txtCountDown");
  const btnStart = document.getElementById("btnStart");
  const btnStop = document.getElementById("btnStop");
  const btnContinue = document.getElementById("btnContinue");
  const btnReset = document.getElementById("btnReset");

  const editor = monaco.editor.create(document.getElementById("editor"), {
    theme: "vs-dark",
    // cursorStyle: "block",
  });

  btnStart.onclick = async () => {
    const content = editor.getValue();
    if (!content) {
      alert("NO!");
      return;
    }

    macro = new Macro({
      content: content,
      wait: 21000,
      delay: 987,
    });

    soundWait.play();
    txtCountDown.innerText = "Will run after 10s!";

    setTimeout(async () => {
      soundWait.stop();
      soundStart.play();
      await macro.run();
      txtCountDown.innerText = "Started!";
    }, 10 * 1000);
  };

  btnStop.onclick = async () => {
    soundStop.play();
    macro.stop();
    txtCountDown.innerText = "Stopped!";
  };

  btnContinue.onclick = async () => {
    soundWait.play();
    txtCountDown.innerText = "Will continue after 5s!";

    setTimeout(async () => {
      soundWait.stop();

      soundContinue.play();
      await macro.continue();
      txtCountDown.innerText = "Continued!";
    }, 5 * 1000);
  };

  btnReset.onclick = async () => {
    soundReset.play();
    await macro.reset();
    txtCountDown.innerText = "Reset done!";
  };
});
