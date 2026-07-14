import { ElectronAPI } from '@electron-toolkit/preload'

export interface RecallAPI {
  openPDF: () => Promise<string | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: RecallAPI
  }
}