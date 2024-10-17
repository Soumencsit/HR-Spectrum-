import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 
import logo from '../../assets/logo.png'; // Importing the logo image

const Sidebar = () => {
  // State to manage the visibility of the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  // State to track the currently active tab in the sidebar
  const [activeTab, setActiveTab] = useState('employee-list'); 
  const dropdownRef = useRef(null); // Ref to attach to dropdown for detecting outside clicks

  // Function to toggle the dropdown menu open and closed
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle the dropdown state
  };

  // Function to handle tab clicks and update active tab
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the clicked tab as active
    
    // Close the dropdown if the clicked tab is not related to leave management
    if (tab !== 'apply-leave' && tab !== 'pending-leave' && tab !== 'approved-leave') {
      setIsDropdownOpen(false); 
    }
  };

  // Effect to handle clicks outside of the dropdown menu
  useEffect(() => {
    // Function to detect clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown if clicked outside
      }
    };

    // Adding event listener for detecting mouse clicks
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup function to remove the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="sidebar">
      <div className='sidebar-title'>
        <h2>Hr Spectrum</h2> {/* Sidebar title */}
      </div>
      <ul>
        {/* List of sidebar items with active tab highlighting */}
        <li className={`sidebar-li ${activeTab === 'employee-list' ? 'active-tab' : ''}`} onClick={() => handleTabClick('employee-list')}>
          <Link to="/employee-list">Employee List</Link>
        </li>
        <li className={`sidebar-li ${activeTab === 'add-employee' ? 'active-tab' : ''}`} onClick={() => handleTabClick('add-employee')}>
          <Link to="/add-employee">Add Employee</Link>
        </li>
        <li className={`sidebar-li ${activeTab === 'attendance' ? 'active-tab' : ''}`} onClick={() => handleTabClick('attendance')}>
          <Link to="/attendance">Attendance</Link>
        </li>
        <li className='drpdown' ref={dropdownRef}> {/* Dropdown for Leave Management */}
          <div onClick={toggleDropdown} className={`dropdown-toggle ${isDropdownOpen ? 'active-tab' : ''}`}>
            Leave Management {/* Dropdown toggle label */}
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu"> {/* Dropdown menu items */}
              <li className={`sidebar-li ${activeTab === 'apply-leave' ? 'active-tab' : ''}`} onClick={() => handleTabClick('apply-leave')}>
                <Link to="/leave-management/apply-leave">Apply Leave</Link>
              </li>
              <li className={`sidebar-li ${activeTab === 'pending-leave' ? 'active-tab' : ''}`} onClick={() => handleTabClick('pending-leave')}>
                <Link to="/leave-management/pending-leave">Pending Leave</Link>
              </li>
              <li className={`sidebar-li ${activeTab === 'approved-leave' ? 'active-tab' : ''}`} onClick={() => handleTabClick('approved-leave')}>
                <Link to="/leave-management/approved-leave">Approved Leave</Link>
              </li>
            </ul>
          )}
        </li>
        {/* Other sidebar items */}
        <li className={`sidebar-li ${activeTab === 'development' ? 'active-tab' : ''}`} onClick={() => handleTabClick('development')}>
          <Link to="/development">Development Program</Link>
        </li>
        <li className={`sidebar-li ${activeTab === 'goal' ? 'active-tab' : ''}`} onClick={() => handleTabClick('goal')}>
          <Link to="/goal">Goal setting </Link>
        </li>
        <li className={`sidebar-li ${activeTab === 'review' ? 'active-tab' : ''}`} onClick={() => handleTabClick('review')}>
          <Link to="/review">Performance Review</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
