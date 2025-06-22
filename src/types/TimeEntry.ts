export interface TimeEntry {
  id: number;
  taskName: string;
  hoursWorked: number;
  date: string;
  isActive: boolean;
  startTime?: number;
}