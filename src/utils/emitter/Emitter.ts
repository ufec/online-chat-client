/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export class Emitter {
  private listeners: Record<string, Function[]> = {};

  on(event: string, fn: Function) {
    this.listeners[event] = this.listeners[event] ?? [];
    this.listeners[event].push(fn);
    return this;
  }

  off(event: string, fn: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((f) => f !== fn);
    }
  }

  emit(event: string, ...args: unknown[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((fn) => fn(...args) as unknown);
    }
    return this;
  }

  once(event: string, fn: Function) {
    const on = (...args: unknown[]) => {
      this.off(event, on);
      fn(...args);
    };
    this.on(event, on);
    return this;
  }

  clear() {
    this.listeners = {};
  }
}
