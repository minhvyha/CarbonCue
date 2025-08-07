"use client";
import { useEffect, useState } from "react";
import { Earth } from "lucide-react";

const tips = [
  "Did you know switching to cold water laundry saves 90% energy?",
  "Take shorter showers to save both water and heating energy.",
  "Cycling instead of driving just twice a week cuts 300kg of CO₂ annually.",
  "Buy in bulk to reduce packaging waste and carbon emissions.",
  "Eat local produce to lower the emissions from transport.",
  "Unplug idle electronics to avoid phantom energy use.",
  "Go vegetarian once a week to reduce your carbon footprint.",
  "Fixing a leaky tap can save over 3,000 gallons of water per year.",
  "Did you know that 10% of global greenhouse gas emissions come from food waste?",
  "Each tree planted offsets approximately 22kg of CO₂ annually.",
  "Did you know that 10% of global greenhouse gas emissions come from food waste?",
];

export default function CarbonQuote() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    // Pick a random tip when the component mounts
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  return (
    <div>
      <div className="rounded-md border-l-4 border-green-500 bg-green-50 p-4 shadow-md">
        <h2 className="text-lg font-bold text-green-800 mb-1">
          🌱 Did you know?
        </h2>
        <p className="text-sm text-green-700">{tip}</p>
      </div>
    </div>
  );
}
