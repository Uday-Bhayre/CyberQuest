const mongoose = require("mongoose")
const Profile = require("../Model/Profile")
const Progress = require("../Model/Profile");
const User = require("../Model/User");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");


// update profile details
exports.updateProfile = async (req, res) => {
  try {
    const { firstName = "", lastName = "", dateOfBirth = "", about = "", contactNumber = "", gender = "", image = "", linkedInUrl = "", githubUrl = "" } = req.body;
    const id = req.user.id;

    // Find the user and profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    // Create an object to hold updates
    const userUpdates = {};
    const profileUpdates = {};

    // Only add fields that are not empty
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (image) userUpdates.image = image;

    if (dateOfBirth) profileUpdates.dateOfBirth = dateOfBirth;
    if (about) profileUpdates.about = about;
    if (contactNumber) profileUpdates.contactNumber = contactNumber;
    if (gender) profileUpdates.gender = gender;
    if (linkedInUrl) profileUpdates.linkedInUrl = linkedInUrl;
    if (githubUrl) profileUpdates.githubUrl = githubUrl;

    // Update the user if there are any changes
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(id, userUpdates);
    }

    // Update the profile if there are any changes
    if (Object.keys(profileUpdates).length > 0) {
      await Profile.findByIdAndUpdate(userDetails.additionalDetails, profileUpdates);
    }

    // Find the updated user details
    const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    const user = await User.findById({ _id: id })
    if(!user) {
      return res.status(404).json({ success: false,  message: "User not found", })
    }

    // Delete Assosiated Profile with the User , note we used here "new mongoose.Types.ObjectId()" to convert string into object;
    await Profile.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(user.additionalDetails), })
      
    

    // Now Delete User
    await User.findByIdAndDelete({ _id: id })

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })

    await Progress.deleteMany({ userId: id });
  } 
  catch (error){
         res.status(500).json({ success: false, message: "User Cannot be deleted successfully" }) 
    }
}


exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id).populate("additionalDetails").exec()
       
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.updateDisplayPicture = async (req, res) => {
  try {
    
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(displayPicture,  process.env.FOLDER_NAME,  1000,  1000 )
      
    const updatedProfile = await User.findByIdAndUpdate({ _id: userId }, { image: image.secure_url },  { new: true })
     
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


