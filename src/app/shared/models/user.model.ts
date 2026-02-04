export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}
