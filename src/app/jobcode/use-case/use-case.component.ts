import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-use-case',
  templateUrl: './use-case.component.html',
  styleUrls: ['./use-case.component.sass']
})
export class UseCaseComponent implements OnInit {

  myDate: any;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredJobs:any;
  rows:any

  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      field1: [''],
      field2: [{ value: '', disabled: false }] // Set initial state
    });
  }

  ngOnInit(): void {
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
    this.filteredJobs = this.rows;
  }

  onField1Change() {
    const selectedValue = this.myForm.get('field1')?.value;

    if (selectedValue === '1') {
      this.myForm.get('field2')?.setValue('2'); // Set to null
      this.myForm.get('field2')?.disable(); // Disable field
    } else {
      this.myForm.get('field2')?.enable(); // Enable field
    }
  }

  onSubmit() {
    console.log(this.myForm.getRawValue()); // Ensures disabled field value is included
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.rows = [
      { jobCode: 1, roleTitle: 'Developer', reportingToManager: 'John Doe', experience: '2-5 years', ctc: '5-10 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 2, roleTitle: 'Designer', reportingToManager: 'Jane Smith', experience: '3-6 years', ctc: '4-8 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 3, roleTitle: 'Tester', reportingToManager: 'James Bond', experience: '1-3 years', ctc: '3-6 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 4, roleTitle: 'Project Manager', reportingToManager: 'Emma Watson', experience: '5-8 years', ctc: '10-15 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 5, roleTitle: 'Business Analyst', reportingToManager: 'Olivia Miller', experience: '4-7 years', ctc: '8-12 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 6, roleTitle: 'HR Manager', reportingToManager: 'Ava Johnson', experience: '6-10 years', ctc: '12-18 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 7, roleTitle: 'System Administrator', reportingToManager: 'Liam Brown', experience: '3-5 years', ctc: '6-9 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 8, roleTitle: 'Graphic Designer', reportingToManager: 'Isabella Taylor', experience: '2-4 years', ctc: '4-7 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 9, roleTitle: 'DevOps Engineer', reportingToManager: 'Ethan Davis', experience: '4-6 years', ctc: '9-13 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 10, roleTitle: 'Data Scientist', reportingToManager: 'Charlotte Martin', experience: '3-5 years', ctc: '7-12 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 11, roleTitle: 'Software Engineer', reportingToManager: 'Amelia Garcia', experience: '1-4 years', ctc: '4-8 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 12, roleTitle: 'QA Engineer', reportingToManager: 'Benjamin Clark', experience: '2-4 years', ctc: '5-9 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 13, roleTitle: 'Sales Manager', reportingToManager: 'Sofia Rodriguez', experience: '5-9 years', ctc: '10-15 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 14, roleTitle: 'Accountant', reportingToManager: 'Mason White', experience: '2-5 years', ctc: '6-8 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 15, roleTitle: 'Content Writer', reportingToManager: 'Amelia Harris', experience: '1-3 years', ctc: '3-5 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 16, roleTitle: 'Network Engineer', reportingToManager: 'Jack Wilson', experience: '3-6 years', ctc: '6-10 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 17, roleTitle: 'Cloud Engineer', reportingToManager: 'Emily Lee', experience: '4-7 years', ctc: '8-12 LPA', status: 'Inactive', view: 'View Details' },
      { jobCode: 18, roleTitle: 'Web Developer', reportingToManager: 'Lucas Harris', experience: '2-5 years', ctc: '5-9 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 19, roleTitle: 'Cyber Security Analyst', reportingToManager: 'Mia Young', experience: '5-8 years', ctc: '10-15 LPA', status: 'Active', view: 'View Details' },
      { jobCode: 20, roleTitle: 'SEO Specialist', reportingToManager: 'Alexander Hall', experience: '2-4 years', ctc: '4-7 LPA', status: 'Inactive', view: 'View Details' }
    ];

    // Perform sorting
    this.rows.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Compare values and return the appropriate order based on direction
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return 0; // If data types are different, don't sort
      }
    });
  }

}
