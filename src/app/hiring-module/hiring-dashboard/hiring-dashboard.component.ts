import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hiring-dashboard',
  templateUrl: './hiring-dashboard.component.html',
  styleUrls: ['./hiring-dashboard.component.sass']
})
export class HiringDashboardComponent implements OnInit {

  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef;
  candidatesCount: any;
  isLoading: boolean = false;
  graphImageUrl: string = 'assets/img/job-code/graph.png';
  statusList: string[] = ['Compare','Shortlisted', 'Selected', 'Process', 'Scheduled', 'Offer', 'Onboarding'];
  statusOne: string = this.statusList[0];
  statusTwo: string = this.statusList[0]; 
  isOpen = false;
  isSidebarOpen = true;

  differenceResult: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initPieChart();
    }, 0);
  }

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.candidateCount();
  }


  

  compareStatuses() {
    const list1 = this.getApplicantsByStatus(this.statusOne);
    const list2 = this.getApplicantsByStatus(this.statusTwo);

    this.differenceResult = list1.filter(x => !list2.includes(x));
    Swal.fire({
      title: 'Difference Result',
      text: 'Here is the difference between the selected statuses.',
      html: `<pre>${JSON.stringify(this.differenceResult, null, 2)}</pre>`, 
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  getApplicantsByStatus(status: string): string[] {
    const data = {
      'Shortlisted': ['John', 'Ayesha', 'Kunal'],
      'Selected': ['John', 'Priya'],
      'Process': ['Kunal', 'Priya', 'Ravi'],
      'Scheduled': ['Ravi'],
      'Offer': ['Priya'],
      'Onboarding': ['Ayesha']
    };
    return data[status] || [];
  }


  candidateCount() {
    this.isLoading = true;
    console.log("loadibg value : ", this.isLoading)
    this.authService.dashboardCandidatesCount().subscribe({
      next: (res: HttpResponse<any>) => {
        this.isLoading = false;
        console.log("candidates : ", res);
        this.candidatesCount = res;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err);
      }
    })
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  initPieChart() {
    if (!this.pieChart?.nativeElement) return;

    const myChart = echarts.init(this.pieChart.nativeElement);

    const year = 2024;
    const startDate = new Date(year, 0, 1).getTime();
    const oneDay = 24 * 3600 * 1000;
    const daysInYear = 365;

    let data: [number, number][] = [];

    let baseValue = 500;

    for (let i = 0; i < daysInYear; i++) {
      const date = startDate + i * oneDay;

      // Create a smooth up-and-down wave pattern
      const seasonalFactor = Math.sin((i / daysInYear) * 2 * Math.PI); // sine wave
      const randomNoise = (Math.random() - 0.5) * 100; // small randomness

      const value = Math.max(0, baseValue + seasonalFactor * 400 + randomNoise); // ensure non-negative
      data.push([date, Math.round(value)]);
    }

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = new Date(params[0].data[0]);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `Date: ${day}-${month}-${year}<br/>Total Count: ${params[0].data[1]}`;
        }
      },
      title: {
        left: 'center',
        text: 'Hiring Module Candidate Data'
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: function (value: number) {
            const date = new Date(value);
            return date.toLocaleString('default', { month: 'short' }); // Jan, Feb, ...
          }
        },
        splitNumber: 12
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '10%']
      },
      series: [
        {
          name: 'Total Count',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: data
        }
      ]
    };

    myChart.setOption(option);
  }





}

