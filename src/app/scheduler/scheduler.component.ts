import { Component, OnInit } from '@angular/core';

import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getDay, subDays, setMonth, setYear } from 'date-fns';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  currentDate: string = '';
  currentTime: Date = new Date();
  schedule: Date[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Names of days of the week
  timeSlots: string[] = [
  '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM',
  '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
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

  updateCurrentTime() {
    this.currentTime = new Date();
  }

  ngOnInit(): void {
    this.currentDate = this.formatDay(new Date()); // Initialize with the current date
    this.generateSchedule();
    // Update the current time periodically (e.g., every minute)
    setInterval(() => {
      this.updateCurrentTime();
    }, 60000); // Update every minute (adjust as needed)
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
  isCurrentTimeSlot(timeSlot: string): boolean {
    const currentTime = new Date();
    const [hourMinute, period] = timeSlot.split(' ');
    const [currentHour, currentMinute] = currentTime.toLocaleTimeString().split(':');
    const currentPeriod = currentTime.getHours() < 12 ? 'AM' : 'PM';

    return currentPeriod === period && currentHour === hourMinute.split(':')[0] && currentMinute >= '00' && currentMinute <= '29';
  }


}
