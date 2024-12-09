const { invoke } = window.__TAURI__.core;
const { moveWindow, Position } = window.__TAURI__.positioner;

moveWindow(Position.TopRight);

async function sendKey(key = "") {
  await invoke("trigger_key", { key });
}

async function deleteAll() {
  await invoke("trigger_delete_all");
}

class Macro {
  #stop = false;
  #pointer = 0;

  constructor(config = {}) {
    const { content = `Say no to corpo!`, delay = 321, wait = 3000 } = config;
    this.content = content;
    this.delay = delay;
    this.wait = wait;
  }

  #wait(ms) {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, ms);
    });
  }

  #type(key = "") {
    if (key === "\r") {
      return;
    }

    sendKey(key);
    return;
    switch (key) {
      case "(":
        robot.keyTap("9", "shift");
        break;
      case ")":
        robot.keyTap("0", "shift");
        break;
      case "{":
        robot.keyTap("[", "shift");
        break;
      case "}":
        robot.keyTap("]", "shift");
        break;
      case ":":
        robot.keyTap(":", "shift");
        break;
      case '"':
        robot.keyTap(`'`, "shift");
        break;
      case ">":
        robot.keyTap(".", "shift");
        break;
      case "<":
        robot.keyTap(",", "shift");
        break;
      case "?":
        robot.keyTap("/", "shift");
        break;
      case "_":
        robot.keyTap("-", "shift");
        break;
      case "+":
        robot.keyTap("=", "shift");
        break;
      case "!":
        robot.keyTap("1", "shift");
        break;
      case "@":
        robot.keyTap("2", "shift");
        break;
      case "#":
        robot.keyTap("3", "shift");
        break;
      case "$":
        robot.keyTap("4", "shift");
        break;
      case "%":
        robot.keyTap("5", "shift");
        break;
      case "^":
        robot.keyTap("6", "shift");
        break;
      case "&":
        robot.keyTap("7", "shift");
        break;
      case "*":
        robot.keyTap("8", "shift");
        break;
      case "A":
        robot.keyTap("a", ["shift"]);
        break;
      case "B":
        robot.keyTap("b", ["shift"]);
        break;
      case "C":
        robot.keyTap("c", ["shift"]);
        break;
      case "D":
        robot.keyTap("d", ["shift"]);
        break;
      case "E":
        robot.keyTap("e", ["shift"]);
        break;
      case "F":
        robot.keyTap("f", ["shift"]);
        break;
      case "G":
        robot.keyTap("g", ["shift"]);
        break;
      case "H":
        robot.keyTap("h", ["shift"]);
        break;
      case "I":
        robot.keyTap("i", ["shift"]);
        break;
      case "J":
        robot.keyTap("j", ["shift"]);
        break;
      case "K":
        robot.keyTap("k", ["shift"]);
        break;
      case "L":
        robot.keyTap("l", ["shift"]);
        break;
      case "M":
        robot.keyTap("m", ["shift"]);
        break;
      case "N":
        robot.keyTap("n", ["shift"]);
        break;
      case "O":
        robot.keyTap("o", ["shift"]);
        break;
      case "P":
        robot.keyTap("p", ["shift"]);
        break;
      case "Q":
        robot.keyTap("q", ["shift"]);
        break;
      case "R":
        robot.keyTap("r", ["shift"]);
        break;
      case "S":
        robot.keyTap("s", ["shift"]);
        break;
      case "T":
        robot.keyTap("t", ["shift"]);
        break;
      case "U":
        robot.keyTap("u", ["shift"]);
        break;
      case "V":
        robot.keyTap("v", ["shift"]);
        break;
      case "W":
        robot.keyTap("w", ["shift"]);
        break;
      case "X":
        robot.keyTap("x", ["shift"]);
        break;
      case "Y":
        robot.keyTap("y", ["shift"]);
        break;
      case "Z":
        robot.keyTap("z", ["shift"]);
      case "|":
        robot.keyTap("|", ["shift"]);
        break;
      default:
        robot.keyTap(key);
        break;
    }
  }

  #nextChar() {
    this.#pointer += 1;

    if (this.#pointer === this.content.length) {
      this.#pointer = 0;
    }
  }

  #currentChar() {
    return this.content[this.#pointer];
  }

  stop() {
    this.#stop = true;
  }

  continue() {
    this.#stop = false;
    this.run();
  }

  async reset() {
    this.stop();

    await deleteAll();

    this.#pointer = 0;
  }

  async run() {
    if (this.#stop) {
      return;
    }

    const value = this.#currentChar();
    let k = value;

    const seed = Math.random();
    if (seed < 0.9) {
      this.#type(k);
      this.#nextChar();
      await this.#wait(this.delay * Math.random() + 321);
    } else if (seed < 0.95) {
    } else {
      await this.#wait(this.wait);
    }

    this.run();
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const soundStart = new Howl({
    src: ["./assets/sounds/start.mp3"],
    volume: 0.2,
  });

  const soundWait = new Howl({
    src: ["./assets/sounds/wait.mp3"],
    volume: 0.2,
    loop: true,
  });

  const soundStop = new Howl({
    src: ["./assets/sounds/stop.mp3"],
    volume: 0.2,
  });

  const contentRes = await fetch("/content.txt");
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

  let isWaiting = false;

  btnStart.onclick = () => {
    let count = 10;

    const intervalId = setInterval(() => {
      if (count === 0) {
        txtCountDown.innerText = "Started!";
        macro.run();

        if (isWaiting) {
          isWaiting = false;
          soundWait.stop();
        }

        soundStart.play();
        clearInterval(intervalId);
      } else {
        count--;

        if (!isWaiting) {
          isWaiting = true;
          soundWait.play();
        }

        txtCountDown.innerText = "Start after: " + count;
      }
    }, 1000);
  };

  btnStop.onclick = () => {
    macro.stop();
    txtCountDown.innerText = "Stopped!";
    soundStop.play();
  };

  btnContinue.onclick = () => {
    let count = 5;

    const intervalId = setInterval(() => {
      if (count === 0) {
        txtCountDown.innerText = "Continued!";

        if (isWaiting) {
          isWaiting = false;
          soundWait.stop();
        }

        soundStart.play();
        macro.continue();
        clearInterval(intervalId);
      } else {
        txtCountDown.innerText = "Continue after: " + count;
        count--;

        if (!isWaiting) {
          isWaiting = true;
          soundWait.play();
        }
      }
    }, 1000);
  };

  btnReset.onclick = () => {
    let count = 5;

    const intervalId = setInterval(() => {
      if (count === 0) {
        if (isWaiting) {
          isWaiting = false;
          soundWait.stop();
        }

        txtCountDown.innerText = "Reset ok! Please start again!";
        macro.reset();
        clearInterval(intervalId);
      } else {
        if (!isWaiting) {
          isWaiting = true;
          soundWait.play();
        }

        count--;
        txtCountDown.innerText = "Reset after: " + count;
      }
    }, 1000);
  };
});
