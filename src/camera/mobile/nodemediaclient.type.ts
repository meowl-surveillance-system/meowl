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
  modalVisible: boolean;
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
  modalVisible: boolean;
  updateProps(props: object): void;
}

interface SettingsFormProps {
  modalVisible: boolean;
  outputLink: string;
  videoBitRate: number;
  audioBitRate: number;
  fps: number;
  updateProps(props: object): void;
}