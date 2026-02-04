import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee, EmployeeListState, SEARCHABLE_FIELDS, SortDirection } from '../../../shared/models';
import { EmployeeService } from '../services/employee.service';
import { EmployeeStateService } from '../services/employee-state.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    ConfirmDialogComponent,
    RupiahPipe,
    DateFormatPipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  state!: EmployeeListState;
  searchFields = SEARCHABLE_FIELDS;

  isLoading = false;
  showDeleteDialog = false;
  employeeToDelete: Employee | null = null;

  private subscription?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private stateService: EmployeeStateService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.stateService.state$.subscribe(state => {
      this.state = state;
      this.applyFilters();
    });
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load employees');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = this.employeeService.filterEmployees(this.employees, this.state.searchParams);
    result = this.employeeService.sortEmployees(result, this.state.sortState);

    this.filteredEmployees = result;
    this.stateService.updatePagination({ totalItems: result.length });

    this.displayedEmployees = this.employeeService.paginateEmployees(result, this.state.pagination);
  }

  onSearchChange(): void {
    this.stateService.updateSearchParams(this.state.searchParams);
  }

  onSort(field: string): void {
    this.stateService.toggleSort(field);
  }

  getSortDirection(field: string): SortDirection {
    return this.stateService.getSortDirection(field);
  }

  onPageChange(page: number): void {
    this.stateService.updatePagination({ currentPage: page });
    this.displayedEmployees = this.employeeService.paginateEmployees(
      this.filteredEmployees,
      { ...this.state.pagination, currentPage: page }
    );
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.stateService.updatePagination({ itemsPerPage, currentPage: 1 });
    this.displayedEmployees = this.employeeService.paginateEmployees(
      this.filteredEmployees,
      { ...this.state.pagination, itemsPerPage, currentPage: 1 }
    );
  }

  addEmployee(): void {
    this.router.navigate(['/app/employees/add']);
  }

  viewEmployee(employee: Employee): void {
    this.router.navigate(['/app/employees/detail', employee.id]);
  }

  editEmployee(employee: Employee): void {
    this.notificationService.showWarning(`Editing employee: ${employee.firstName} ${employee.lastName}`);
    this.router.navigate(['/app/employees/edit', employee.id]);
  }

  confirmDelete(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteDialog = true;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
  }

  deleteEmployee(): void {
    if (!this.employeeToDelete) return;

    const employee = this.employeeToDelete;
    this.showDeleteDialog = false;

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.showError(`Employee ${employee.firstName} ${employee.lastName} has been deleted`);
          this.loadEmployees();
        }
      },
      error: () => {
        this.notificationService.showError('Failed to delete employee');
      }
    });

    this.employeeToDelete = null;
  }

  clearSearch(): void {
    this.stateService.resetState();
  }
}
