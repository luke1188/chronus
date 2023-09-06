import { Component, OnInit } from '@angular/core';

import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getDay, subDays, setMonth, setYear } from 'date-fns';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  currentDate: string = '';
  schedule: Date[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Names of days of the week
  timeSlots: string[] = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a', '12p',
    '1p', '2p', '3p', '4p', '5p', '6p',
    '7p', '8p', '9p', '10p', '11p',
    // Add more time slots as needed
  ];
  currentView: 'day' | 'week' | 'month' = 'month'; // Default view
  weeks: Date[][] = [];
  selectedMonth: number = new Date().getMonth(); // Default to current month
  selectedYear: number = new Date().getFullYear(); // Default to current year
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor() { }

  ngOnInit(): void {
    this.currentDate = this.formatDay(new Date()); // Initialize with the current date
    this.generateSchedule();
  }

  generateSchedule(): void {
    // Generate a schedule based on the current view and selected month/year
    const today = new Date();
    today.setFullYear(this.selectedYear); // Set the selected year
    today.setMonth(this.selectedMonth); // Set the selected month

    this.schedule = [];

    if (this.currentView === 'day') {
      this.schedule.push(today);
    } else if (this.currentView === 'week') {
      const startOfWeekDate = startOfWeek(today);
      for (let i = 0; i < 7; i++) {
        const day = addDays(startOfWeekDate, i);
        this.schedule.push(day);
      }
    } else if (this.currentView === 'month') {
      const firstDayOfMonth = startOfMonth(today);
      const lastDayOfMonth = endOfMonth(today);
      const startOfMonthDay = getDay(firstDayOfMonth);

      // Calculate weeks for the selected month
      this.weeks = [];
      let currentWeek = [];

      // Handle days from the previous month
      for (let i = 0; i < startOfMonthDay; i++) {
        const previousMonthDay = subDays(firstDayOfMonth, startOfMonthDay - i);
        currentWeek.push(previousMonthDay);
      }

      // Handle days of the selected month
      for (let currentDay = firstDayOfMonth; currentDay <= lastDayOfMonth; currentDay = addDays(currentDay, 1)) {
        currentWeek.push(currentDay);

        if (getDay(currentDay) === 6) {
          this.weeks.push([...currentWeek]);
          currentWeek = [];
        }
      }

      // Add the remaining days if any
      if (currentWeek.length > 0) {
        this.weeks.push([...currentWeek]);
      }
    }
  }

  formatDay(date: Date): string {
    return format(date, 'MMMM dd, yyyy');
  }

  switchView(view: 'day' | 'week' | 'month'): void {
    this.currentView = view;
    this.generateSchedule();
  }

  changeMonth(): void {
    // Update the displayed month when the user changes it
    this.generateSchedule();
  }
}
