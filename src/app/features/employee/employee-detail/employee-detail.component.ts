import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Employee } from '../../../shared/models';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RupiahPipe, DateFormatPipe],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadEmployee();
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
        } else {
          this.notificationService.showError('Employee not found');
          this.router.navigate(['/app/employees']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load employee');
        this.router.navigate(['/app/employees']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/app/employees']);
  }

  getStatusClass(): string {
    if (!this.employee) return '';
    switch (this.employee.status) {
      case 'Active': return 'active';
      case 'Inactive': return 'inactive';
      case 'Pending': return 'pending';
      default: return '';
    }
  }
}
