import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, LoginCredentials, AuthState } from '../../shared/models';
import { USERS_DATA } from '../../data/users.data';
import { StorageService } from './storage.service';

const AUTH_KEY = 'auth_state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    currentUser: null
  });

  authState$ = this.authState.asObservable();

  constructor(private storage: StorageService) {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    const savedState = this.storage.getItem<AuthState>(AUTH_KEY);
    if (savedState && savedState.isAuthenticated) {
      this.authState.next(savedState);
    }
  }

  private saveAuthState(state: AuthState): void {
    this.storage.setItem(AUTH_KEY, state);
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; message: string; user?: User }> {
    const user = USERS_DATA.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const newState: AuthState = {
        isAuthenticated: true,
        currentUser: user
      };
      this.authState.next(newState);
      this.saveAuthState(newState);
      return of({ success: true, message: 'Login successful', user }).pipe(delay(500));
    }

    return of({ success: false, message: 'Invalid username or password' }).pipe(delay(500));
  }

  logout(): void {
    const newState: AuthState = {
      isAuthenticated: false,
      currentUser: null
    };
    this.authState.next(newState);
    this.storage.removeItem(AUTH_KEY);
  }

  isLoggedIn(): boolean {
    return this.authState.value.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState.value.currentUser;
  }
}
