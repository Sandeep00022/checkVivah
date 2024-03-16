const userFiles = require("../models/userFiles.model.js");
const errorHandler = require("../utils/error.js");

const uploadFile = async (req, res, next) => {
  try {
    const { name, size, type, fileUrl } = req.body;
    
    if (!name || !size || !type || !fileUrl) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const uploadedFile = await userFiles.find({ createdBy: req.user.id });

    if (uploadedFile && uploadedFile.length > 0) {
      for (const file of uploadedFile) {
        if (file.name === name) {
          return next(errorHandler(409, "The requested file is already uploaded"));
        }
      }
    }

    const newFile = new userFiles({
      name,
      size,
      type,
      fileUrl,
      createdBy: req.user.id,
    });

    await newFile.save();
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    next(errorHandler(error.statusCode || 500, error.message || "Internal Server Error"));
  }
};

const getUserFiles = async (req, res, next) => {
  try {
    const files = await userFiles.find({ createdBy: req.user.id });
    res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      data: files,
    });
  } catch (error) {
    next(errorHandler(error.statusCode || 500, error.message || "Internal Server Error"));
  }
};

module.exports = { uploadFile, getUserFiles };
