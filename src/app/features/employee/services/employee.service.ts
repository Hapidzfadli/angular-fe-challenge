import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Employee, Group, SearchParams, SortState, PaginationState } from '../../../shared/models';
import { EMPLOYEES_DATA } from '../../../data/employees.data';
import { GROUPS_DATA } from '../../../data/groups.data';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [...EMPLOYEES_DATA];

  getEmployees(): Observable<Employee[]> {
    return of([...this.employees]).pipe(delay(100));
  }

  getEmployeeById(id: string): Observable<Employee | undefined> {
    const employee = this.employees.find(e => e.id === id);
    return of(employee).pipe(delay(100));
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const newId = (Math.max(...this.employees.map(e => parseInt(e.id))) + 1).toString();
    const newEmployee: Employee = { ...employee, id: newId };
    this.employees.push(newEmployee);
    return of(newEmployee).pipe(delay(300));
  }

  updateEmployee(id: string, data: Partial<Employee>): Observable<Employee | undefined> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...data };
      return of(this.employees[index]).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteEmployee(id: string): Observable<boolean> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getGroups(): Observable<Group[]> {
    return of(GROUPS_DATA).pipe(delay(100));
  }

  filterEmployees(employees: Employee[], params: SearchParams): Employee[] {
    return employees.filter(employee => {
      const match1 = this.matchField(employee, params.searchField1, params.searchTerm1);
      const match2 = this.matchField(employee, params.searchField2, params.searchTerm2);
      return match1 && match2;
    });
  }

  private matchField(employee: Employee, field: string, term: string): boolean {
    if (!term.trim()) return true;
    const value = employee[field as keyof Employee];
    if (value === null || value === undefined) return false;
    return String(value).toLowerCase().includes(term.toLowerCase());
  }

  sortEmployees(employees: Employee[], sortState: SortState): Employee[] {
    if (!sortState.columns.length) return employees;

    return [...employees].sort((a, b) => {
      for (const col of sortState.columns) {
        const aVal = a[col.field as keyof Employee];
        const bVal = b[col.field as keyof Employee];

        let comparison = 0;
        if (aVal === null || aVal === undefined) comparison = 1;
        else if (bVal === null || bVal === undefined) comparison = -1;
        else if (aVal < bVal) comparison = -1;
        else if (aVal > bVal) comparison = 1;

        if (comparison !== 0) {
          return col.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  paginateEmployees(employees: Employee[], pagination: PaginationState): Employee[] {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return employees.slice(start, end);
  }
}
