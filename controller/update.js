import User from "../model/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const UpdateProfile = async (req, res) => {
  const { name, discription, phone } = req.body;

  try {
    const userId = req.userId;
    if (!userId)
      return res.status(401).json({
        message: "Unauthorized User — please login first",
        success: false,
      });

    let uploadedFileUrl = null;

    if (req.file) {
      // ✅ Upload to Cloudinary
      uploadedFileUrl = await cloudinary.uploader.upload(req.file.path, {
        folder: "LMS_PROFILE_PHOTO",
      });

      // ✅ Delete temp file safely
      fs.unlinkSync(req.file.path);
    }

    // ✅ Prepare update data
    let updateFields = {
      name,
      discription,
      phone,
    };

    // ✅ Only update photo if new image uploaded
    if (uploadedFileUrl && uploadedFileUrl.secure_url) {
      updateFields.photoUrl = uploadedFileUrl.secure_url;
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser ,
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
