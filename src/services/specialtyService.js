const Speciality = require("../models/specialty");

const createSpecialtyService = async (data) => {
  return await Speciality.create(data);
};

const listSpecialitiesService = async () => {
    return await Speciality.find();
};

module.exports = { createSpecialtyService, listSpecialitiesService };
