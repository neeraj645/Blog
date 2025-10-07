const imagekit = require("../config/imageKit");

const uploadToImageKit = async (req, folder) => {
  return await imagekit.upload({
    file: req.file.buffer,  // Buffer from multer
    fileName: req.file.originalname, // original filename
    folder: folder  // Optional: specify a folder in ImageKit
  });
};

const removeFromImageKit = async (fileId) => {
    try {
    return await imagekit.deleteFile(fileId);

    } catch (error) {
        console.error("Error deleting file from ImageKit");
    }}

module.exports = { uploadToImageKit, removeFromImageKit };
