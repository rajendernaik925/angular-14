import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-organogram',
  templateUrl: './organogram.component.html',
  styleUrls: ['./organogram.component.sass'],
})
export class OrganogramComponent implements OnInit {

  slideDirection = 100;
  hoveredCard: number | null = null;
  activeIndex: number | null = null;
  isOpen = false;
  data: any;
  activeDepartmentId: string | null = null;
  activeTeamLeadId: string | number | null = null;
  userData: any;
  teamData:any;

  @ViewChild('teamLeadsScrollContainer', { static: false }) teamLeadsScrollContainer!: ElementRef;
  @ViewChild('departmentScrollContainer', { static: false }) departmentScrollContainer!: ElementRef;

  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  teamLeadsData: any;
  teamEmpData:any;
  empId: any;
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);
    this.empId = this.userData.user.empID;
    this.listOfManagers(this.empId);
  }

  listOfManagers(EmpId: any) {
    console.log("employee id : ",this.empId)
    this.authService.listOfManagersforOrganogram(EmpId).subscribe({
      next: (res: any) => {
        console.log("res", res);
        this.data = [...res];
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err);
      }
    });
  }



  handleDoubleClick(id: any, event: Event): void {
    event.stopPropagation();
    this.isOpen = false;
    setTimeout(() => {
      this.isOpen = true;
    }, 1000);
  }

  setActive(departmentId: string, event: Event): void {
    event.stopPropagation();
    this.activeDepartmentId = departmentId;
    this.authService.listOfTeamleads(this.empId, departmentId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.teamLeadsData = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err)
      }
    })
  }

  setActive1(departmentId: string, event: Event): void {
    event.stopPropagation();
    this.activeDepartmentId = departmentId;
    this.authService.listOfTeamleads(this.empId, departmentId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.teamEmpData = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err)
      }
    })
  }

  setActiveTeamLead(id: string | number) {
    this.activeTeamLeadId = id;
    this.empId = id;
    this.authService.listOfManagersforOrganogram(id).subscribe({
      next: (res: any) => {
        console.log(res, 'raaaaaa');
        this.teamData = res; 
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err)
      }
    })
  }


  trackingPage(id: string) {
    this.router.navigate(['organogram', id]);
  }

  toggleOffcanvas(event: Event) {
    event.stopPropagation();
    this.isOpen = true;
  }

  closeOffcanvas() {
    this.isOpen = false;
  }

  onDragStart(event: MouseEvent, section: string): void {
    this.isDragging = true;
    this.startX = event.pageX;
    this.scrollLeft = section === 'teamLeads'
      ? this.teamLeadsScrollContainer.nativeElement.scrollLeft
      : this.departmentScrollContainer.nativeElement.scrollLeft;
  }

  // Drag move handler for scrollable elements
  onDragMove(event: MouseEvent, section: string): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX;
    const walk = (x - this.startX) * 1.5; // Adjust scroll speed
    if (section === 'teamLeads') {
      this.teamLeadsScrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
    } else {
      this.departmentScrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
    }
  }

  // Drag end handler to stop scrolling
  onDragEnd(): void {
    this.isDragging = false;
  }


  useDummyData() {
    this.data = [];
    let i = 1;
    while (this.data.length < 20) {
      this.data.push({
        departmentId: (1000 + i).toString(),
        departmentName: `DUMMY DEPARTMENT ${i}`,
        count: Math.floor(Math.random() * 10 + 1).toString()
      });
      i++;
    }
  }

}
