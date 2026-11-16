const Speciality = require("../models/specialty");

// Campos que el cliente puede modificar (slug se genera solo; _id y createdAt no se tocan).
const UPDATABLE_FIELDS = ["name", "code", "description", "area", "durationMinutes", "contactEmail"];

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
    for(const field of UPDATABLE_FIELDS) {
        if(data[field] !== undefined) {
            specialty.set(field, data[field]);
        }
    }
    return await specialty.save();
};

const deleteSpecialtyService = async (id) => {
    return await Speciality.findByIdAndDelete(id);
};

// Valores permitidos del enum "area" definidos en el modelo.
const isValidArea = (area) => Speciality.schema.path("area").enumValues.includes(area);

const deleteByAreaService = async (area) => {
    return await Speciality.deleteMany({ area });
};

module.exports = { createSpecialtyService, listSpecialtiesService, getSpecialtiesService, updateSpecialtyService, deleteSpecialtyService, deleteByAreaService, isValidArea };
