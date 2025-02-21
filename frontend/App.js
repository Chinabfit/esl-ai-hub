import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://your-backend-url.com"; // Replace with actual backend URL

const Home = () => (
  <div>
    <h2>Welcome to ESL AI Hub</h2>
    <p>Create AI-powered lesson plans, chat, and upload content.</p>
    <Link to="/generate-content">Generate Lesson</Link>
  </div>
);

const GenerateContent = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const generateLesson = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-content`, { prompt });
      setResult(response.data.content);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div>
      <h2>AI Lesson Generator</h2>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter lesson topic" />
      <button onClick={generateLesson}>Generate</button>
      <p>{result}</p>
    </div>
  );
};

const Payment = () => {
  const [amount, setAmount] = useState(1000);
  const handlePayment = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create-payment-intent`, { amount, currency: "usd" });
      alert("Payment successful! Client Secret: " + response.data.clientSecret);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div>
      <h2>Subscribe for Premium Features</h2>
      <button onClick={handlePayment}>Pay ${amount / 100}</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/generate-content">AI Lessons</Link> | <Link to="/payment">Payments</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-content" element={<GenerateContent />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
};

export default App;
