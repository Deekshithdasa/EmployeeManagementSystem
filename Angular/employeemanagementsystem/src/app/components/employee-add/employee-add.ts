import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/services/employee';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee-add',
  standalone: false,
  templateUrl: './employee-add.html',
  styleUrls: ['./employee-add.css'],
})
export class EmployeeAdd {
  fb:FormBuilder=inject(FormBuilder);
  es:EmployeeService=inject(EmployeeService);
  router:Router=inject(Router);
  
  employeeForm = this.fb.group({
    name: ['', [Validators.minLength(5), Validators.maxLength(25)]],
    gender: [''],
    email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@wipro\.co\.in$/)]],
    department: [''],
    basicSalary: [0, [Validators.min(5000), Validators.max(5000000)]],
    dateOfJoin: [new Date()]
  });

   public get employeeData(): any{
    return this.employeeForm;
   }

   add(emp:any){
    console.log(emp)
      if (this.employeeForm.invalid) {
        this.employeeForm.markAllAsTouched();
        return;
      }

const payload = {
      name: emp.name,
      gender: emp.gender,
      email: emp.email,
      dateOfJoin: emp.dateOfJoin,
      salary: emp.basicSalary,
        department: emp.department
      };

      console.log('Adding employee payload:', payload);

      this.es.addEmployee(payload).subscribe(
        (serverdata: any) => {
          console.log('Add success:', serverdata);
          this.router.navigate(['/list']);
        },
        (err: any) => {
          console.error('Add failed:', err);
          const serverMsg = err?.error ? JSON.stringify(err.error) : err?.message || err?.statusText || 'Unknown error';
          alert('Failed to add employee: ' + serverMsg);
        }
      );
   }



}