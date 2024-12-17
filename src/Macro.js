import { invoke } from "@tauri-apps/api/core";

async function sendKey(key = "") {
  await invoke("trigger_key", { key });
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

export default Macro;
