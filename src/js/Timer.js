class Timer {
  #interval = 1000;

  #eventElapsed = 'elapsed';

  #currentValue;

  timerID;

  #eventHandlers;

  constructor(htmlElement) {
    this.instance = document.querySelector(`.${htmlElement}`);
    this.#currentValue = 0;
  }

  set(value) {
    this.#currentValue = value.toString().padStart(2, '0');
    this.instance.textContent = `00 : ${this.#currentValue}`;
  }

  #update() {
    this.#currentValue = this.#currentValue - 1;
    this.set(this.#currentValue);
    if (this.#currentValue === '00') {
      this.stop();
      this.#trigger(this.#eventElapsed);
    }
  }

  pause() {
    if (this.timerID !== undefined) {
      clearInterval(this.timerID);
      this.timerID = undefined;
    }
  }

  start() {
    this.instance.style.color = 'black';
    if (this.timerID === undefined) {
      this.timerID = setInterval(() => {
        this.#update();
      }, this.#interval);
    }
  }

  stop() {
    if (this.timerID !== undefined) {
      clearInterval(this.timerID);
      this.timerID = undefined;
    }
  }

  on(eventName, handler) {
    if (!this.#eventHandlers) this.#eventHandlers = {};
    if (!this.#eventHandlers[eventName]) {
      this.#eventHandlers[eventName] = [];
    }
    this.#eventHandlers[eventName].push(handler);
  }

  off(eventName, handler) {
    const handlers = this.#eventHandlers && this.#eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice((i = -1), 1);
      }
    }
  }

  #trigger(eventName, ...args) {
    if (!this.#eventHandlers || !this.#eventHandlers[eventName]) {
      return;
    }

    this.#eventHandlers[eventName].forEach((handler) => handler.apply(this, args));
  }
}

export default Timer;
