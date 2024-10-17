import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddEmployee.css"; // Import the CSS file for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEmployee = () => {
  // State to handle form data for new employee details
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    jobRole: "",
    salary: "",
    uniqueId: "",
  });
  
  // State to handle file uploads (e.g., employee documents)
  const [file, setFile] = useState(null);

  // State to store the current count of employees in the system
  const [employeeCount, setEmployeeCount] = useState(0);

  // Fetch the current employee count from the server when the component mounts
  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/employees/count"
        );
        setEmployeeCount(response.data.count);
      } catch (error) {
        console.error("Error fetching employee count:", error);
      }
    };

    fetchEmployeeCount();
  }, []);

  // Handle changes in form fields and update the state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes and store the selected file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a unique ID for the employee based on the current date and employee count
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const sequentialNumber = (employeeCount + 1).toString().padStart(2, "0");
    const uniqueId = `${year}${month}${sequentialNumber}`;

    // Prepare the data for submission
    const dataToSubmit = { ...formData, uniqueId };

    try {
      // Add employee details to the database
      const employeeRes = await axios.post(
        "http://localhost:3000/employees/add",
        dataToSubmit
      );
      const employeeId = employeeRes.data._id;

      // If a file is selected, upload the document for the added employee
      if (file) {
        const formDataFile = new FormData();
        formDataFile.append("document", file);
        await axios.post(
          `http://localhost:3000/employees/upload/${employeeId}`,
          formDataFile
        );
      }

      // Notify success using toast and reset the form
      toast.success("Employee added successfully");

      // Reset form data and file input after successful submission
      setFormData({
        name: "",
        contact: "",
        jobRole: "",
        salary: "",
        uniqueId: "",
      });
      setFile(null);
      setEmployeeCount(employeeCount + 1); // Update employee count
    } catch (error) {
      console.error(error);
      alert("Error adding employee");
    }
  };

  return (
    <div className="card">
      <ToastContainer /> {/* Display toast notifications */}
      
      <form onSubmit={handleSubmit}>
        {/* Input fields for employee details */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact"
          required
        />
        <input
          type="text"
          name="jobRole"
          value={formData.jobRole}
          onChange={handleChange}
          placeholder="Job Role"
          required
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          required
        />

        {/* File upload input for employee documents */}
        <input type="file" onChange={handleFileChange} />
        
        {/* Submit button */}
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
