const { Router } = require("express");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const reservations = require("./reservations");
const appointments = require("./appointments");
const specialities = require("./specialties");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/specialties", specialities);
router.use("/reservations", reservations);
router.use("/users", appointments);

module.exports = router;
