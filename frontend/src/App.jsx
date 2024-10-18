// src/App.js
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import EmployeeList from './components/employeeList/EmployeeList';
import AddEmployee from './components/addEmployee/AddEmployee';
import Attendance from './components/attendence/Attendance';
import LeaveManagement from './components/leaveManagement/LeaveManagement';
import DevelopmentPlan from './components/PerformanceDevelopment/DevelopmentPlan';
import GoalManagement from './components/performanceGoal/GoalManagement';
import PerformanceReview from './components/performancReview/PerformanceReview';
import logo from './assets/logo.png'

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />

        <div className="content">
          <div className='nav'><img src={logo}/></div>
          <Routes>
            <Route path="/" element={<Navigate to="/employee-list" />} /> {/* Redirect to EmployeeList */}
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave-management/*" element={<LeaveManagement />} />
           
            <Route path='/development' element={<DevelopmentPlan/>} />
            <Route path='/goal' element={<GoalManagement/>} />
            <Route path='/review' element={<PerformanceReview/>} />
         
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
