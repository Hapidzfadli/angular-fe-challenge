import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  EmployeeListState,
  SearchParams,
  PaginationState,
  SortState,
  SortDirection,
  DEFAULT_EMPLOYEE_LIST_STATE
} from '../../../shared/models';
import { StorageService } from '../../../core/services/storage.service';

const STATE_KEY = 'employee_list_state';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStateService {
  private stateSubject = new BehaviorSubject<EmployeeListState>(this.loadState());
  state$ = this.stateSubject.asObservable();

  constructor(private storage: StorageService) {}

  private loadState(): EmployeeListState {
    const saved = this.storage.getItem<EmployeeListState>(STATE_KEY);
    return saved || { ...DEFAULT_EMPLOYEE_LIST_STATE };
  }

  private saveState(state: EmployeeListState): void {
    this.storage.setItem(STATE_KEY, state);
  }

  getState(): EmployeeListState {
    return this.stateSubject.value;
  }

  updateSearchParams(params: Partial<SearchParams>): void {
    const currentState = this.stateSubject.value;
    const newState: EmployeeListState = {
      ...currentState,
      searchParams: { ...currentState.searchParams, ...params },
      pagination: { ...currentState.pagination, currentPage: 1 }
    };
    this.stateSubject.next(newState);
    this.saveState(newState);
  }

  updatePagination(pagination: Partial<PaginationState>): void {
    const currentState = this.stateSubject.value;
    const newState: EmployeeListState = {
      ...currentState,
      pagination: { ...currentState.pagination, ...pagination }
    };
    this.stateSubject.next(newState);
    this.saveState(newState);
  }

  toggleSort(field: string): void {
    const currentState = this.stateSubject.value;
    const columns = [...currentState.sortState.columns];
    const existingIndex = columns.findIndex(c => c.field === field);

    if (existingIndex >= 0) {
      const current = columns[existingIndex];
      if (current.direction === 'asc') {
        columns[existingIndex] = { field, direction: 'desc' };
      } else {
        columns.splice(existingIndex, 1);
      }
    } else {
      columns.push({ field, direction: 'asc' });
    }

    const newState: EmployeeListState = {
      ...currentState,
      sortState: { columns }
    };
    this.stateSubject.next(newState);
    this.saveState(newState);
  }

  getSortDirection(field: string): SortDirection {
    const col = this.stateSubject.value.sortState.columns.find(c => c.field === field);
    return col?.direction || '';
  }

  resetState(): void {
    this.stateSubject.next({ ...DEFAULT_EMPLOYEE_LIST_STATE });
    this.storage.removeItem(STATE_KEY);
  }
}
