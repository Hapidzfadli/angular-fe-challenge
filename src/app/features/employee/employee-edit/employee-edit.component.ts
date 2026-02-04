import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Employee, Group } from '../../../shared/models';
import { SearchableDropdownComponent, DropdownOption } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { NumericOnlyDirective } from '../../../shared/directives/numeric-only.directive';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchableDropdownComponent,
    NumericOnlyDirective
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  groups: DropdownOption[] = [];
  employee: Employee | null = null;
  isLoading = false;
  isLoadingData = true;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.loadGroups();
    this.loadEmployee();
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      basicSalary: ['', [Validators.required, Validators.min(1)]],
      status: ['', [Validators.required]],
      group: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  private loadGroups(): void {
    this.employeeService.getGroups().subscribe(groups => {
      this.groups = groups.map(g => ({ id: g.id, name: g.name }));
    });
  }

  private loadEmployee(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/app/employees']);
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        if (employee) {
          this.employee = employee;
          this.populateForm(employee);
        } else {
          this.notificationService.showError('Employee not found');
          this.router.navigate(['/app/employees']);
        }
        this.isLoadingData = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load employee');
        this.router.navigate(['/app/employees']);
      }
    });
  }

  private populateForm(employee: Employee): void {
    const birthDate = employee.birthDate instanceof Date
      ? employee.birthDate.toISOString().split('T')[0]
      : new Date(employee.birthDate).toISOString().split('T')[0];

    this.employeeForm.patchValue({
      username: employee.username,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      birthDate: birthDate,
      basicSalary: employee.basicSalary,
      status: employee.status,
      group: employee.group,
      description: employee.description
    });
  }

  private futureDateValidator(control: { value: string }): { futureDate: boolean } | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selectedDate > today ? { futureDate: true } : null;
  }

  get f() {
    return this.employeeForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || !this.employee) {
      Object.keys(this.employeeForm.controls).forEach(key => {
        this.employeeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.employeeForm.value;

    const updatedData = {
      ...formValue,
      birthDate: new Date(formValue.birthDate),
      basicSalary: Number(formValue.basicSalary)
    };

    this.employeeService.updateEmployee(this.employee.id, updatedData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Employee updated successfully');
        this.router.navigate(['/app/employees']);
      },
      error: () => {
        this.notificationService.showError('Failed to update employee');
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/app/employees']);
  }
}
