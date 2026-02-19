"use client"

import { useState } from "react";
import { Info } from "lucide-react";

export default function UserProfileForm() {
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    conditions: "",
    symptoms: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#E8F6F5] border-2 border-[#0FB9B1] rounded-3xl p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-[#087E7A] mb-6 text-center">User Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#087E7A] uppercase ml-1">Age</label>
          <div className="relative mt-1">
            <input 
              type="number" 
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="e.g. 25" 
              className="w-full p-3 rounded-xl border border-teal-100 outline-none text-sm pr-10 focus:ring-2 focus:ring-[#0FB9B1]" 
            />
            <Info className="absolute right-3 top-3 text-slate-300" size={18} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#087E7A] uppercase ml-1">Weight (kg)</label>
          <div className="relative mt-1">
            <input 
              type="number" 
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              placeholder="e.g. 70" 
              className="w-full p-3 rounded-xl border border-teal-100 outline-none text-sm pr-10 focus:ring-2 focus:ring-[#0FB9B1]" 
            />
            <Info className="absolute right-3 top-3 text-slate-300" size={18} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#087E7A] uppercase ml-1">Conditions</label>
          <input 
            type="text" 
            name="conditions"
            value={profile.conditions}
            onChange={handleChange}
            placeholder="e.g. Diabetes, Asthma" 
            className="w-full p-3 mt-1 rounded-xl border border-teal-100 outline-none text-sm focus:ring-2 focus:ring-[#0FB9B1]" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#087E7A] uppercase ml-1">Symptoms</label>
          <input 
            type="text" 
            name="symptoms"
            value={profile.symptoms}
            onChange={handleChange}
            placeholder="e.g. Fatigue, Headaches" 
            className="w-full p-3 mt-1 rounded-xl border border-teal-100 outline-none text-sm focus:ring-2 focus:ring-[#0FB9B1]" 
          />
        </div>
      </div>
    </div>
  );
}