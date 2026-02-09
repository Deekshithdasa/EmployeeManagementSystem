import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/services/employee';

@Component({
  selector: 'app-employee-update',
  standalone: false,
  templateUrl: './employee-update.html',
  styleUrls: ['./employee-update.css'],
})
export class EmployeeUpdate implements OnInit {
  fb = inject(FormBuilder);
  es = inject(EmployeeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  employee: any = null;
  notFound: boolean = false;
  allEmployees: any[] = [];
  isEditing: boolean = false;
  isSaving: boolean = false;
  updateMessage: string = '';

  updateForm = this.fb.group({
    name: ['', [Validators.minLength(5), Validators.maxLength(25)]],
    gender: [''],
    email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@wipro\.co\.in$/)]],
    department: [''],
    basicSalary: [0, [Validators.min(5000), Validators.max(5000000)]],
    dateOfJoin: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.searchById(id);
    }
  }

  searchById(id: number) {
    this.es.getEmployeeById(id).subscribe(
      (data: any) => {
        this.employee = data;
        this.populateForm(data);
        this.cdr.detectChanges();
      },
      (err: any) => {
        console.error('Failed to fetch employee by id:', err);
        this.notFound = true;
      }
    );
  }

  viewAllEmployees() {
    this.es.getAllEmployees().subscribe((list: any[]) => {
      this.allEmployees = list;
      this.cdr.detectChanges();
      console.log('All employees:', this.allEmployees);
    });
  }

  search(query: string) {
    if (!query || !query.trim()) {
      this.notFound = true;
      this.employee = null;
      this.isEditing = false;
      return;
    }

    const q = query.trim().toLowerCase();
    console.log('Searching for employee:', q);

    this.es.getAllEmployees().subscribe(
      (list: any[]) => {
        console.log('Received list:', list);

        if (!list || list.length === 0) {
          this.notFound = true;
          this.employee = null;
          this.isEditing = false;
          return;
        }

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
          console.log('Found employee:', found);
          this.employee = found;
          this.notFound = false;
          this.isEditing = false;
          this.populateForm(found);
          this.cdr.detectChanges();
        } else {
          console.log('No employee found');
          this.employee = null;
          this.notFound = true;
          this.isEditing = false;
          this.cdr.detectChanges();
        }
      },
      (error: any) => {
        console.error('Service error:', error);
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
            this.isEditing = false;
            this.populateForm(found);
            this.cdr.detectChanges();
          } else {
            this.employee = null;
            this.notFound = true;
            this.isEditing = false;
            this.cdr.detectChanges();
          }
        } catch (e) {
          console.error('Local storage error:', e);
          this.employee = null;
          this.notFound = true;
          this.isEditing = false;
        }
      }
    );
  }

  populateForm(emp: any) {
    this.updateForm.patchValue({
      name: emp.name,
      gender: emp.gender,
      email: emp.email,
      department: emp.department,
      basicSalary: emp.salary || emp.basicSalary,
      dateOfJoin: emp.dateOfJoin
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.updateMessage = '';
  }

  cancel() {
    this.isEditing = false;
    this.updateMessage = '';
    this.populateForm(this.employee);
  }

  save() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      this.updateMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSaving = true;
    const formData = this.updateForm.getRawValue();
    const payload: any = {
      id: this.employee.id,
      name: String(formData.name || ''),
      gender: String(formData.gender || ''),
      email: String(formData.email || ''),
      dateOfJoin: formData.dateOfJoin,
      salary: Number(formData.basicSalary),
      department: String(formData.department || '')
    };

    console.log('Updating employee with payload:', payload);

    this.es.updateEmployee(this.employee.id, payload).subscribe(
      (response: any) => {
        console.log('Update successful:', response);
        this.employee = payload;
        this.isEditing = false;
        this.isSaving = false;
        this.updateMessage = 'Employee updated successfully!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.updateMessage = '';
        }, 3000);
      },
      (error: any) => {
        console.error('Update failed:', error);
        this.isSaving = false;
        this.updateMessage = 'Failed to update employee';
        this.cdr.detectChanges();
      }
    );
  }
}
