import { AuthService } from 'src/app/auth.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-jobcode',
  templateUrl: './jobcode.component.html',
  styleUrls: ['./jobcode.component.sass', './jobcode.component.css']
})
export class JobcodeComponent implements OnInit {
  userData: any;
  sublocation: any;
  myDate: any;
  filteredJobs: any;
  rows: any;
  jobs: any[] = [];
  isLoading: boolean = false;
  sortColumn: string = '';
  jobCodeId: number | null = null;
  bindDataValue: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  managers: any;
  teams: any;
  jobTitleList: any[] = [];
  selectedManager: any;;
  searchTerm: string = null;
  submitted = false;
  yearMessage: string = null
  ctcMessage: string = null
  managerMessage: string = null;
  uploadedFile: File | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQueryText: string = '';
  dataNotFound: string = 'assets/img/icons/not-found.gif'
  @ViewChild('jobDialog', { static: true }) jobDialog!: TemplateRef<any>;
  @ViewChild('publishDialog', { static: true }) publishDialog!: TemplateRef<any>;

  private dialogRef: any;

  createJobForm!: FormGroup;
  searchQuery: FormControl = new FormControl();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.initializeForm();
    this.totalJobCodes();
    this.listOfManagers();
    this.listOfTeams();
    this.jobTitle();
    this.userData = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem('userData') || '')));
    console.log("user data : ",this.userData.user.empID);
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate') || ''));

    this.searchQuery.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        catchError((error) => {
          console.error('Error while searching:', error);
          return of('');
        })
      )
      .subscribe((value: string) => {
        // Always call API if value is cleared OR length is >= 2
        if (value.length === 0 || value.length >= 2) {
          this.searchQueryText = value;
          this.currentPage = 1;
          this.totalJobCodes();
        }
      });

    this.createJobForm.get('jobExperienceMinYear')?.valueChanges.subscribe((value) => {
      this.yearMessage = '';
    });

    this.createJobForm.get('jobExperienceMaxYear')?.valueChanges.subscribe((value) => {
      this.yearMessage = '';
    });

    this.createJobForm.get('jobCtcMin')?.valueChanges.subscribe((value) => {
      this.ctcMessage = '';
    });

    this.createJobForm.get('jobCtcMax')?.valueChanges.subscribe((value) => {
      this.ctcMessage = '';
    });
    this.createJobForm.get('jobReportingManager')?.valueChanges.subscribe((value) => {
      this.managerMessage = '';
    });
  }

  highlightMatch(text: any): SafeHtml {
    if (!this.searchQueryText || !text) return text;
    const escapedQuery = this.searchQueryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const highlightedText = String(text).replace(regex, `<span class="text-primary" style="font-weight: bold;">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  initializeForm() {
    this.createJobForm = this.fb.group({
      jobTitle: ['', [Validators.required]],
      jobReportingManagerId: ['', [Validators.required]],
      teamId: [''],
      jobExperienceMinYear: [null, Validators.required],
      jobExperienceMaxYear: [null, Validators.required],
      jobCtcMin: [null, Validators.required],
      jobCtcMax: [null, Validators.required],
      jobPreferableCompanies: [''],
      jobDescription: [null],
      jobDescriptionFile: [{ value: null, disabled: false }, Validators.required]
    });
    { validators: [this.ctcRangeValidator, this.experienceRangeValidator] }
  }

  listOfManagers(): void {
    this.isLoading = true;
    this.authService.ReportingManagers().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.managers = res;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log("Error fetching managers:", err);
      }
    });
  }

  listOfTeams(): void {
    this.isLoading = true;
    this.authService.listofTeams().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.teams = res;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log("Error fetching managers:", err);
      }
    });
  }

  jobTitle(): void {
    this.isLoading = true;
    this.authService.jobTitle().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.jobTitleList = res;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log("Error fetching managers:", err);
      }
    });
  }

  totalJobCodes() {
    this.isLoading = true;
    const pageNo = this.currentPage || 1;
    const pageSize = this.pageSize || 10;
    const searchQuery = this.searchQueryText?.trim() || '';
  
    this.authService.getTotalJobCodes(pageNo, pageSize, searchQuery).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.rows = res.list || [];
        this.filteredJobs = [...this.rows];
        // Set totalRecords based on API response
        this.totalRecords = res.totalCount ?? this.rows.length;
  
        // ✅ Reset Page to 1 if No Data
        if (this.totalRecords === 0) {
          this.currentPage = 1;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error("Error fetching job codes:", err.message);
      }
    });
  }
  
  
  onSelected(event: Event) {
    this.selectedManager = this.createJobForm.get('jobReportingManager')?.value;
  }

  createJob() {
    this.createJobForm.reset();
    this.submitted = false;
    this.ctcMessage = '';
    this.yearMessage = '';
    this.managerMessage = '';

    this.dialogRef = this.dialog.open(this.jobDialog, {
      width: '600px',
      height: 'auto',
      hasBackdrop: true
    });

    // Patch form values (if necessary)
    this.createJobForm.patchValue({
      jobReportingManager: 0
    });
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadedFile = file;
      const fileBlob = new Blob([file], { type: file.type });
      this.createJobForm.patchValue({ resume: fileBlob });
      this.createJobForm.get('jobDescriptionFile')?.updateValueAndValidity();
    } else {
      console.log('No file selected.');
    }
  }

  ctcRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const min = group.get('jobCtcMin')?.value;
    const max = group.get('jobCtcMax')?.value;
    if (min != null && max != null && min >= max) {
      return { invalidCtcRange: true };
    }
    return null;
  }

  experienceRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const minExp = group.get('jobExperienceMinYear')?.value;
    const maxExp = group.get('jobExperienceMaxYear')?.value;
    if (minExp != null && maxExp != null && (minExp >= maxExp || maxExp > 100)) {
      return { invalidExperienceRange: true };
    }
    return null;
  }

  onSubmit() {
  console.log("Form submitted.");

  this.submitted = true;
  this.isLoading = true;

  // Clear previous validation messages
  this.ctcMessage = '';
  this.yearMessage = '';
  this.managerMessage = '';

  // Defensive default values
  const expMin = +this.createJobForm.get('jobExperienceMinYear')?.value || 0;
  const expMax = +this.createJobForm.get('jobExperienceMaxYear')?.value || 0;
  const ctcMin = +this.createJobForm.get('jobCtcMin')?.value || 0;
  const ctcMax = +this.createJobForm.get('jobCtcMax')?.value || 0;
  const managerSelected = this.createJobForm.get('jobReportingManagerId')?.value;

  let isValid = true;

  // Experience validation
  if (expMax <= expMin) {
    this.yearMessage = 'Experience Max must be greater than Experience Min';
    isValid = false;
  }

  // CTC validation
  if (ctcMax <= ctcMin) {
    this.ctcMessage = 'CTC Max must be greater than CTC Min';
    isValid = false;
  }

  // Manager selection validation
  if (!managerSelected) {
    this.managerMessage = 'Please select a reporting manager';
    isValid = false;
  }

  // Stop if validation fails
  if (!isValid) {
    this.isLoading = false;
    console.warn("Validation failed. Submission stopped.");
    return;
  }

  // Prepare the JSON payload
  const jobPayload = {
    jobTitle: this.createJobForm.get('jobTitle')?.value || '',
    teamId: this.createJobForm.get('teamId')?.value || '',
    reportingId: managerSelected,
    ctcMin: ctcMin.toString(),
    ctcMax: ctcMax.toString(),
    expMin: expMin.toString(),
    expMax: expMax.toString(),
    preferredCompany: this.createJobForm.get('jobPreferableCompanies')?.value || '',
    description: this.createJobForm.get('jobDescription')?.value || '',
    createdBy: this.userData?.user?.empID || ''
  };

  console.log("Prepared JSON Payload:", jobPayload);

  // FormData for submission
  const formData = new FormData();
  formData.append('data', JSON.stringify(jobPayload));

  if (this.uploadedFile) {
    formData.append('file', this.uploadedFile, this.uploadedFile.name);
    console.log("Attached file:", this.uploadedFile.name);
  }

  console.log("Submitting job creation request...");

  this.authService.createJobCode(formData).subscribe({
    next: (res: HttpResponse<any>) => {
      this.isLoading = false;
      console.log("API Response status:", res?.status);

      if (res?.status === 200) {
        this.closeDialog();
        Swal.fire({
          title: 'Success',
          text: 'Job Code Creation is Successful.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        this.totalJobCodes();
      }
    },
    error: (err: HttpErrorResponse) => {
      this.isLoading = false;
      console.error("Error from API:", err);

      Swal.fire({
        title: 'Error',
        text: err?.error?.message || 'Something went wrong!',
        icon: 'error',
        showConfirmButton: true
      });
    }
  });
}


  // onSubmit() {
  //   this.submitted = true;
  //   this.isLoading = true;
  //   this.ctcMessage = '';
  //   this.yearMessage = '';
  //   this.managerMessage = '';

  //   // Validation
  //   const expMin = this.createJobForm.get('jobExperienceMinYear')?.value || 0;
  //   const expMax = this.createJobForm.get('jobExperienceMaxYear')?.value || 0;
  //   const ctcMin = this.createJobForm.get('jobCtcMin')?.value || 0;
  //   const ctcMax = this.createJobForm.get('jobCtcMax')?.value || 0;
  //   const managerSelected = this.createJobForm.get('jobReportingManagerId')?.value;

  //   let isValid = true;

  //   if (expMax <= expMin) {
  //     this.yearMessage = 'Experience Max must be greater than Experience Min';
  //     isValid = false;
  //   }

  //   if (ctcMax <= ctcMin) {
  //     this.ctcMessage = 'CTC Max must be greater than CTC Min';
  //     isValid = false;
  //   }

  //   if (!managerSelected) {
  //     this.managerMessage = 'Please select option';
  //     isValid = false;
  //   }

  //   if (!isValid) {
  //     return; // Stop form submission if validation fails
  //   }

  //   // **Step 1: Create JSON Payload**
  //   const jobPayload = {
  //     jobTitle: this.createJobForm.get('jobTitle')?.value || '',
  //     teamId: this.createJobForm.get('teamId')?.value || '',
  //     reportingId: managerSelected || '',
  //     ctcMin: `${ctcMin}`,
  //     ctcMax: `${ctcMax}`,
  //     expMin: `${expMin}`,
  //     expMax: `${expMax}`,
  //     preferredCompany: this.createJobForm.get('jobPreferableCompanies')?.value || '',
  //     description: this.createJobForm.get('jobDescription')?.value || '',
  //     createdBy: this.userData.user.empID || ''
  //   };

  //   console.log("Final JSON Payload:", jobPayload);

  //   const jsonString = JSON.stringify(jobPayload);
  //   const formData = new FormData();
  //   formData.append('data', jsonString);
  //   if (this.uploadedFile) {
  //     formData.append('file', this.uploadedFile, this.uploadedFile.name); // Attach file
  //   }

  //   console.log("Final FormData:", formData);

  //   this.authService.createJobCode(formData).subscribe({
  //     next: (res: HttpResponse<any>) => {
  //       this.isLoading = false;
  //       console.log("status : ", res.status)
  //       if (res?.status === 200) { 
  //       this.closeDialog();
  //       Swal.fire({
  //         title: 'Success',
  //         text: 'Job Code Creation is Successful.',
  //         icon: 'success',
  //         showConfirmButton: false,
  //         timer: 1000,
  //         timerProgressBar: true,
  //       });
  //         this.totalJobCodes();
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.isLoading = false;
  //       console.error("Error creating job code:", err);
  //       // Swal.fire({
  //       //   title: 'OOPS',
  //       //   text: err.error.message,
  //       //   icon: 'error',
  //       //   showConfirmButton: false,
  //       //   timer: 1000,
  //       //   timerProgressBar: true,
  //       // });
  //     },
  //   });
  // }

  preventNegativeInput(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  validateNonNegative(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.includes('-')) {
      inputElement.value = inputElement.value.replace('-', '');
    }
    const maxLength = 2;
    if (inputElement.value.length > maxLength) {
      inputElement.value = inputElement.value?.slice(0, maxLength);
    }
  }

  publish() {
    this.dialog.open(this.publishDialog, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true
    });
  }

  jobCodeDetails(id: number) {
    this.jobCodeId = id;
    this.router.navigate(['/jobcode', id]);
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredJobs.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  get paginatedRows() {
    return this.filteredJobs;
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    this.totalJobCodes();
  }

  get totalPages() {
    if (this.totalRecords <= this.pageSize) {
      return 1;
    }
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get startIndex() {
    return this.totalRecords ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get endIndex() {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

}
