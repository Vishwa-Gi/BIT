import React from 'react';
import { useState } from "react";
import axios from "axios";

const NotesMaker = () => {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    if (!query) return;
    setLoading(true);
    setNotes("");

    try {
      const response = await axios.post("http://localhost:5000/api/notes/generate", { query });
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error generating notes:", error);
      setNotes("Failed to generate notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>Groq Notes Generator</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter topic to generate notes..."
        rows={4}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <button
        onClick={generateNotes}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Generating..." : "Generate Notes"}
      </button>

      {notes && (
        <div style={{ marginTop: "20px", background: "#000000ff", padding: "15px", borderRadius: "8px" }}>
          <h3>Generated Notes:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{notes}</pre>
        </div>
      )}
    </div>
  );
}

export default NotesMaker
