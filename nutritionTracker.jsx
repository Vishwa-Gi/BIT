import React, { useState } from "react";
import axios from "axios";

const NutritionTracker = () => {
 const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //
  const [foodItem, setFoodItem] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
   const [apiResult, setApiResult] = useState(null)

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setExtractedText("");
    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select a JPG image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      setError("");
      setExtractedText("");

      const response = await axios.post(
        "http://localhost:5000/api/image-to-text",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // backend returns { text: response.data }
      // setExtractedText(response.data.text);
      const text = response.data?.text.all_text;
      console.log("Extracted Text:", text);
    setExtractedText(typeof text === "string" ? text : JSON.stringify(text));
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to extract text from image.");
    } finally {
      setLoading(false);
    }
    
  };

  const getNutrition = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/nutrition/", { item: foodItem });
      console.log("Nutrition Data (raw):", response.data);

  // Filter out fields that are not numeric
  const filteredData = response.data.map(item => {
  const obj = {};
  Object.entries(item).forEach(([key, value]) => {
    if (key === "name" || typeof value === "number") {
      obj[key] = value;
    }
  });
  return obj;
});

  console.log("Nutrition Data (filtered):", filteredData);

  setNutritionData(filteredData);
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
    }

  };

  const sendDataToApi = async () => {
    if (!extractedText || !nutritionData) {
      setError("Please extract text and fetch nutrition data first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/final-endpoint", // replace with your API
        {
          text: extractedText,
          nutrition: nutritionData,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Final API Response:", response.data);
      setApiResult(response.data.result);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to send data to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>Image to Text OCR</h2>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/jpeg" onChange={handleFileChange} />
        <button
          type="submit"
          style={{ marginTop: "10px", padding: "10px 20px" }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Extract Text"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {extractedText && (
        <div
          style={{
            marginTop: "20px",
            background: "#000000ff",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}

      <div>
        Enter food
      </div>
      <input type="text" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
      <button onClick={getNutrition}>Get Nutrition</button>
      {nutritionData && (
        <div>
          <h3>Nutrition Data:</h3>
          <pre>{JSON.stringify(nutritionData, null, 2)}</pre>
        </div>
      )}


       <div style={{ marginTop: "20px" }}>
        <button onClick={sendDataToApi} disabled={loading}>
          {loading ? "Sending..." : "Send Extracted Text & Nutrition Data"}
        </button>
      </div>

      {apiResult && (
        <div style={{
            marginTop: "20px",
            background: "#000000ff",
            padding: "15px",
            borderRadius: "8px",
          }}>
          <h3>API Result:</h3>
           <p style={{ whiteSpace: "pre-wrap", color: "#fff" }}>
      {apiResult.summary || apiResult.text || apiResult} 
    </p>
        </div>
      )}
    </div>
  );
}

export default NutritionTracker
