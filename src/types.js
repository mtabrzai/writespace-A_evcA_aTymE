export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  tags: string[];
}

export interface DocumentStore {
  documents: Document[];
  currentDocumentId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  createDocument: (title: string) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  setCurrentDocument: (id: string | null) => void;
  toggleFavorite: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  autoSave: boolean;
}

export interface AppState {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

export type DocumentSortOption = 'title' | 'createdAt' | 'updatedAt';
export type DocumentSortDirection = 'asc' | 'desc';