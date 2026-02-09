import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ConsolerPage from "./pages/consoler/ConsolerPage";
import EventPage from "./pages/event/EventPage";
// import AttendancePage from "./pages/AttendancePage";
// import SalaryPage from "./pages/SalaryPage";
import Navbar from "./components/Navbar";
import AddConsolerPage from "./pages/consoler/AddConsoler";
import EditConsoler from "./pages/consoler/EditConsoler";
import AddEventPage from "./pages/event/AddEvent";
import EditEvent from "./pages/event/EditEvent";
import AttendancePage from "./pages/attendance/AttendancePage";
import EditAttendance from "./pages/attendance/EditAttendance";
import AddAttendance from "./pages/attendance/AddAttendance";
import SalaryPage from "./pages/salary/SalaryPage";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/consoler" >
            <Route index element={<ConsolerPage />} />
            <Route path="add" element={<AddConsolerPage />} />
            <Route path="edit/:id" element={<EditConsoler />} />
          </Route>
          <Route path="/event" >
            <Route index element={<EventPage />} />
            <Route path="add" element={<AddEventPage />} />
            <Route path="edit/:id" element={<EditEvent />} />
          </Route>
          <Route path="/attendance" >
            <Route index element={<AttendancePage />} />
            <Route path="add" element={<AddAttendance />} />
            <Route path="edit/:id" element={<EditAttendance />} />
          </Route>
          <Route path="/salary" >
            <Route index element={<SalaryPage />} />
            {/* <Route path="add" element={<AddAttendance />} />
            <Route path="edit/:id" element={<EditAttendance />} /> */}
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
