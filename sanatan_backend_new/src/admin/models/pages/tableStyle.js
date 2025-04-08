const mongoose = require("mongoose");
const { Schema } = mongoose;

const TableStyleSchema = new Schema(
  {
    Availability: {
      type: Object,
    }, // Array of strings for availability
    Media: [
      {
        type: String,
      },
    ], // Array of strings for media
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    innertitle: {
      type: String,
    },
    innerdescription: {
      type: String,
    },
    middletitle: {
      type: String,
    },
    middledescription: {
      type: String,
    },
    middleinfo: {
      type: String,
    },
    audiodescription: {
      type: String,
    },
    videodescription: {
      type: String,
    },
    documentsdescription: {
      type: String,
    },
    audio: [
      {
        type: String,
      },
    ], // Array of strings for audio files
    video: [
      {
        type: String,
      },
    ], // Array of strings for video files
    documents: [
      {
        type: String,
      },
    ], // Array of strings for document files
    Language: {
      type: String,
      required: true,
    },
    tables: [
      {
        tableName: { type: String },
        columns: { type: [String] },
        values: { type: Object, default: {} }, // Stores column values dynamically
        mediaOption: {
          type: String,
          enum: ["audio", "video", "pdf", "all", ""],
          default: "",
        },
        tableaudiodescription: {
          type: String,
        },
        tablevideodescription: {
          type: String,
        },
        tabledocumentsdescription: {
          type: String,
        },
        tableaudio: { type: [String], default: [] },
        tablevideo: { type: [String], default: [] },
        tabledocuments: { type: [String], default: [] },
      },
    ],
    faqtitle: { type: String },
    faqdescription: { type: String },
    Page: {
      type: Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TableStyle", TableStyleSchema);
