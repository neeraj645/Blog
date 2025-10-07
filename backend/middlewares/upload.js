// Single file upload
const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const response = await req.imageKit.upload({
      file: req.file.buffer, // Multer gives buffer
      fileName: req.file.originalname,
    });

    res.status(200).json({
      status: "success",
      url: response.url,
    });
  } catch (error) {
    next(error);
  }
};

// Multiple files upload
const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploads = await Promise.all(
      req.files.map(file =>
        req.imageKit.upload({
          file: file.buffer,
          fileName: file.originalname,
        })
      )
    );

    res.status(200).json({
      status: "success",
      files: uploads.map(u => ({ name: u.name, url: u.url })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadSingle, uploadMultiple };
