// Mongoose schema for a “guide”
const mongoose = require("mongoose");
const { Schema } = mongoose;

const GuideSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  heroImage: { type: String, required: true }, // URL of the hero image
  presentationLink: { type: String, required: true }, // URL to the slide deck or presentation
  contents: [
    // Optional, same shape as your course.contents
    {
      order: Number,
      title: String,
      description: String,
      takeaways: [String],
      youtubeUrl: String,
    },
  ],
  type: { type: String, default: "guide" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Guide", GuideSchema);
