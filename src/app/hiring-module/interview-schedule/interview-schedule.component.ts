import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.sass']
})
export class InterviewScheduleComponent implements OnInit {

  columns: { key: string; label: string; center?: boolean; uppercase?: boolean; clickable?: boolean; minKey?: string; maxKey?: string }[] = [];
  rows: any[] = [];
  userData: any;
  searchQuery: FormControl = new FormControl();
  filteredRows: any[] = [];
  filterOffcanvas: any;
  isOpen = false;
  private dialogRef: any;
  candidateData: any = null;
  isLoading: boolean = false;
  audio: any;
  interviewRounds: any;
  interviewLocationData: any
  employeeId: string | null = null;
  userId: string | null = null;
  interviewedByList: any[] = [];
  originalRows: any[] = [];
  showDropdown: boolean = false;
  selectedInterviewerName: any;
  currentPage = 1;
  pageSize = 10;
  @ViewChild('interviewDialog', { static: true }) interviewDialog!: TemplateRef<any>;
  @ViewChild('aboutCandidateDialog', { static: true }) aboutCandidateDialog!: TemplateRef<any>;
  addNewRoundForm: FormGroup;
  searchQueryText: any;
  totalRecords: number = 0;
  totalPages: number = 1;
  colorTheme = 'theme-dark-blue';
  selectedInterviewerId: string | null = null;
  roundNo: number | null = null;
  interviewScheduleTo: string | null = null;
  // isSidebarOpen = true;
  // closeButton: boolean = true;



  constructor(
    private render: Renderer2,
    private dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.addNewRoundForm = this.fb.group({
      locationId: ['', Validators.required],
      mode: ['', Validators.required],
      interviewDate: ['', Validators.required],
      interviewTime: ['', Validators.required],
      interviewBy: ['', Validators.required],
    });
  }



  ngOnInit() {

    // const lastReloadDate = localStorage.getItem('lastReloadDate');
    // const today = new Date().toISOString().split('T')[0]; 

    // if (lastReloadDate !== today) {
    //   localStorage.setItem('lastReloadDate', today);
    //   window.location.reload();
    // }
    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);
    console.log("rajender : ", this.userData.user.empID)
    this.scheduleCandidates();
    this.generateColumns();
    // this.totalInterviewRounds();
    this.modeOfInterview();
    this.interviewLocation();
    // this.generateRows();


