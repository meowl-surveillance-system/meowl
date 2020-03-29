interface NodeMediaClientRef {
  start(): void;
  stop(): void;
  switchCamera(): void;
  flashEnable(enabled: boolean): void;
}

type NodeMediaClientStatusCode = 2000|2001|2002|2004;

interface AppState {
  audioBitRate: number;
  cameraId: string;
  flashEnabled: boolean;
  fps: number;
  isLoggedIn: boolean;
  isPublishing: boolean;
  isViewingFrontCamera: boolean;
  settingsFormVisible: boolean;
  sessionId: string;
  userId: string;
  outputLink: string;
  videoBitRate: number;
}

interface CameraProps {
  audioBitRate: number;
  cameraId: string;
  flashEnabled: boolean;
  fps: number;
  isPublishing: boolean;
  isViewingFrontCamera: boolean;
  outputLink: string;
  sessionId: string;
  userId: string;
  videoBitRate: number;
}

interface CameraState {
  rtmpStreamLink: string;
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

interface LoginFormProps {
  outputLink: string;
  isLoggedIn: boolean;
  updateProps(props: object): void;
}