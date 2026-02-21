export interface ClockConfig {
  nodeId: string;
  frequencyHz: number;
  enabled: boolean;
}

export type ClockTickCallback = (nodeId: string, value: 0 | 1) => void;

export class ClockScheduler {
  private clocks: Map<string, ClockConfig> = new Map();
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private clockStates: Map<string, 0 | 1> = new Map();
  private readonly callback: ClockTickCallback;
  private paused: boolean = false;

  constructor(callback: ClockTickCallback) {
    this.callback = callback;
  }

  addClock(nodeId: string, frequencyHz: number = 1): void {
    const config: ClockConfig = {
      nodeId,
      frequencyHz: Math.max(0.1, Math.min(frequencyHz, 1000)),
      enabled: true,
    };
    this.clocks.set(nodeId, config);
    this.clockStates.set(nodeId, 0);

    if (!this.paused) {
      this.startClock(nodeId);
    }
  }

  removeClock(nodeId: string): void {
    this.stopClock(nodeId);
    this.clocks.delete(nodeId);
    this.clockStates.delete(nodeId);
  }

  setFrequency(nodeId: string, frequencyHz: number): void {
    const config = this.clocks.get(nodeId);
    if (!config) return;

    config.frequencyHz = Math.max(0.1, Math.min(frequencyHz, 1000));

    if (!this.paused && config.enabled) {
      this.stopClock(nodeId);
      this.startClock(nodeId);
    }
  }
    pause(): void {
    this.paused = true;
    for (const nodeId of this.clocks.keys()) {
      this.stopClock(nodeId);
    }
  }

  resume(): void {
    this.paused = false;
    for (const [nodeId, config] of this.clocks) {
      if (config.enabled) {
        this.startClock(nodeId);
      }
    }
  }

  reset(): void {
    for (const nodeId of this.clocks.keys()) {
      this.stopClock(nodeId);
      this.clockStates.set(nodeId, 0);
      this.callback(nodeId, 0);
    }
  }

  getState(nodeId: string): 0 | 1 {
    return this.clockStates.get(nodeId) ?? 0;
  }
  dispose(): void {
    for (const nodeId of this.clocks.keys()) {
      this.stopClock(nodeId);
    }
    this.clocks.clear();
    this.clockStates.clear();
    this.timers.clear();
  }

  private startClock(nodeId: string): void {
    const config = this.clocks.get(nodeId);
    if (!config) return;

    this.stopClock(nodeId);

    const intervalMs = Math.max(1, 1000 / (config.frequencyHz * 2));

    const tick = () => {
      if (this.paused || !config.enabled) return;

      const currentState = this.clockStates.get(nodeId) ?? 0;
      const newState: 0 | 1 = currentState === 0 ? 1 : 0;
      this.clockStates.set(nodeId, newState);
      this.callback(nodeId, newState);

      const timer = setTimeout(tick, intervalMs);
      this.timers.set(nodeId, timer);
    };

    const timer = setTimeout(tick, intervalMs);
    this.timers.set(nodeId, timer);
  }

  private stopClock(nodeId: string): void {
    const timer = this.timers.get(nodeId);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(nodeId);
    }
  }
}
