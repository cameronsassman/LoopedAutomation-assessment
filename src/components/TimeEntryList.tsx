import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { useTimeTracker } from "../context/TimeTrackerContext";
import { TimeEntry } from "../types/TimeEntry";
import TimeEntryItem from "./TimeEntryItem";
// import "./TimeEntryList.css";

type FilterType = 'all' | 'active' | 'completed';

interface TimeEntryListProps {
  setCurrentEntry: Dispatch<SetStateAction<TimeEntry | null>>;
}

function TimeEntryList({ setCurrentEntry }: TimeEntryListProps) {
  const { entries, getTotalHours } = useTimeTracker();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState<string>("");

  const filteredEntries = entries
    .filter((entry: TimeEntry) => {
      if (filter === "active") return entry.isActive;
      if (filter === "completed") return !entry.isActive;
      return true;
    })
    .filter((entry: TimeEntry) => 
      entry.taskName.toLowerCase().includes(search.toLowerCase())
    );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

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
        <div className="filters">
          <button 
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("active")}
            className={filter === "active" ? "active" : ""}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "active" : ""}
          >
            Completed
          </button>
          <input
            type="text"
            placeholder="Search tasks"
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="entries-container">
        {filteredEntries.length === 0 ? (
          <div className="no-entries">No time entries found</div>
        ) : (
          filteredEntries.map((entry: TimeEntry) => (
            <TimeEntryItem key={entry.id} entry={entry} setCurrentEntry={setCurrentEntry} />
          ))
        )}
      </div>
    </div>
  );
}

export default TimeEntryList;