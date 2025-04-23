import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap'; // Import Bootstrap

@Component({
  selector: 'app-use-case',
  templateUrl: './use-case.component.html',
  styleUrls: ['./use-case.component.sass']
})
export class UseCaseComponent implements OnInit, AfterViewInit {

  month = 3; // April (0-based)
  year = 2025;
  days: any[] = [];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years = [2024, 2025, 2026];

  dataFromBackend: {
    completedDates: { [key: string]: string },
    holidays: { [key: string]: string } 
  } = {
    completedDates: {
      '2025-04-01': 'Completed: completed job code',
      '2025-04-02': 'Completed: Completed hiring module',
      '2025-04-07': 'Completed: completed Report',
      '2025-04-22': 'Completed: completed pending works',
      '2025-04-28': 'Completed: Weekly Summary'
    },
    holidays: {
      '2025-04-06': 'Easter Holiday',
      '2025-04-13': 'Company Holiday',
      '2025-04-20': 'Public Holiday'
    }
  };

  ngOnInit(): void {
    this.generateCalendar(this.year, this.month);
  }

  ngAfterViewInit(): void {
    this.loadTooltips();
  }

  onMonthChange(): void {
    this.generateCalendar(this.year, this.month);
    setTimeout(() => this.loadTooltips(), 0);
  }

  onYearChange(): void {
    this.generateCalendar(this.year, this.month);
    setTimeout(() => this.loadTooltips(), 0);
  }

  loadTooltips(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((el: any) => new bootstrap.Tooltip(el)); // Initialize Bootstrap tooltips
  }

  generateCalendar(year: number, month: number): void {
    this.days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startWeekDay = firstDay.getDay(); // Sunday = 0
  
    // Leading empty cells
    for (let i = 0; i < startWeekDay; i++) {
      this.days.push({ isEmpty: true });
    }
  
    // Fill in actual days
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      let status = 'primary'; // Default for future dates (blue)
      let tooltip = 'Future Date';
  
      // Check if the date is in the future, and update the status and tooltip accordingly
      if (date > today) {
        status = 'primary'; // Future dates in blue
        tooltip = 'Future Date';
      } else {
        // Mark Sundays as holidays (red) - even if no task is completed
        if (date.getDay() === 0) { // Sunday = 0
          status = 'danger'; // Sunday in red
          tooltip = 'Holiday: Sunday'; // Tooltip for Sunday
        }
  
        // Check if the date is a holiday
        if (this.dataFromBackend.holidays[dateStr]) {
          status = 'warning'; // Holiday with warning color (yellow)
          tooltip = `Holiday: ${this.dataFromBackend.holidays[dateStr]}`; // Tooltip for holiday with reason
        }
  
        // Check if the date has completed tasks
        if (this.dataFromBackend.completedDates[dateStr]) {
          status = 'success'; // Completed task in green
          tooltip = this.dataFromBackend.completedDates[dateStr];
        } else if (!this.dataFromBackend.completedDates[dateStr] && date.getDay() !== 0) {
          // If it's not a Sunday, mark it as "Not Filled"
          status = 'warning'; // Incomplete tasks in yellow
          tooltip = 'Not Filled';
        }
      }
  
      this.days.push({ day, status, tooltip, isEmpty: false });
    }
  
    // Trailing empty cells to complete final row
    const trailing = 7 - (this.days.length % 7);
    if (trailing < 7) {
      for (let i = 0; i < trailing; i++) {
        this.days.push({ isEmpty: true });
      }
    }
  }
  

  // Hover effect: Handled within Angular instead of using direct DOM manipulation
  hoveredDay: any = null;

  hoverDay(day: any): void {
    this.hoveredDay = day;
  }

  resetHover(): void {
    this.hoveredDay = null;
  }
}
