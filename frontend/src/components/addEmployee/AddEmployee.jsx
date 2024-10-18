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
  });

  // State to store the current count of employees in the system
  const [employeeCount, setEmployeeCount] = useState(0);
  
  // State to handle loading status
  const [loading, setLoading] = useState(false);

  // Fetch the current employee count from the server when the component mounts
  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/employees/count");
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

  // Validate input fields
  const validateInputs = () => {
    const { contact, salary } = formData;
    const salaryValue = parseFloat(salary);
    const phoneRegex = /^[0-9]{10}$/; // Basic phone number validation

    if (!phoneRegex.test(contact)) {
      toast.error("Contact must be a 10-digit number");
      return false;
    }
    if (salaryValue <= 0) {
      toast.error("Salary must be a positive number");
      return false;
    }
    return true;
  };

  // Handle form submission to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return; // Validate inputs before submission

    // Set loading state to true
    setLoading(true);

    // Get the current date
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
   

    // Format unique ID
    const uniqueId = `${year}${month}${day}${randomNumber}${employeeCount}`;

    // Prepare the data for submission
    const dataToSubmit = { ...formData, uniqueId };

    try {
      // Add employee details to the database
      await axios.post("http://localhost:3000/employees/add", dataToSubmit);
      toast.success("Employee added successfully");

      // Reset form data after successful submission
      setFormData({
        name: "",
        contact: "",
        jobRole: "",
        salary: "",
      });
      setEmployeeCount(employeeCount + 1); // Update employee count
    } catch (error) {
      console.error(error);
      toast.error("Error adding employee");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <ToastContainer />

      <h2>Add New Employee</h2>
    

      <form onSubmit={handleSubmit}>
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
        
        {/* Submit button with loading state */}
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
