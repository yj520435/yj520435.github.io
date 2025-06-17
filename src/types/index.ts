export interface Work {
  id: string;
  name: string;
  from: string;
  to: string;
  department: string;
  position: string;
  description: string;
  tasks: string[];
}

export interface Project {
  id: string;
  name: string;
  from: string;
  to: string;
  keywords: string[];
}

export interface File {
  id: string;
  name: string;
  kind: string;
  mimeType: MimeType;
  createdTime: string;
  modifiedTime: string;
  fullPath?: string;
}

export interface Account {
  accessToken: string;
  expiryDate: Date;
  userName: string;
  userEmail: string;
  userPhoto: string;
}

export interface PopupOption {
  type: 'confirm' | 'prompt' | 'alert';
  icon: string;
  props?: any;
  message?: string;
  submit?: {
    type: 'default' | 'request' | 'warning';
    text: string;
    callback: Function;
  };
}

export interface ToastOption {
  icon: string;
  text: string;
  class?: string;
}

export type MimeType = 'application/vnd.google-apps.folder' | 'text/markdown';
