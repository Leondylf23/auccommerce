const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dwyzuwtel",
  api_key: "866154417967977",
  api_secret: "FgaBjn-Uhp1VgtEQusYAA0Z8rRo",
});

const uploadToCloudinary = async (data, resourceType) =>
  new Promise((resolve, reject) => {
    let uploadStream;

    if (data.buffer) {
      uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: resourceType,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(data.buffer);
    } else {
      cloudinary.uploader
        .upload(data, {
          resource_type: resourceType,
          folder: resourceType,
        })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    }
  });

module.exports = {
  uploadToCloudinary,
};
