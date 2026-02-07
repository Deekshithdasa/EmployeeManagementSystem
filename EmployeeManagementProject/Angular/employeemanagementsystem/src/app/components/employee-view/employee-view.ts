import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/services/employee';


@Component({
  selector: 'app-employee-view',
  standalone: false,
  templateUrl: './employee-view.html',
  styleUrls: ['./employee-view.css'],
})
export class EmployeeView implements OnInit {

  route = inject(ActivatedRoute);
  es = inject(EmployeeService);
  cdr = inject(ChangeDetectorRef);

  employee: any;
  notFound: boolean = false;
  allEmployees: any[] = [];
  employeesByDepartment: any[] = [];
  searchMode: string = 'employee'; // 'employee' or 'department'

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.es.getEmployeeById(id).subscribe((data: any) => {
        this.employee = data;
      });
    }
  }

  viewAllEmployees() {
    this.es.getAllEmployees().subscribe((list: any[]) => {
      this.allEmployees = list;
      this.cdr.detectChanges();
      console.log('All employees:', this.allEmployees);
    });
  }

  searchByDepartment(query: string) {
    if (!query || !query.trim()) {
      this.notFound = true;
      this.employeesByDepartment = [];
      this.searchMode = 'employee';
      return;
    }

    const q = query.trim().toLowerCase();
    console.log('=== SEARCHING BY DEPARTMENT ===', q);

    this.es.getAllEmployees().subscribe(
      (list: any[]) => {
        console.log('Received list:', list);

        if (!list || list.length === 0) {
          this.notFound = true;
          this.employeesByDepartment = [];
          console.log('List is empty');
          return;
        }

        // Filter all employees with matching department
        this.employeesByDepartment = list.filter((emp: any) => {
          const empDept = (emp.department || '').toString().toLowerCase().trim();
          const matches = empDept === q;
          console.log('Checking department:', empDept, 'vs', q, 'Match:', matches);
          return matches;
        });

        if (this.employeesByDepartment.length > 0) {
          console.log('=== FOUND EMPLOYEES IN DEPARTMENT ===', this.employeesByDepartment);
          this.notFound = false;
          this.searchMode = 'department';
          this.employee = null;
          this.cdr.detectChanges();
        } else {
          console.log('=== NO EMPLOYEES FOUND IN DEPARTMENT ===');
          this.employeesByDepartment = [];
          this.notFound = true;
          this.searchMode = 'department';
          this.employee = null;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.notFound = true;
        this.employeesByDepartment = [];
        this.cdr.detectChanges();
      }
    );
  }

  search(query: string) {
    if (!query || !query.trim()) {
      this.notFound = true;
      this.employee = null;
      this.employeesByDepartment = [];
      this.searchMode = 'employee';
      return;
    }

    const q = query.trim().toLowerCase();
    console.log('=== SEARCHING FOR ===', q);

    this.es.getAllEmployees().subscribe(
      (list: any[]) => {
        console.log('Received list:', list);

        if (!list || list.length === 0) {
          this.notFound = true;
          this.employee = null;
          console.log('List is empty');
          return;
        }

        // Search by email (exact match)
        let found = list.find((e: any) => {
          const empEmail = (e.email || '').toString().toLowerCase().trim();
          const matches = empEmail === q;
          console.log('Checking email:', empEmail, 'vs', q, 'Match:', matches);
          return matches;
        });

        // If not found by email, search by name (exact match)
        if (!found) {
          found = list.find((e: any) => {
            const empName = (e.name || '').toString().toLowerCase().trim();
            const matches = empName === q;
            console.log('Checking name:', empName, 'vs', q, 'Match:', matches);
            return matches;
          });
        }

        // If still not found, try partial match
        if (!found) {
          found = list.find((e: any) => {
            const empEmail = (e.email || '').toString().toLowerCase();
            const empName = (e.name || '').toString().toLowerCase();
            const matches = empEmail.includes(q) || empName.includes(q);
            console.log('Partial match - Email:', empEmail, 'Name:', empName, 'Query:', q, 'Match:', matches);
            return matches;
          });
        }

        if (found) {
          console.log('=== FOUND EMPLOYEE ===', found);
          this.employee = found;
          this.employeesByDepartment = [];
          this.notFound = false;
          this.searchMode = 'employee';
          this.cdr.detectChanges();
        } else {
          console.log('=== NO EMPLOYEE FOUND ===');
          this.employee = null;
          this.employeesByDepartment = [];
          this.notFound = true;
          this.searchMode = 'employee';
          this.cdr.detectChanges();
        }
      },
      (error: any) => {
        console.error('Service error:', error);
        // Try local storage fallback
        try {
          const raw = localStorage.getItem('employees_local') || '[]';
          const list = JSON.parse(raw);
          console.log('Using local storage:', list);

          let found = list.find((e: any) => {
            const empEmail = (e.email || '').toString().toLowerCase().trim();
            return empEmail === q;
          });

          if (!found) {
            found = list.find((e: any) => {
              const empName = (e.name || '').toString().toLowerCase().trim();
              return empName === q;
            });
          }

          if (!found) {
            found = list.find((e: any) => {
              const empEmail = (e.email || '').toString().toLowerCase();
              const empName = (e.name || '').toString().toLowerCase();
              return empEmail.includes(q) || empName.includes(q);
            });
          }

          if (found) {
            console.log('Found in local storage:', found);
            this.employee = found;
            this.notFound = false;
            this.cdr.detectChanges();
          } else {
            this.employee = null;
            this.notFound = true;
            this.cdr.detectChanges();
          }
        } catch (e) {
          console.error('Local storage error:', e);
          this.employee = null;
          this.notFound = true;
        }
      }
    );
  }
}
