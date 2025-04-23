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
  minDate: Date = new Date();
  colorTheme = 'theme-dark-blue';
  timeSlots: string[] = [];
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
      meetingLink: [
        '',
        [
          Validators.required, // Makes the field required
          Validators.pattern(/^(https?:\/\/)(www\.)?(zoom\.us|teams\.microsoft\.com|meet\.google\.com)\/.*/), // URL pattern for Zoom, Teams, and Google Meet
        ]
      ],
    });
  }



  ngOnInit() {

    // const lastReloadDate = localStorage.getItem('lastReloadDate');
    // const today = new Date().toISOString().split('T')[0]; 

    // if (lastReloadDate !== today) {
    //   localStorage.setItem('lastReloadDate', today);
    //   window.location.reload();
    // }

    this.generateTimeSlots();
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
  isDialogOpen = false;

  handleAction(employeeId: any) {
    if (this.isDialogOpen) return; // prevent double open
    this.isDialogOpen = true;

    this.interviewedByList = [];
    this.employeeId = employeeId;
    this.addNewRoundForm.reset();

    this.dialogRef = this.dialog.open(this.interviewDialog, {
      width: '400px',
      height: 'auto',
      hasBackdrop: true,
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
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


  generateTimeSlots() {
    this.timeSlots = []; // Clear existing slots if needed
    const interval = 15; // 15-minute intervals

    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += interval) {
        const h = hour.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        this.timeSlots.push(`${h}:${m}`);
      }
    }
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
    if (this.isDialogOpen) return; // Prevent double open
    this.isDialogOpen = true;
    this.isLoading = true;
    this.employeeId = id;
    this.close();

    this.authService.registeredData(id).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const recordLength = res?.candidateInterviewDetails?.length || 0;
        const lastRecordStatus = recordLength
          ? res.candidateInterviewDetails[recordLength - 1].status
          : null;

        this.roundNo = (lastRecordStatus === 1001 || lastRecordStatus === 1002 || lastRecordStatus === 1006)
          ? recordLength
          : recordLength + 1;

        const lastRecordInterviewerName = recordLength
          ? res.candidateInterviewDetails[recordLength - 1].interviewBy
          : null;


        this.interviewScheduleTo = lastRecordInterviewerName;

        this.candidateData = res || {};
        this.candidateData.candidateEducationDetails = this.candidateData.candidateEducationDetails || [];

        this.openDialog();
      },
      error: (err) => {
        this.isLoading = false;
        this.isDialogOpen = false;
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
      this.isDialogOpen = false;
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

  feedbackView(interview: any, name:any, mail:any) {
      const feedBackformat = interview.candidateInterviewFeedBackDTO || [];
      const comments = interview.comments;
    
      const scoreMap: any = {
        'Excellent': 10,
        'Good': 8,
        'Average': 6,
        'Below Average': 4
      };
    
      let totalScore = 0;
    
      const feedbackRows = feedBackformat.map((item: any, index: number) => {
        const getMark = (level: string) =>
          item.feedBackName === level
            ? '<span style="color:green;">✔️</span>'
            : '<span style="color:red;">❌</span>';
    
        totalScore += scoreMap[item.feedBackName] || 0;
    
        return `
          <tr>
            <td>${index + 1}</td>
            <td class="text-start">${item.factorName}</td>
            <td>${getMark('Excellent')}</td>
            <td>${getMark('Good')}</td>
            <td>${getMark('Average')}</td>
            <td>${getMark('Below Average')}</td>
          </tr>
        `;
      }).join('');
    
      const averageScore = (feedBackformat.length > 0)
        ? (totalScore / feedBackformat.length).toFixed(2)
        : 'N/A';
    
      const detailsHtml = `
        <div style="font-size:12px; width:100%;">
          <div style="margin-bottom: 10px;">
            <h5 style="margin: 0;">Interview Feedback</h5>
          </div>
    
          <div class="table-responsive">
            <table class="table table-bordered table-sm w-100">
              <tbody>
              <tr>
                  <th>Candidate Name</th>
                  <td>${name ? name.charAt(0).toUpperCase() + name.slice(1) : '--'}</td>
                  <th>Mail Id</th>
                  <td>${mail || '--'}</td>
                </tr>
                <tr>
                  <th>Interviewer Name</th>
                  <td>${interview.interviewByName || 'N/A'} - ${interview.interviewBy || ''}</td>
                  <th>Interview Date</th>
                  <td>${interview.interviewDate || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Interview Time</th>
                  <td>${interview.interviewTime || 'N/A'}</td>
                  <th>Round Name</th>
                  <td>${interview.interviewRoundName || 'Initial'}</td>
                </tr>
                <tr>
                  <th>Level</th>
                  <td>${interview.level || 'N/A'}</td>
                  <th>Mode</th>
                  <td>${interview.modeName || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
    
          <div class="table-responsive">
            <table class="table table-bordered table-sm w-100 text-center">
              <thead class="table-dark">
                <tr>
                  <th style="font-size: 12px;">S.No</th>
                  <th style="font-size: 12px;">Factors</th>
                  <th style="font-size: 12px;">Excellent</th>
                  <th style="font-size: 12px;">Good</th>
                  <th style="font-size: 12px;">Average</th>
                  <th style="font-size: 12px;">Below Average</th>
                </tr>
              </thead>
              <tbody>
                ${feedbackRows}
              </tbody>
            </table>
            <div class="mt-1 text-right font-weight-bold">
            Average Score: ${averageScore}
          </div>
  
          </div>
    
          <div style="margin-top: 10px; text-align: left;">
            <strong>Comments:</strong>
            <p style="text-align: left; margin-top: 5px;">${comments || 'No comments available.'}</p>
          </div>
        </div>
      `;
    
      Swal.fire({
        html: detailsHtml,
        width: '900px',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
          popup: 'p-3'
        },
        buttonsStyling: false
      });
    }

}
