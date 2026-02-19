"use client"

import { useState } from "react";
import { Upload, Send, Loader2, Activity } from "lucide-react";
import { saveProfile } from "@/app/actions/saveProfile";
import { interpretManualResults } from "@/app/actions/interpretManual"; 
import { interpretFile } from "@/app/actions/interpretFile"; 
import { getChatResponse } from "@/app/actions/chatAction"; 

export default function DashboardContent() {
  const [profile, setProfile] = useState({
    age: "", sex: "", weight: "", height: "", conditions: "", symptoms: ""
  });
  const [manualResult, setManualResult] = useState("");
  const [userMessage, setUserMessage] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false); 
  const [isFileLoading, setIsFileLoading] = useState(false); 
  
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hello! I am your AI Health Assistant. Please complete your profile or upload a report.' }
  ]);

  const colors = {
    darkTeal: "#087E7A", midTeal: "#0FB9B1", lightTeal: "#F0F9F8", bg: "#f8fdfd", white: "#ffffff"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64File = reader.result as string;
      const fileType = file.type;
      const newHistory = [...chatHistory, { role: 'user', content: `Uploaded: ${file.name}` }];
      setChatHistory(newHistory);

      try {
        const response = await interpretFile(base64File, fileType, profile);
        const aiContent = (response.error ? response.error : response.text) ?? "Analysis yielded no result.";
        setChatHistory([...newHistory, { role: 'ai', content: aiContent }]);
      } catch (err) {
        setChatHistory([...newHistory, { role: 'ai', content: "Failed to read the file." }]);
      } finally {
        setIsFileLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!profile.age || !profile.sex) {
      alert("Please fill in at least Age and Sex.");
      return;
    }
    setIsSaving(true);
    try {
      await saveProfile({
        age: parseInt(profile.age),
        sex: profile.sex,
        weight: profile.weight ? parseFloat(profile.weight) : undefined,
        height: profile.height ? parseFloat(profile.height) : undefined,
        conditions: profile.conditions,
        symptoms: profile.symptoms,
      });
      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert("❌ Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualResult) return;
    setIsAnalyzing(true);
    const newHistoryWithUser = [...chatHistory, { role: 'user', content: `Analyze: ${manualResult}` }];
    setChatHistory(newHistoryWithUser);

    try {
      const response = await interpretManualResults(manualResult, profile);
      const aiContent = (response.error ? response.error : response.text) ?? "Could not interpret results.";
      setChatHistory([...newHistoryWithUser, { role: 'ai', content: aiContent }]);
      setManualResult("");
    } catch (error) {
      setChatHistory([...newHistoryWithUser, { role: 'ai', content: 'Analysis failed.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);
    setUserMessage("");
    setIsChatting(true);

    try {
      const aiResponse = await getChatResponse(userMessage, chatHistory, profile);
      const content = typeof aiResponse === 'string' ? aiResponse : (aiResponse as any).text ?? "Service unavailable.";
      setChatHistory([...newHistory, { role: 'ai', content: content }]);
    } catch (err) {
      setChatHistory([...newHistory, { role: 'ai', content: "Connection error." }]);
    } finally {
      setIsChatting(false);
    }
  };

  // Styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.lightTeal, border: `2px solid ${colors.midTeal}`, borderRadius: "2.5rem",
    padding: "20px", display: "flex", flexDirection: "column", height: "430px"
  };
  const innerBoxStyle: React.CSSProperties = {
    backgroundColor: colors.white, borderRadius: "1.5rem", padding: "15px", flex: 1, display: "flex", 
    flexDirection: "column", border: "1px solid rgba(15, 185, 177, 0.05)", overflow: "hidden"
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 15px", borderRadius: "1rem", border: "none", outline: "none",
    fontWeight: "600", fontSize: "13px", backgroundColor: colors.white
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh", padding: "10px 20px 30px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0 20px 0" }}>
          <Activity size={32} color={colors.midTeal} />
          <h1 style={{ fontSize: "32px", fontWeight: "900", color: colors.darkTeal, margin: 0 }}>MedClarity</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: colors.darkTeal, textAlign: "center", marginBottom: "15px" }}>Upload Lab Report</h3>
            <label style={{ ...innerBoxStyle, border: `2px dashed ${colors.midTeal}33`, justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <Upload color={colors.midTeal} size={35} />
              <span style={{ color: colors.midTeal, fontWeight: "800", fontSize: "11px", marginTop: "10px" }}>
                {isFileLoading ? "PROCESSING..." : "SELECT IMAGE (JPG/PNG)"}
              </span>
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={isFileLoading} />
            </label>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: colors.darkTeal, textAlign: "center", marginBottom: "15px" }}>User Profile</h3>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
               <div style={{ display: "flex", gap: "8px" }}>
                  <input name="age" type="number" placeholder="Age" style={inputStyle} value={profile.age} onChange={handleInputChange}/>
                  <select name="sex" style={{ ...inputStyle, color: "#666" }} value={profile.sex} onChange={handleInputChange}>
                    <option value="">Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
               </div>
               <input name="weight" type="number" placeholder="Weight (kg)" style={inputStyle} value={profile.weight} onChange={handleInputChange}/>
               <textarea name="symptoms" placeholder="Symptoms" style={{ ...inputStyle, flex: 1, resize: "none" }} value={profile.symptoms} onChange={handleInputChange}/>
            </div>
            <button onClick={handleSaveProfile} disabled={isSaving} style={{ backgroundColor: colors.darkTeal, color: "white", padding: "14px", borderRadius: "1rem", border: "none", fontWeight: "bold", marginTop: "15px", cursor: isSaving ? "not-allowed" : "pointer" }}>
              {isSaving ? "Saving..." : "Update Profile"}
            </button>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: colors.darkTeal, textAlign: "center", marginBottom: "15px" }}>Manual Results</h3>
            <div style={innerBoxStyle}>
              <textarea 
                placeholder="e.g. Hemoglobin: 9.5 g/dL" 
                style={{ width: "100%", height: "100%", border: "none", outline: "none", resize: "none" }}
                value={manualResult}
                onChange={(e) => setManualResult(e.target.value)}
              />
            </div>
            <button onClick={handleManualSubmit} disabled={isAnalyzing} style={{ backgroundColor: colors.midTeal, color: "white", padding: "14px", borderRadius: "1rem", border: "none", fontWeight: "bold", marginTop: "15px", cursor: isAnalyzing ? "not-allowed" : "pointer" }}>
              {isAnalyzing ? "Analyzing..." : "Get Explanation"}
            </button>
          </div>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: "3rem", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <div style={{ padding: "15px 40px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: "15px" }}>
            <Activity size={24} color={colors.midTeal} />
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: colors.darkTeal, margin: 0 }}>AI Health Assistant</h2>
          </div>
          <div style={{ padding: "25px 40px", height: "350px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
            {chatHistory.map((msg, i) => (
              <div key={`msg-${i}`} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? colors.midTeal : colors.bg,
                color: msg.role === 'user' ? 'white' : colors.darkTeal,
                padding: "12px 20px", borderRadius: "1.5rem", maxWidth: "80%", fontSize: "14px", whiteSpace: "pre-wrap"
              }}>
                {msg.content}
              </div>
            ))}
            {(isChatting || isFileLoading) && <Loader2 className="animate-spin" color={colors.midTeal} size={20} />}
          </div>
          <div style={{ padding: "15px 40px", display: "flex", gap: "15px" }}>
            <input 
              placeholder="Ask a question..." 
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
              style={{ flex: 1, backgroundColor: colors.bg, padding: "15px 25px", borderRadius: "2rem", border: "none" }} 
            />
            <button onClick={handleChatSubmit} disabled={isChatting} style={{ backgroundColor: colors.midTeal, color: "white", padding: "0 35px", borderRadius: "2rem", border: "none", fontWeight: "bold" }}>
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}