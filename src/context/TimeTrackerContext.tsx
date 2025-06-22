import { createContext, useContext, useState, ReactNode } from "react";
import { TimeEntry } from "../types/TimeEntry";

interface TimeTrackerContextType {
  entries: TimeEntry[];
  addEntry: (taskName: string, hoursWorked: number, startTime?: string, endTime?: string) => void;
  editEntry: (id: number, taskName: string, hoursWorked: number, startTime?: string, endTime?: string) => void;
  deleteEntry: (id: number) => void;
  getTotalHours: () => number;
}

const TimeTrackerContext = createContext<TimeTrackerContextType | undefined>(undefined);

interface TimeTrackerProviderProps {
  children: ReactNode;
}

export function TimeTrackerProvider({ children }: TimeTrackerProviderProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  const addEntry = (taskName: string, hoursWorked: number, startTime?: string, endTime?: string): void => {
    const newEntry: TimeEntry = {
      id: Date.now(),
      taskName,
      hoursWorked,
      date: new Date().toLocaleDateString(),
      isActive: false,
      startTime,
      endTime
    };
    setEntries([...entries, newEntry]);
  };

  const editEntry = (id: number, taskName: string, hoursWorked: number, startTime?: string, endTime?: string): void => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, taskName, hoursWorked, startTime, endTime } : entry
      )
    );
  };

  const deleteEntry = (id: number): void => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const getTotalHours = (): number => {
    return Number(entries.reduce((total, entry) => total + entry.hoursWorked, 0).toFixed(2));
  };

  return (
    <TimeTrackerContext.Provider
      value={{ entries, addEntry, editEntry, deleteEntry, getTotalHours }}
    >
      {children}
    </TimeTrackerContext.Provider>
  );
}

export function useTimeTracker(): TimeTrackerContextType {
  const context = useContext(TimeTrackerContext);
  if (context === undefined) {
    throw new Error('useTimeTracker must be used within a TimeTrackerProvider');
  }
  return context;
}