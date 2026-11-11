const { Router } = require("express");
const { createSpecialty, listSpecialty } = require("../controllers/specialtyController");
const router = Router();

router.post("/", createSpecialty);
router.get("/", listSpecialty);

module.exports = router;


