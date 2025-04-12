import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.sass']
})
export class OfferLetterComponent implements OnInit {
applyFilter() {
throw new Error('Method not implemented.');
}
  columns = [
    { key: 'job_code', label: 'Job Code', uppercase: true },
    { key: 'email', label: 'User Mail ID', uppercase: true },
    { key: 'firstname', label: 'First Name', uppercase: true },
    { key: 'lastname', label: 'Last Name', uppercase: true },
    { key: 'mobilenumber', label: 'Mobile', uppercase: true },
    { key: 'job_title', label: 'Job Title', uppercase: true },
    { key: 'employeeid', label: 'Action', center: true, clickable: true }
  ];

  offerData = {
    name: 'Rajender Naik',
    position: 'Software Engineer',
    salary: '8,00,000',
    startDate: '01-03-2025'
  };

  rows: any[] = [];
  searchQuery = new FormControl();
  isOpen = false;
  isLoading = false;
  candidateData: any = {};  
  currentPage = 1;
  pageSize = 10;
  searchQueryText: string = '';
  totalRecords: number = 0;
  totalPages: number = 1;

  @ViewChild('interviewDialog', { static: true }) interviewDialog!: TemplateRef<any>;
  private dialogRef: any;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchShortlistedCandidates();
    this.searchQuery.valueChanges.subscribe(value => {
      this.currentPage = 1;
      this.searchQueryText = value.trim();
      this.fetchShortlistedCandidates();
    });
  }

  fetchShortlistedCandidates() {
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
          lastname: '--', // No last name in API response
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

  highlightMatch(text: any): SafeHtml {
    if (!this.searchQueryText || !text) return text;
    const regex = new RegExp(`(${this.searchQueryText})`, 'gi');
    const highlightedText = String(text).replace(regex, `<span style="font-weight: bold; color: #0072BC;">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  handleAction(employeeId: any) {
    this.isLoading = true;
    this.authService.registeredData(employeeId).subscribe({
      next: (res) => {
        this.isLoading = false;
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
    this.dialogRef = this.dialog.open(this.interviewDialog, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true
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

  printOfferLetter() {
    window.print();
  }

  sendRemainder() {
    Swal.fire({
      title: 'Success',
      text: 'Reminder Sent',
      icon: 'success',
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    this.close();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.fetchShortlistedCandidates();
    }
  }

  get startIndex(): number {
    return this.totalRecords > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
}












