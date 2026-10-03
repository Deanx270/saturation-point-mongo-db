const User = require('../models/User');

// Get Current User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.mongoUser._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update User Profile (MP2 Requirement)
const updateUserProfile = async (req, res) => {
  try {
    const { displayName } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    
    // If a file was uploaded to Cloudinary, update the photoURL
    if (req.file) {
      updateData.photoURL = req.file.path; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.mongoUser._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
