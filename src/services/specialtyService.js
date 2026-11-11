const Speciality = require("../models/specialty");

const createSpecialtyService = async (data) => {
  return await Speciality.create(data);
};

module.exports = { createSpecialtyService };
