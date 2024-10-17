
import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import "./EmployeeList.css"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const EmployeeList = () => {
  
  const [employees, setEmployees] = useState([]);
  const [performanceData, setPerformanceData] = useState({}); 

  // Fetch the list of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/employees/list");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch performance reviews based on uniqueId
  const fetchPerformance = async (uniqueId) => {
    try {
      const res = await axios.get(`http://localhost:3000/performance/review/${uniqueId}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching performance for uniqueId ${uniqueId}:`, error);
      return "No performance review found";
    }
  };

  // Fetch performance data for all employees
  useEffect(() => {
    const fetchAllPerformance = async () => {
      const updatedPerformanceData = {};
      for (const employee of employees) {
        const performance = await fetchPerformance(employee.uniqueId);
        updatedPerformanceData[employee.uniqueId] = performance;
      }
      setPerformanceData(updatedPerformanceData); // Store performance data for all employees
    };

    if (employees.length > 0) {
      fetchAllPerformance();
    }
  }, [employees]);

  // Handle employee removal
  const handleRemove = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:3000/employees/delete/${employeeId}`);
      setEmployees(employees.filter((employee) => employee._id !== employeeId));
      toast.success("Employee removed successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error removing employee.");
    }
  };

  return (
    <div className="employee-list">
      <ToastContainer />
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unique ID</th>
              <th>Contact</th>
              <th>Job Role</th>
              <th>Salary</th>
              <th>Performance History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.uniqueId}</td>
                <td>{employee.contact}</td>
                <td>{employee.jobRole}</td>
                <td>{employee.salary}</td>
                <td>
                  {/* Display performance review or 'Not found' */}
                  {performanceData[employee.uniqueId] ? (
                    Array.isArray(performanceData[employee.uniqueId]) && performanceData[employee.uniqueId].length > 0 ? (
                      <ul>
                        {performanceData[employee.uniqueId].map((review, index) => (
                          <li key={index} >
                            {review.reviewPeriod} :: {review.rating}⭐ :: {review.comments}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No performance review found.</p>
                    )
                  ) : (
                    <p>Loading performance...</p> // Show loading if performance is still being fetched
                  )}
                </td>
                <td>
                  <button onClick={() => handleRemove(employee._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;

