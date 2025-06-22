import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TimeEntry } from "../types/TimeEntry";

interface TimeTrackerContextType {
  entries: TimeEntry[];
  addEntry: (taskName: string, hoursWorked: number) => void;
  editEntry: (id: number, taskName: string, hoursWorked: number) => void;
  deleteEntry: (id: number) => void;
  startTimer: (taskName: string) => void;
  stopTimer: (id: number) => void;
  getTotalHours: () => number;
}

const TimeTrackerContext = createContext<TimeTrackerContextType | undefined>(undefined);

interface TimeTrackerProviderProps {
  children: ReactNode;
}

export function TimeTrackerProvider({ children }: TimeTrackerProviderProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

  // Update active timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        setEntries(prevEntries =>
          prevEntries.map(entry =>
            entry.id === activeTimer && entry.isActive && entry.startTime
              ? {
                  ...entry,
                  hoursWorked: Number(((Date.now() - entry.startTime) / (1000 * 60 * 60)).toFixed(2))
                }
              : entry
          )
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const addEntry = (taskName: string, hoursWorked: number): void => {
    const newEntry: TimeEntry = {
      id: Date.now(),
      taskName,
      hoursWorked,
      date: new Date().toLocaleDateString(),
      isActive: false
    };
    setEntries([...entries, newEntry]);
  };

  const editEntry = (id: number, taskName: string, hoursWorked: number): void => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, taskName, hoursWorked } : entry
      )
    );
  };

  const deleteEntry = (id: number): void => {
    if (activeTimer === id) {
      setActiveTimer(null);
    }
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const startTimer = (taskName: string): void => {
    // Stop any existing active timer
    if (activeTimer) {
      stopTimer(activeTimer);
    }

    const newEntry: TimeEntry = {
      id: Date.now(),
      taskName,
      hoursWorked: 0,
      date: new Date().toLocaleDateString(),
      isActive: true,
      startTime: Date.now()
    };
    
    setEntries([...entries, newEntry]);
    setActiveTimer(newEntry.id);
  };

  const stopTimer = (id: number): void => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id && entry.isActive
          ? { ...entry, isActive: false, startTime: undefined }
          : entry
      )
    );
    setActiveTimer(null);
  };

  const getTotalHours = (): number => {
    return Number(entries.reduce((total, entry) => total + entry.hoursWorked, 0).toFixed(2));
  };

  return (
    <TimeTrackerContext.Provider
      value={{ entries, addEntry, editEntry, deleteEntry, startTimer, stopTimer, getTotalHours }}
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