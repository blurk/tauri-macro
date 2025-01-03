import { moveWindow, Position } from "@tauri-apps/plugin-positioner";
import { Howl } from "howler";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main";

import Macro from "./Macro";

moveWindow(Position.TopRight);

const soundStart = new Howl({
  src: ["/sounds/start.mp3"],
  volume: 0.2,
});

const soundContinue = new Howl({
  src: ["/sounds/continue.mp3"],
  volume: 0.2,
});

const soundStop = new Howl({
  src: ["/sounds/stop.mp3"],
  volume: 0.2,
});

const soundReset = new Howl({
  src: ["/sounds/reset.mp3"],
  volume: 0.2,
});

const soundWait = new Howl({
  src: ["/sounds/wait.mp3"],
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

  /** @type {HTMLInputElement} */
  const inputDelay = document.getElementById("inputDelay");
  /** @type {HTMLInputElement} */
  const inputWait = document.getElementById("inputWait");
  const btnInputDelay = document.getElementById("btnInputDelay");
  const btnInputWait = document.getElementById("btnInputWait");

  let timeConfig = {
    delay: inputDelay.valueAsNumber,
    wait: inputWait.valueAsNumber,
  };

  btnInputDelay.onclick = () => {
    timeConfig.delay = Number.isNaN(inputDelay.valueAsNumber)
      ? 987
      : inputDelay.valueAsNumber;

    macro.delay = timeConfig.delay;
    txtCountDown.innerText = "Typing delay updated!";
  };

  btnInputWait.onclick = () => {
    timeConfig.wait = Number.isNaN(inputWait.valueAsNumber)
      ? 21000
      : inputWait.valueAsNumber;

    macro.wait = timeConfig.wait;
    txtCountDown.innerText = "Waiting time updated!";
  };

  const editor = monaco.editor.create(document.getElementById("editor"), {
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: false, renderCharacters: false },
    renderIndentGuides: false,
    renderLineHighlightOnlyWhenFocus: true,
    language: "typescript",
    value: value,
  });

  btnStart.onclick = async () => {
    const content = editor.getValue();

    if (!content) {
      alert("NO!");
      return;
    }

    macro = new Macro({
      content: content,
      ...timeConfig,
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
    soundWait.stop();
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

const value = `import React from 'react';

function StyledComponent() {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    box: {
      padding: '20px',
      backgroundColor: '#4caf50',
      color: '#fff',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        Hello, this is a styled component!
      </div>
    </div>
  );
}

export default StyledComponent;
`;
