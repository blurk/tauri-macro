import { invoke } from "@tauri-apps/api/core";

async function sendKey(key) {
  await invoke("trigger_key", { key });
}

async function scroll() {
  await invoke("scroll");
}

async function moveMouse(x = 20, y = 20) {
  await invoke("move_mouse", { x, y });
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
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
    sendKey(key);
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

  async continue() {
    this.#stop = false;
    await this.run();
  }

  async reset() {
    this.stop();

    this.#pointer = 0;
  }

  async callMoveMouse() {
    const x = getRandomIntInclusive(-50, 50) || 50;
    const y = getRandomIntInclusive(-50, 50) || 50;

    let i = 0;
    const step = Math.floor(Math.PI / Math.E);
    const speed = 1000 / 60;

    if (Math.random() > 0.5) {
      if (x > 0) {
        while (i < x) {
          i += step;
          await moveMouse(i, y);
          await this.#wait(speed);
        }
      } else {
        while (i > x) {
          i -= step;
          await moveMouse(i, y);
          await this.#wait(speed);
        }
      }
    } else {
      if (y > 0) {
        while (i < y) {
          i += step;
          await moveMouse(x, i);
          await this.#wait(speed);
        }
      } else {
        while (i > y) {
          i -= step;
          await moveMouse(x, i);
          await this.#wait(speed);
        }
      }
    }
  }

  async run() {
    if (this.#stop) {
      return;
    }

    const value = this.#currentChar();
    let k = value;

    const seed = Math.random();
    if (seed < 0.85) {
      this.#type(k);
      this.#nextChar();
      await this.#wait(this.delay * Math.random() + 321);
    } else if (seed < 0.9) {
      await this.callMoveMouse();
    } else if (seed < 0.95) {
      await scroll();
    } else {
      await this.#wait(this.wait);
    }

    this.run();
  }
}

export default Macro;
