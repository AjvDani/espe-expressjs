const { Router } = require("express");
const { createSpecialty, listSpecialty , getSpecialty, updateSpecialty, deleteSpecialty} = require("../controllers/specialtyController");
const router = Router();

router.post("/", createSpecialty);
router.get("/", listSpecialty);
router.get("/:id", getSpecialty);
router.post("/:id", updateSpecialty);
router.delete("/:id", deleteSpecialty);

module.exports = router;


