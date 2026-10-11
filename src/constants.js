export const APP_NAME = 'writespace';

export const DEFAULT_DOCUMENT_TITLE = 'Untitled Document';

export const DEFAULT_USER_SETTINGS = {
  theme: 'light',
  fontSize: 16,
  fontFamily: 'Inter, sans-serif',
  lineHeight: 1.5,
  autoSave: true,
};

export const DOCUMENT_SORT_OPTIONS = {
  TITLE: 'title',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
};

export const DOCUMENT_SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const LOCAL_STORAGE_KEYS = {
  DOCUMENTS: 'writespace_documents',
  SETTINGS: 'writespace_settings',
  CURRENT_DOCUMENT_ID: 'writespace_current_document_id',
};

export const API_ENDPOINTS = {
  DOCUMENTS: '/api/documents',
};

export const ERROR_MESSAGES = {
  DOCUMENT_NOT_FOUND: 'Document not found',
  FAILED_TO_FETCH: 'Failed to fetch documents',
  FAILED_TO_CREATE: 'Failed to create document',
  FAILED_TO_UPDATE: 'Failed to update document',
  FAILED_TO_DELETE: 'Failed to delete document',
  INVALID_DOCUMENT_ID: 'Invalid document ID',
};