import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Group } from '../../../shared/models';
import { SearchableDropdownComponent, DropdownOption } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { NumericOnlyDirective } from '../../../shared/directives/numeric-only.directive';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchableDropdownComponent,
    NumericOnlyDirective
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  groups: DropdownOption[] = [];
  isLoading = false;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
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
    if (this.employeeForm.invalid) {
      Object.keys(this.employeeForm.controls).forEach(key => {
        this.employeeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.employeeForm.value;

    const employee = {
      ...formValue,
      birthDate: new Date(formValue.birthDate),
      basicSalary: Number(formValue.basicSalary)
    };

    this.employeeService.addEmployee(employee).subscribe({
      next: () => {
        this.notificationService.showSuccess('Employee added successfully');
        this.router.navigate(['/app/employees']);
      },
      error: () => {
        this.notificationService.showError('Failed to add employee');
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/app/employees']);
  }
}
