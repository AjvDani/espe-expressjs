const Speciality = require("../models/specialty");

const createSpecialityService = async (data) => {
    return await Speciality.create(data);
};

const listSpecialitiesService = async () => {
    return await Speciality.find();
};

module.exports = { createSpecialityService };