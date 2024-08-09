const express = require("express")
const router = express.Router()



const { auth } = require("../MiddleWare/auth");
const {deleteAccount, updateProfile, getAllUserDetails, updateDisplayPicture} = require("../Controller/Profile");
   
    
//  Profile routes  
//------------------                                                  *
router.delete("/deleteProfile", auth, deleteAccount)                   
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)


module.exports = router

 