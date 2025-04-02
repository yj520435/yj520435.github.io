export interface Company {
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
}

export interface Account {
  accessToken: string;
  expiryDate: Date;
  userName: string;
  userEmail: string;
}

export type MimeType = 'application/vnd.google-apps.folder' | 'text/x-markdown';
