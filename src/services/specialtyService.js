const Speciality = require("../models/specialty");

const createSpecialtyService = async (data) => {
  return await Speciality.create(data);
};

const listSpecialtiesService = async () => {
    return await Speciality.find();
};

const getSpecialtiesService = async (id) => {
    return await Speciality.findById(id);
};

// findById + save (en vez de findByIdAndUpdate) para que se ejecuten el hook
// pre("validate") que regenera el slug y los validadores con `this` = documento.
const updateSpecialtyService = async (id, data) => {
    const specialty = await Speciality.findById(id);
    if (!specialty) return null;
    specialty.set(data);
    return await specialty.save();
};

const deleteSpecialtyService = async (id) => {
    return await Speciality.findByIdAndDelete(id);
};

module.exports = { createSpecialtyService, listSpecialtiesService, getSpecialtiesService, updateSpecialtyService, deleteSpecialtyService };
