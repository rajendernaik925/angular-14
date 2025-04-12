import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-hiring-dashboard',
  templateUrl: './hiring-dashboard.component.html',
  styleUrls: ['./hiring-dashboard.component.sass']
})
export class HiringDashboardComponent implements OnInit {

  @ViewChild('barChart', { static: false }) barChart!: ElementRef;
  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef;
  candidatesCount:any;
  isLoading: boolean = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initBarChart();
      this.initPieChart();
    }, 0);
  }

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.candidateCount();
  }

  candidateCount() {
    this.isLoading = true;
    console.log("loadibg value : ",this.isLoading)
    this.authService.dashboardCandidatesCount().subscribe({
      next: (res:HttpResponse<any>) => {
        this.isLoading = false;
        console.log("candidates : ",res);
        this.candidatesCount = res;
      },
      error: (err:HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err);
      }
    })
  }
  
  initBarChart() {
    if (!this.barChart?.nativeElement) return;

    const myChart = echarts.init(this.barChart.nativeElement);
    const option = {
      title: {
        text: 'Fieldwork',
        subtext: 'Fake Data'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Rainfall', 'Evaporation']
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      ],
      yAxis: [{ type: 'value' }],
      series: [
        {
          name: 'Rainfall',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          markPoint: { data: [{ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' }] },
          markLine: { data: [{ type: 'average', name: 'Avg' }] }
        },
        {
          name: 'Evaporation',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          markPoint: { data: [{ name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 }, { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }] },
          markLine: { data: [{ type: 'average', name: 'Avg' }] }
        }
      ]
    };
    myChart.setOption(option);
  }

  initPieChart() {
    if (!this.pieChart?.nativeElement) return;

    const myChart = echarts.init(this.pieChart.nativeElement);
    const option = {
      tooltip: { trigger: 'item' },
      legend: { top: '2%', left: 'start' },
      series: [
        {
          name: 'Hiring Form',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: 64, name: 'Shortlisted' },
            { value: 80, name: 'Hired' },
            { value: 100, name: 'Hold' },
            { value: 100, name: 'Rejected' },
          ]
        }
      ]
    };
    myChart.setOption(option);
  }
}

