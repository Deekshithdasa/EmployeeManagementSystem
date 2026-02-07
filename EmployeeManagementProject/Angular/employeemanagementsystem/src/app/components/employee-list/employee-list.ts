import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/services/employee';



@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
})

export class EmployeeList implements OnInit {

  es = inject(EmployeeService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  employees: any[] = [];

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    // Then refresh from server (or merged server+local from service)
    this.es.getAllEmployees().subscribe((data: any) => {
      this.employees = data;
      this.cdr.detectChanges();
      console.log('Employees loaded:', this.employees);
    }, (err: any) => {
      console.error('Failed loading employees from service', err);
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.es.deleteEmployee(id).subscribe(
        () => {
          console.log('Employee deleted successfully, id:', id);
          this.loadEmployees();
          this.cdr.detectChanges();
        },
        (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete employee');
        }
      );
    }
  }

  view(id: number) {
    this.router.navigate(['/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/update', id]);
  }
}
