import { StorageAdapter } from './storage.types';
import { fileStorage } from './fileStorage';

declare global {
  // eslint-disable-next-line no-var
  var __WEALTH_OS_STORAGE__: StorageAdapter | undefined;
}

export function getStorage(): StorageAdapter {
  if (!globalThis.__WEALTH_OS_STORAGE__) {
    globalThis.__WEALTH_OS_STORAGE__ = fileStorage;
  }
  return globalThis.__WEALTH_OS_STORAGE__;
}
