// seedGpus.js
const mongoose = require("mongoose");

// GPU model schema
const gpuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  watt: { type: Number, required: true },
});

const Gpu = mongoose.models.Gpu || mongoose.model("Gpu", gpuSchema);

// Your GPU dataset
const gpuData = [
  { name: "A100 PCIe 40/80GB", watt: 250 },
  { name: "A100 SXM4 80 GB", watt: 400 },
  { name: "AGX Xavier", watt: 30 },
  { name: "AMD RX480", watt: 150 },
  { name: "GIGABYTE GTX 1660 OC", watt: 120 },
  { name: "GTX 1080 Ti", watt: 250 },
  { name: "GTX 1080", watt: 180 },
  { name: "GTX 750", watt: 250 },
  { name: "GTX TITAN X", watt: 250 },
  { name: "Quadro K6000", watt: 225 },
  { name: "Quadro P6000", watt: 250 },
  { name: "RTX 2080 Ti", watt: 250 },
  { name: "RTX 2080", watt: 215 },
  { name: "RTX 8000", watt: 260 },
  { name: "T4", watt: 70 },
  { name: "Tesla K40c", watt: 245 },
  { name: "Tesla K80", watt: 300 },
  { name: "Tesla M40 24GB", watt: 250 },
  { name: "Tesla P100", watt: 250 },
  { name: "Tesla P40", watt: 250 },
  { name: "Tesla V100-PCIE-16GB", watt: 300 },
  { name: "Tesla V100-SXM2-16GB", watt: 250 },
  { name: "Tesla V100-SXM2-32GB", watt: 300 },
  { name: "Titan RTX", watt: 280 },
  { name: "Titan V", watt: 250 },
  { name: "TITAN X Pascal", watt: 250 },
  { name: "Titan Xp", watt: 250 },
  { name: "TPUv2 Chip", watt: 221 },
  { name: "TPUv3 Chip", watt: 283 },
  { name: "RTX 3080", watt: 320 },
  { name: "RTX 3080 TI", watt: 350 },
  { name: "RTX 3090", watt: 350 },
  { name: "RTX 4090", watt: 300 },
  { name: "RTX A4000", watt: 140 },
  { name: "RTX A5000", watt: 230 },
  { name: "RTX A6000", watt: 300 },
  { name: "Intel Xeon E5-2699", watt: 145 },
  { name: "Intel Xeon E5-2630v4", watt: 85 },
  { name: "Intel Xeon E5-2650", watt: 105 },
  { name: "Intel Xeon Gold 5220", watt: 125 },
  { name: "Intel Xeon Gold 6148", watt: 150 },
  { name: "L4", watt: 72 },
  { name: "AMD EPYC 7763", watt: 280 },
  { name: "AMD EPYC 7282", watt: 120 },
  { name: "AMD EPYC 7702", watt: 200 },
];

// Run seeding
(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourdbname");
    console.log("✅ Connected to MongoDB");

    await Gpu.deleteMany({});
    await Gpu.insertMany(gpuData);

    console.log("🎯 GPU data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding GPUs:", err);
    process.exit(1);
  }
})();
