var express = require('express');
var router = express.Router();

const license = require("../controllers/license.controller.js");

router.post("/", license.create);
// Retrieve all Tutorials
router.get("/", license.findAll);
// Retrieve a single Tutorial with id
router.get("/:id", license.findOne);
// Update a Tutorial with id
router.put("/:id", license.update);
// Delete a Tutorial with id
router.delete("/:id", license.delete);
// Delete all Tutorials
router.delete("/", license.deleteAll);

module.exports = router;
