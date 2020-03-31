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
  requestServerUrl: string;
  settingsFormVisible: boolean;
  sessionId: string;
  userId: string;
  rtmpServerUrl: string;
  videoBitRate: number;
}

interface CameraProps {
  audioBitRate: number;
  cameraId: string;
  flashEnabled: boolean;
  fps: number;
  isPublishing: boolean;
  isViewingFrontCamera: boolean;
  rtmpServerUrl: string;
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
  requestServerUrl: string;
  rtmpServerUrl: string;
  videoBitRate: number;
  audioBitRate: number;
  fps: number;
  updateProps(props: object): void;
}

interface LoginFormProps {
  requestServerUrl: string;
  rtmpServerUrl: string;
  isLoggedIn: boolean;
  updateProps(props: object): void;
}