    this.searchQuery.valueChanges.subscribe((value: string) => {
      this.currentPage = 1;
      this.searchQueryText = value.trim().toLowerCase();
      this.scheduleCandidates();
    });
  }

  // toggleSidebar() {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }

  modeOfInterview() {
    this.authService.modeOfInterview().subscribe({
      next: (res: any) => {
        this.interviewRounds = res;
      },
      error: (err: HttpErrorResponse) => {
      }
    })
  }

  interviewLocation() {
    this.authService.interviewLocation().subscribe({
      next: (res: any) => {
        this.interviewLocationData = res;
      },
      error: (err: HttpErrorResponse) => {
      }
    })
  }

  scheduleCandidates() {
    this.isLoading = true;
    const pageNo = this.currentPage || 1;
    const pageSize = this.pageSize || 10;
    const searchQuery = this.searchQueryText?.trim() || '';

    this.authService.scheduleCandidates(pageNo, pageSize, searchQuery).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.rows = res.list?.map((item: any) => ({
          job_code: item.jcReferanceId || '--',
          email: item.email || '--',
          firstname: item.name || '--',
          // lastname: item.lastName || '--',
          mobilenumber: item.mobileNumber || '--',
          job_title: item.jobTitleName || '--',
          employeeid: item.candidateId || '--',
          status: item.status || '--',
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
      // { key: 'lastname', label: 'Last Name', uppercase: true },
      { key: 'mobilenumber', label: 'Mobile', uppercase: true },
      { key: 'job_title', label: 'Job Title', uppercase: true },
      { key: 'status', label: 'Status', uppercase: true },
      { key: 'employeeid', label: 'Action', center: true, clickable: true },
    ];
  }

  filterRows(query: string) {
    const lowerCaseQuery = query.toLowerCase().trim();
    this.searchQueryText = lowerCaseQuery; // Store for highlighting

    this.rows = this.originalRows.filter(row =>
      Object.keys(row).some(key =>
        String(row[key]).toLowerCase().includes(lowerCaseQuery)
      )
    );
  }

  highlightMatch(text: any): SafeHtml {
    if (!this.searchQueryText || !text) return text;
    const escapedQuery = this.searchQueryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const highlightedText = String(text).replace(regex, `<span style="font-weight: bold; color: #0072BC;">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
  handleAction(employeeId: any) {
    this.interviewedByList = []
    this.employeeId = employeeId
    this.addNewRoundForm.reset();
    this.dialogRef = this.dialog.open(this.interviewDialog, {
      width: '400px',
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
  onSubmit() {
    if (this.addNewRoundForm.invalid) {
      Object.keys(this.addNewRoundForm.controls).forEach((field) => {
        const control = this.addNewRoundForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formData = this.addNewRoundForm.value;
    if (formData.interviewDate) {
      const date = new Date(formData.interviewDate);
      formData.interviewDate = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
    }

    const payload = {
      ...formData,
      candidateId: this.employeeId,
      interviewScheduledBy: this.userData.user.empID,
      roundNo: this.roundNo || 1
    };

    this.isLoading = true;
    this.authService.addInterviewRound(payload).subscribe({
      next: (res: HttpResponse<any>) => {
        this.isLoading = false;
        if (res.status == 200) {
          this.close();
          this.interviewScheduleTo = '';
          this.scheduleCandidates();
          this.roundNo = 0;
          Swal.fire({
            title: 'Success',
            text: 'Interview Scheduled Successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
      }
    });
  }


  searchInterviewer(query: string) {
    if (query.trim().length < 1) {
      this.interviewedByList = [];
      return;
    }
    const formData = new FormData();
    formData.append("name", query)
    // Debounce API call
    this.authService.interviewedBy(formData).pipe(debounceTime(300)).subscribe({
      next: (res: any) => {
        this.interviewedByList = Array.isArray(res) ? res : [];
        this.showDropdown = this.interviewedByList.length > 0;
      },
      error: (err: HttpErrorResponse) => {
        this.interviewedByList = [];
      }
    });
  }


  selectInterviewer(interviewer: any) {
    this.selectedInterviewerId = interviewer.id;
    this.selectedInterviewerName = interviewer.name;
    this.addNewRoundForm.patchValue({ interviewBy: interviewer.id });

    this.showDropdown = false;
  }


  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Delay to allow item selection before hiding
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.scheduleCandidates();
    }
  }

  get startIndex(): number {
    return this.totalRecords > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


  viewAction(id: string) {
    this.isLoading = true;
    this.employeeId = id;
    this.authService.registeredData(id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log("Total Interview Rounds: ", res?.candidateInterviewDetails?.length || 0);

        const recordLength = res?.candidateInterviewDetails?.length || 0;
        const lastRecordStatus = recordLength
          ? res.candidateInterviewDetails[recordLength - 1].status
          : null;
        console.log("Last Interview Round Status:", lastRecordStatus);
        // 1001
        // 1002
        // 1003
        // 1004 approved
        // 1005
        // 1006 hold
        this.roundNo = (lastRecordStatus === 1001 || lastRecordStatus === 1002 || lastRecordStatus === 1006)
          ? recordLength
          : recordLength + 1;

        console.log("Final Round No:", this.roundNo);

        const lastRecordInterviewerName = recordLength
          ? res.candidateInterviewDetails[recordLength - 1].interviewBy
          : null;

        this.interviewScheduleTo = lastRecordInterviewerName;
        console.log("Last Interviewer Name:", lastRecordInterviewerName);





        setTimeout(() => {
          this.candidateData = res || {};
          this.candidateData.candidateEducationDetails = this.candidateData.candidateEducationDetails || [];
          console.log("Updated Education Details: ", this.candidateData?.candidateEducationDetails);
          this.openDialog();
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error fetching candidate data:", err);
      }
    });
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.aboutCandidateDialog, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true
    });

    this.dialogRef.afterClosed().subscribe(() => {
    });
  }

  cancelInterview(id: string | null | undefined) {
    if (!id) {
      console.warn("Invalid ID: Cannot cancel interview.");
      return;
    }
    this.authService.cancelInterview(id).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.close();
          this.scheduleCandidates();
          Swal.fire({
            title: 'Success',
            text: 'Cancelled Successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error cancelling interview:", err);
      }
    });
  }

  rescheduleInterview(id: string) {
    this.interviewedByList = [];
    this.employeeId = id;
    this.addNewRoundForm.reset();
    if (this.employeeId) {
      this.addNewRoundForm.patchValue({
        interviewBy: this.interviewScheduleTo
      });
      this.dialogRef = this.dialog.open(this.interviewDialog, {
        width: '400px',
        height: 'auto',
        hasBackdrop: true,
      });
    }
  }
}
