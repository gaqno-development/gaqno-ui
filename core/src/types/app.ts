export interface INotification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: Date
}

export interface IAppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: INotification[]
}

export type IAppAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; payload: INotification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }

