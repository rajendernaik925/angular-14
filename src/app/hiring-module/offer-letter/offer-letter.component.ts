import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.sass']
})
export class OfferLetterComponent implements OnInit {

  columns: { key: string; label: string; center?: boolean; uppercase?: boolean; clickable?: boolean; minKey?: string; maxKey?: string }[] = [];
  rows: any[] = [];
  originalRows: any[] = [];
  searchQuery: FormControl = new FormControl();
  filteredRows: any[] = [];
  filterOffcanvas: any;
  isOpen = false;
  private dialogRef: any;
  candidateData: any = null;
  isLoading: boolean = false;
  audio: any;
  currentPage = 1;
  pageSize = 10;
  comapnyLogo: string = 'assets/img/icons/company-name.png'
  @ViewChild('aboutCandidateDialog', { static: true }) aboutCandidateDialog!: TemplateRef<any>;
  searchQueryText: string;
  colorTheme = 'theme-dark-blue';




  constructor(
    private render: Renderer2,
    private dialog: MatDialog,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.offerCandidates();
    this.generateColumns();
    // this.generateRows();

    // this.filteredRows = [...this.rows];

    this.searchQuery.valueChanges.subscribe((value: string) => {
      console.log(value);
      this.currentPage = 1;
      this.searchQueryText = value.trim().toLowerCase(); // Store search text
      this.filterRows(value);
    });
  }

  offerCandidates() {
    this.isLoading = true;
  
    this.authService.offerCandidates().subscribe({
      next: (res: any) => {
        console.log("hold candidates : ", res);
        this.isLoading = false;
  
        this.rows = res.map((item: any, index: number) => ({
          jobcodeId: item.jobcodeId || 'N/A',
          jcReferanceId: item.jcReferanceId || 'N/A',
          employeeId: item.employeeId || 'N/A',
          name: item.candidateName || 'N/A',
          jobTitleName: item.jobTitleName || 'N/A',
          deptName: item.deptName || 'N/A',
          expectedCtc: item.expectedCtc || 'N/A',
          joiningDate: item.joiningDate ? moment(item.joiningDate).format('YYYY-MM-DD') : null,
          status: item.status || 'N/A'
        }));
  
        // ✅ Ensure at least 100 dummy entries
        // let currentLength = this.rows.length;
        // while (this.rows.length < 5000) {
        //   const dummyIndex = this.rows.length + 1;
        //   this.rows.push({
        //     jobcodeId: 1000 + dummyIndex,
        //     jcReferanceId: `JC${1000 + dummyIndex}`,
        //     employeeId: `DUMMY-${dummyIndex}`,
        //     name: `Candidate ${dummyIndex}`,
        //     jobTitleName: `Job Title ${dummyIndex}`,
        //     deptName: `Dept ${dummyIndex}`,
        //     expectedCtc: `${Math.floor(Math.random() * 10 + 3)} LPA`,
        //     joiningDate: moment().add(dummyIndex, 'days').format('YYYY-MM-DD'),
        //     status: 'N/A'
        //   });
        // }
  
        this.originalRows = [...this.rows];
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Error fetching candidates:', err);
      }
    });
  }
  




  generateColumns() {
    this.columns = [
      { key: 'jcReferanceId', label: 'Job Code', uppercase: true },
      { key: 'expectedCtc', label: 'Propoesed CTC', uppercase: true },
      { key: 'name', label: 'Candidate Name', uppercase: true },
      { key: 'deptName', label: 'Dept Name', uppercase: true },
      // { key: 'jobTitleName', label: 'Job Title', uppercase: true },
      { key: 'joiningDate', label: 'Actual Date Of Join (editable)', uppercase: true },
      // { key: 'reportingManager', label: 'Reporting Manager', uppercase: true },
      // { key: 'createdBy', label: 'Created By', uppercase: true },
      // { key: 'status', label: 'Status', uppercase: true },
      { key: 'employeeId', label: 'Action', center: true, clickable: true }
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
    const highlightedText = String(text).replace(regex, `<span class="badge text-white" style="font-weight: bold; background-color: #198754;">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  handleAction(employeeId: any, joiningDate:any) {
    console.log("employeeId : ",employeeId, "joiningDate: ",joiningDate);
    Swal.fire({
      title: 'Success',
      text: 'need to implement',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    })

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

  formatTime(time: string): string {
    if (!time) return '';
    const [hour, minute] = time.split(':').map(Number);
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  sendRemainder() {
    Swal.fire({
      title: 'Success',
      text: 'Remainder Sent',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    })
    this.close()
  }

  get paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  get startIndex() {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex() {
    return Math.min(this.currentPage * this.pageSize, this.rows.length);
  }

  goBack() {
    window.history.back();
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // Handle the date change and update the row data
  onDateChange(date: string, row: any, key: string): void {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    row[key] = formattedDate;

    if (key === 'joiningDate') {
      this.updateJoiningDate(row.employeeId, formattedDate);
    }
  }


  updateJoiningDate(employeeId: string, joiningDate: string): void {
    this.isLoading= true;
    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('doj', joiningDate);

    this.authService.updateJoingDate(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Updated successfully');
        Swal.fire({
          title: 'Success',
          text: 'Date Updated Successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        this.offerCandidates();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'OOPS',
          text: 'Date Is not updated',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  }







}


