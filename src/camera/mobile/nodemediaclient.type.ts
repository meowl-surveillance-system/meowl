interface NodeMediaClientRef {
  start(): void;
  stop(): void;
  switchCamera(): void;
  flashEnable(enabled: boolean): void;
}

interface AppState {
  audioBitRate: number;
  flashEnabled: boolean;
  fps: number;
  isPublishing: boolean;
  isViewingFrontCamera: boolean;
  settingsFormVisible: boolean;
  outputLink: string;
  videoBitRate: number;
}

interface CameraProps {
  audioBitRate: number;
  flashEnabled: boolean;
  fps: number;
  isPublishing: boolean;
  isViewingFrontCamera: boolean;
  outputLink: string;
  videoBitRate: number;
}

interface AppBarProps {
  flashEnabled: boolean;
  isPublishing: boolean;
  isViewingFrontCamera: boolean;
  settingsFormVisible: boolean;
  updateProps(props: object): void;
}

interface SettingsFormProps {
  settingsFormVisible: boolean;
  outputLink: string;
  videoBitRate: number;
  audioBitRate: number;
  fps: number;
  updateProps(props: object): void;
}