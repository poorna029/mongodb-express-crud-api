const express = require("express");

const router = express.Router();

const UserController = require("../Controllers/User.Controller")

module.exports = router;






// get all the users  ----------------------------------- 3

router.get("/" , UserController.getAllUsers )

// create user ------------------------------  2

router.post("/" , UserController.createUser )

// get/retrive user based on id/username/email -------------------------- 3 

router.get("/:input" , UserController.findUser , UserController.getUser )

// edit/update user details on id/username/email ------------------------ 4 

router.patch("/:input" , UserController.findUser, UserController.updateUser )


// delete user based on  id/username/email -----------------  5
router.delete("/:input" , UserController.findUser , UserController.deleteUser ) 

