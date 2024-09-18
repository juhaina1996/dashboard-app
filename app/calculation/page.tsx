"use client";

import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField/InputField";
import "../styles/calculate.css"; // Import CSS for styling
import { auth, db } from "../../firebaseConfig"; // Import Firebase configuration
import useClientAuth from "../hooks/useClientAuth"; // Custom hook for client authentication
import { getDoc, doc } from "firebase/firestore"; // Import Firestore functions

const CalculationPage: React.FC = () => {
  // State variables
  const [amount, setAmount] = useState(""); // State for loan amount input
  const [term, setTerm] = useState(""); // State for loan term input
  const [rate, setRate] = useState<number | null>(null); // State for interest rate
  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null); // State for monthly payment
  const [numPayments, setNumPayments] = useState<number | null>(null); // State for number of payments
  const [errors, setErrors] = useState({
    amount: "", // Error message for amount input
    term: "", // Error message for term input
  });

  // Retrieve authentication status from custom hook
  const { isAuthenticated: serverAuthenticated } = useClientAuth();
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(serverAuthenticated);

  // Effect to update authentication status
  useEffect(() => {
    const checkUserRole = async () => {
      setIsAuthenticated(serverAuthenticated);
    };

    checkUserRole();
  }, [serverAuthenticated]);

  // Fetch interest rate from API when component mounts
  useEffect(() => {
    const fetchInterestRate = async () => {
      try {
        // Fetch interest rates from server
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/interest-rates`
        );

        // Parse the JSON response
        const data = await response.json();
        setRate(data[1].rate); // Assuming API returns an array with a rate field
      } catch (error) {
        console.error("Error fetching interest rate:", error); // Log errors
      }
    };

    fetchInterestRate();
  }, []);

  // Handle changes in input fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "amount" | "term"
  ) => {
    switch (field) {
      case "amount":
        setAmount(e.target.value);
        break;
      case "term":
        setTerm(e.target.value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear errors for the field
  };

  // Calculate monthly payment based on amount, term, and rate
  const calculatePayment = () => {
    if (rate === null) return; // Check if rate is not set

    const principal = parseFloat(amount);
    const interest = rate / 100 / 12; // Convert annual rate to monthly interest
    const numPayments = parseFloat(term) * 12; // Convert term to total number of payments

    // Calculate monthly payment using the formula
    const payment =
      (principal * interest) / (1 - Math.pow(1 + interest, -numPayments));

    setMonthlyPayment(payment.toFixed(2)); // Format payment to two decimal places
    setNumPayments(numPayments); // Set total number of payments
  };

  return (
    <div className="table-container">
      <p className="registered-user-text">Calculate Loan</p>
      <div className="main-container">
        <div>
          Enter the loan amount
          <InputField
            type="number"
            value={amount}
            onChange={(e) => handleInputChange(e, "amount")}
          />
          {errors.amount && <p className="error">{errors.amount}</p>}{" "}
          {/* Display error for amount */}
        </div>
        <div>
          Enter the loan term
          <InputField
            type="number"
            value={term}
            onChange={(e) => handleInputChange(e, "term")}
          />
          {errors.term && <p className="error">{errors.term}</p>}{" "}
          {/* Display error for term */}
        </div>

        {/* Displaying fetched interest rate */}
      </div>
      <div className="button-container">
        <Button type="button" onClick={calculatePayment}>
          Calculate Payment
        </Button>
      </div>
      {monthlyPayment && numPayments !== null && (
        <div className="results">
          <h2>Results</h2>
          {rate !== null && <p>Interest Rate: {rate}%</p>}{" "}
          {/* Display interest rate */}
          <p>Number of Payments: {numPayments}</p>{" "}
          {/* Display number of payments */}
          <p>Monthly Payment: ${monthlyPayment}</p>{" "}
          {/* Display monthly payment */}
        </div>
      )}
    </div>
  );
};

export default CalculationPage;
