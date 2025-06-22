import React, { Dispatch, SetStateAction } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import { TimeEntry } from "../types/TimeEntry";
// import "./TimeEntryItem.css";

interface TimeEntryItemProps {
  entry: TimeEntry;
  setCurrentEntry: Dispatch<SetStateAction<TimeEntry | null>>;
}

function TimeEntryItem({ entry, setCurrentEntry }: TimeEntryItemProps) {
  const { deleteEntry, stopTimer } = useTimeTracker();

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className={`time-entry-item ${entry.isActive ? "active" : ""}`}>
      <div className="entry-info">
        <div className="task-name">{entry.taskName}</div>
        <div className="entry-details">
          <span className="hours">{formatHours(entry.hoursWorked)}</span>
          <span className="date">{entry.date}</span>
          {entry.isActive && <span className="status-badge">ACTIVE</span>}
        </div>
      </div>
      <div className="actions">
        {entry.isActive ? (
          <button onClick={() => stopTimer(entry.id)} className="stop-btn">
            Stop
          </button>
        ) : (
          <button onClick={() => setCurrentEntry(entry)} className="edit-btn">
            Edit
          </button>
        )}
        <button onClick={() => deleteEntry(entry.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TimeEntryItem;