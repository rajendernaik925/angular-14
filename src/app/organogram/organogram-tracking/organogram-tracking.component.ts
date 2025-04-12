import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organogram-tracking',
  templateUrl: './organogram-tracking.component.html',
  styleUrls: ['./organogram-tracking.component.sass']
})
export class OrganogramTrackingComponent implements OnInit {


  
  teams = [
    { id: '3', name: 'Cyber Security' },
    { id: '5', name: 'DevOps' },
    { id: '7', name: 'Quality Assurance' },
    { id: '8', name: 'IT Support' }
  ];
  selectedTeamIndex: number  = 0;
  
  
  
  constructor() { }

  ngOnInit(): void {
  }

  trackingPage(index: number) {
    this.selectedTeamIndex = index;
  }


}
