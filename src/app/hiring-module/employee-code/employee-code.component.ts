import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employee-code',
  templateUrl: './employee-code.component.html',
  styleUrls: ['./employee-code.component.sass']
})
export class EmployeeCodeComponent implements OnInit {

  columns: { key: string; label: string; center?: boolean; uppercase?: boolean; clickable?: boolean; minKey?: string; maxKey?: string }[] = [];
  rows: any[] = [];
  searchQuery: FormControl = new FormControl();
  filteredRows: any[] = [];
  filterOffcanvas: any;
  isOpen = false;
  private dialogRef: any;
  candidateData: any = null;
  isLoading: boolean = false;
  interviewRounds: any[] = [];
  interviewStatus: any[] = [];
  feedbackFactorsData: any[] = [];
  interviewedByList: any[] = [];
  originalRows: any[] = [];
  selectedInterviewerName: any;
  showDropdown: boolean = false;
  employeeForm: FormGroup;
  employeeId: string | null = null;
  userData: any;
  currentPage = 1;
  pageSize = 10;
  totalRecords: number = 0;
  totalPages: number = 1;
  UserId: number | null = null;
  @ViewChild('genEmpCode', { static: true }) genEmpCode!: TemplateRef<any>;
  searchQueryText: string;


  constructor(
    private render: Renderer2,
    private dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {


    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);
    console.log("user data : ", this.userData.user.empID)
    this.UserId = this.userData.user.empID;

    this.processCandidates();
    this.generateColumns();
    // this.totalInterviewRounds();
    // this.interviewstatus();
    // this.feedbackFactors();
    this.initializeForm();

    this.searchQuery.valueChanges.subscribe(value => {
      this.currentPage = 1;
      this.searchQueryText = value.trim();
      this.processCandidates();
    });
  }

  initializeForm() {
    this.employeeForm = new FormGroup({
      employeeCode: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      designation: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required)
    });
  }



  processCandidates() {
    this.isLoading = true;
    const pageNo = this.currentPage || 1;
    const pageSize = this.pageSize || 10;
    const searchQuery = this.searchQueryText?.trim() || '';

    this.authService.shortlistedCandidates(pageNo, pageSize, searchQuery).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        this.rows = res.list?.map((item: any) => ({
          job_code: item.jcReferanceId || '--',
          email: item.email || '--',
          firstname: item.name || '--',
          interviewDateTime: '--', 
          mobilenumber: item.mobileNumber || '--',
          job_title: item.jobTitleName || '--',
          employeeid: item.candidateId || '--',
        })) || [];
        this.totalRecords = Number(res.totalCount) || 0;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: () => (this.isLoading = false)
    });
  }


 

  generateColumns() {
    this.columns = [
      { key: 'job_code', label: 'Job Code', uppercase: true },
      { key: 'email', label: 'User Mail Id', uppercase: true },
      { key: 'firstname', label: 'First Name', uppercase: true },
      { key: 'mobilenumber', label: 'Mobile', uppercase: true },
      { key: 'interviewDateTime', label: 'Status', uppercase: true },
      { key: 'job_title', label: 'Job Title', uppercase: true },
      // { key: 'status', label: 'Status', center: true },
      { key: 'employeeid', label: 'Action', center: true, clickable: true }
    ];
  }
  
    highlightMatch(text: any): SafeHtml {
      if (!this.searchQueryText || !text) return text;
      const escapedQuery = this.searchQueryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      const highlightedText = String(text).replace(regex, `<span style="font-weight: bold; color: #0072BC;">$1</span>`);
      return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
    }

  handleAction(employeeId: any) {
    this.employeeId = employeeId
    this.dialogRef = this.dialog.open(this.genEmpCode, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true,
    });

  }

  close() {
    this.dialog.closeAll();
  }

  toggleOffcanvas() {
    this.isOpen = !this.isOpen;
  }

  closeOffcanvas() {
    this.isOpen = false;
  }

  applyFilter() { }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched(); // This will mark all fields as touched and show errors
      console.log('Form is invalid');
      return;
    }
    console.log('Employee Data:', this.employeeForm.value);
  }
  



  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.processCandidates();
    }
  }

  get startIndex(): number {
    return this.totalRecords > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
}
