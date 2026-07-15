/// <reference types="vite/client" />

export interface IElectronAPI {
  openFile: () => Promise<string>;
  getFileContent: (path: string) => Promise<ArrayBuffer>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}