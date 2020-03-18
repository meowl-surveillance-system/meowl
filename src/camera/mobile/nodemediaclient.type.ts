interface NodeMediaClientRef {
  start(): void;
  stop(): void;
  switchCamera(): void;
  flashEnable(enabled: boolean): void;
}