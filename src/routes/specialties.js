const { Router } = require("express");
const { createSpecialty } = require("../controllers/specialtyController");
const router = Router();

router.post("/", createSpecialty);
module.exports = router;
