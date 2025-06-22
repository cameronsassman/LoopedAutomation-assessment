import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import { TimeEntry } from "../types/TimeEntry";
// import "./TimeEntryForm.css";

interface TimeEntryFormProps {
  currentEntry: TimeEntry | null;
  setCurrentEntry: Dispatch<SetStateAction<TimeEntry | null>>;
}

function TimeEntryForm({ currentEntry, setCurrentEntry }: TimeEntryFormProps) {
  const { addEntry, editEntry, startTimer } = useTimeTracker();
  const [taskName, setTaskName] = useState<string>(currentEntry ? currentEntry.taskName : "");
  const [hoursWorked, setHoursWorked] = useState<string>(
    currentEntry ? currentEntry.hoursWorked.toString() : ""
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert("Task name cannot be empty");
      return;
    }

    const hours = parseFloat(hoursWorked) || 0;

    if (currentEntry) {
      editEntry(currentEntry.id, taskName, hours);
      setCurrentEntry(null);
    } else {
      addEntry(taskName, hours);
    }
    
    setTaskName("");
    setHoursWorked("");
  };

  const handleStartTimer = (): void => {
    if (!taskName.trim()) {
      alert("Task name cannot be empty");
      return;
    }
    
    startTimer(taskName);
    setTaskName("");
    setHoursWorked("");
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
        <input
          type="number"
          step="0.25"
          min="0"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          placeholder="Hours worked"
          className="hours-input"
        />
        <button type="submit" className="add-btn">
          {currentEntry ? "Update" : "Add Entry"}
        </button>
        {!currentEntry && (
          <button type="button" onClick={handleStartTimer} className="timer-btn">
            Start Timer
          </button>
        )}
      </form>
    </div>
  );
}

export default TimeEntryForm;