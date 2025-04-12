import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-appendices',
  templateUrl: './appendices.component.html',
  styleUrls: ['./appendices.component.sass']
})
export class AppendicesComponent implements OnInit {

  myDate: any;
  searchQuery: FormControl = new FormControl();
  data:any;
  colorTheme = 'theme-dark-blue';  


  constructor() { }

  ngOnInit(): void {
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
    

    this.searchQuery.valueChanges.subscribe((value:string) => {
      console.log("search data : ",value);
      this.data = value;
    })
  }
}
