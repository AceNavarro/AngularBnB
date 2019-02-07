const upload = require("../services/image-upload");
const singleUpload = upload.single("image");

exports.uploadImage = async (req, res) => {
  singleUpload(req, res, function(err) {
    if (err) {
      if (err.message) {
        return res.status(422).send({ errors: [{ 
          title: "Image upload error", 
          detail: err.message }]});
      } else {
        return res.status(422).send({ errors: [{ 
          title: "Image upload error", 
          detail: "Cannot upload the image file to server. Please try again later." }]});
      }
    }

    return res.json({ "imageUrl": req.file.location });
  });

};