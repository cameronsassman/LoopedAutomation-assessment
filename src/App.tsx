import React, { useState } from "react";
import TimeEntryForm from "./components/TimeEntryForm";
import TimeEntryList from "./components/TimeEntryList";
import { TimeTrackerProvider } from "./context/TimeTrackerContext";
import { TimeEntry } from "./types/TimeEntry";
import "./App.css";

function App(): React.ReactElement {
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);

  return (
    <TimeTrackerProvider>
      <div className="app">
        <h1>Time Tracker</h1>
        <TimeEntryForm currentEntry={currentEntry} setCurrentEntry={setCurrentEntry} />
        <TimeEntryList setCurrentEntry={setCurrentEntry} />
      </div>
    </TimeTrackerProvider>
  );
}

export default App;