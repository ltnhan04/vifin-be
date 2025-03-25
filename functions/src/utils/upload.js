const path = require("path");
const { format } = require("util");
const { bucket } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");

const uploadImage = (req, _res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }
  const imageFile = req.files[0];
  const fileTypes = /jpeg|jpg|png|gif/;
  const maxFileSize = 5 * 1024 * 1024;

  if (imageFile.size > maxFileSize) {
    return next(
      new ErrorHandler(`Your file size must below ${maxFileSize}`, 400)
    );
  }

  const extname = path.extname(imageFile.originalname).toLowerCase();

  if (!fileTypes.test(extname) || !fileTypes.test(imageFile.mimetype)) {
    return next(new ErrorHandler("Mime type is not supported", 400));
  }

  next();
};

const createImageUrl = async (imageFile) => {
  const fileName = `image/${Date.now()}_${imageFile.originalname}`;
  const file = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: imageFile.mimetype,
      },
      public: true,
    });

    blobStream.on("error", (err) => reject(err));

    blobStream.on("finish", () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${file.name}`
      );
      resolve(publicUrl);
    });

    blobStream.end(imageFile.buffer);
  });
};

const deleteImageFromStorage = async (imageUrl) => {
  try {
    const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
    const encodedUrl = imageUrl.split(/[?#]/)[0];
    const filePath = encodedUrl.startsWith(baseUrl)
      ? encodedUrl.slice(baseUrl.length)
      : null;

    if (!filePath) {
      throw new ErrorHandler("Invalid image url", 400);
    }

    await bucket.file(filePath).delete();
  } catch (error) {
    if (error.code === 404) {
      throw new ErrorHandler("Image not found", 404);
    }
    throw new ErrorHandler(error.message, 500);
  }
};

module.exports = {
  uploadImage,
  createImageUrl,
  deleteImageFromStorage,
};
