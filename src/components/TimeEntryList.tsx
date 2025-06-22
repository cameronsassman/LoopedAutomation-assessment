import { Dispatch, SetStateAction } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import { TimeEntry } from "../types/TimeEntry";
import TimeEntryItem from "./TimeEntryItem";

interface TimeEntryListProps {
  setCurrentEntry: Dispatch<SetStateAction<TimeEntry | null>>;
}

function TimeEntryList({ setCurrentEntry }: TimeEntryListProps) {
  const { entries, getTotalHours } = useTimeTracker();

  const formatTotalHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="time-entry-list">
      <div className="list-header">
        <div className="total-hours">
          Total Time: {formatTotalHours(getTotalHours())}
        </div>
      </div>
      <div className="entries-container">
        {entries.length === 0 ? (
          <div className="no-entries">No time entries found</div>
        ) : (
          entries.map((entry: TimeEntry) => (
            <TimeEntryItem key={entry.id} entry={entry} setCurrentEntry={setCurrentEntry} />
          ))
        )}
      </div>
    </div>
  );
}

export default TimeEntryList;