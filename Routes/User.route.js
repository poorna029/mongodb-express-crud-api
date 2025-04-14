const express = require("express");

const router = express.Router();

const UserController = require("../Controllers/User.Controller")

module.exports = router;






// get all the users  ----------------------------------- 3

router.get("/",UserController.getAllUsers)

// create user ------------------------------  2

router.post("/",UserController.createUser)

// get/retrive user based on id -------------------------- 3 

router.get("/:id",UserController.is_found, UserController.getUserById)

// edit/update user details on id ------------------------ 4 

router.patch("/:id",UserController.is_found, UserController.updateUserById)


// delete user based on  id -----------------  5
router.delete("/:id",UserController.is_found, UserController.deleteUserById)

