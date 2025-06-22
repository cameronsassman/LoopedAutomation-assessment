import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import { TimeEntry } from "../types/TimeEntry";

interface TimeEntryFormProps {
  currentEntry: TimeEntry | null;
  setCurrentEntry: Dispatch<SetStateAction<TimeEntry | null>>;
}

function TimeEntryForm({ currentEntry, setCurrentEntry }: TimeEntryFormProps) {
  const { addEntry, editEntry } = useTimeTracker();
  const [taskName, setTaskName] = useState<string>(currentEntry ? currentEntry.taskName : "");
  const [hoursWorked, setHoursWorked] = useState<string>(
    currentEntry ? currentEntry.hoursWorked.toString() : ""
  );
  const [startTime, setStartTime] = useState<string>(currentEntry?.startTime || "");
  const [endTime, setEndTime] = useState<string>(currentEntry?.endTime || "");
  const [useTimeRange, setUseTimeRange] = useState<boolean>(true);

  const calculateHoursFromTimeRange = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight shifts
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const diffMinutes = endMinutes - startMinutes;
    return Number((diffMinutes / 60).toFixed(2));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert("Task name cannot be empty");
      return;
    }

    let hours: number;
    let finalStartTime: string | undefined;
    let finalEndTime: string | undefined;

    if (useTimeRange && startTime && endTime) {
      hours = calculateHoursFromTimeRange(startTime, endTime);
      finalStartTime = startTime;
      finalEndTime = endTime;
      
      if (hours <= 0) {
        alert("End time must be after start time");
        return;
      }
    } else {
      hours = parseFloat(hoursWorked) || 0;
      if (hours <= 0) {
        alert("Hours worked must be greater than 0");
        return;
      }
      // Clear start/end times if not using time range
      finalStartTime = undefined;
      finalEndTime = undefined;
    }

    if (currentEntry) {
      editEntry(currentEntry.id, taskName, hours, finalStartTime, finalEndTime);
      setCurrentEntry(null);
    } else {
      addEntry(taskName, hours, finalStartTime, finalEndTime);
    }
    
    setTaskName("");
    setHoursWorked("");
    setStartTime("");
    setEndTime("");
    setUseTimeRange(false);
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartTime(value);
      if (useTimeRange && endTime) {
        const calculatedHours = calculateHoursFromTimeRange(value, endTime);
        setHoursWorked(calculatedHours.toString());
      }
    } else {
      setEndTime(value);
      if (useTimeRange && startTime) {
        const calculatedHours = calculateHoursFromTimeRange(startTime, value);
        setHoursWorked(calculatedHours.toString());
      }
    }
  };

  return (
    <div className="time-entry-form-container">
      <form onSubmit={handleSubmit} className="time-entry-form">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
          className="task-input"
        />
        
        <div className="time-input-section">
            <div className="time-range-inputs">
              <div className="time-input-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                  className="time-input"
                />
              </div>
              <div className="time-input-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                  className="time-input"
                />
              </div>
              {startTime && endTime && (
                <div className="calculated-hours">
                  {calculateHoursFromTimeRange(startTime, endTime).toFixed(2)} hours
                </div>
              )}
            </div>
        </div>
        
        <button type="submit" className="add-btn">
          {currentEntry ? "Update" : "Add Entry"}
        </button>
      </form>
    </div>
  );
}

export default TimeEntryForm;