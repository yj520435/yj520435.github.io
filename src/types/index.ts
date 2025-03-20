export interface Tab {
  id: string;
  name: string;
  // component: Component;
}

export interface Company {
  id: string;
  name: string;
  from: string;
  to: string;
  projects: Project[];
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
}

export interface Category {
  id: string;
  name: string;
  items?: string[];
}

export interface User {
  name: string;
  email: string;
}

export type MimeType = 'application/vnd.google-apps.folder' | 'text/x-markdown';
