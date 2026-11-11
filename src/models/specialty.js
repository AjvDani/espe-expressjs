const mongoose = require("mongoose");
const slugify = require("slugify");
const { isEmail } = require("validator"); // arriba del archivo

const specialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    validate: {
      validator: async function (value) {
        const existing = await mongoose.models.Specialty.findOne({
          name: value,
        });
        return !existing || existing._id.equals(this._id); // al actualizar, no choca consigo mismo
      },
      message: (props) => `La especialidad "${props.value}" ya existe`,
    },
  },
  code: {
    type: String,
    required: [true, "El código es obligatorio"],
    match: [/^[A-Z]{3}-\d{2}$/, "El código debe tener el formato ABC-01"],
  },
  description: {
    type: String,
    required: true,
    minlength: [50, "No se cumple la longitud mínima de 50"],
    maxlength: [300, "La descripción no puede superar 300 caracteres"],
  },
  area: {
    type: String,
    enum: {
      values: ["clinica", "quirurgica", "diagnostico"],
      message: "El área {VALUE} no es válida",
    },
    default: "clinica",
  },
  durationMinutes: {
    type: Number,
    default: 30,
    min: [15, "La consulta dura al menos 15 minutos"],
    max: [120, "La consulta dura como máximo 120 minutos"],
    validate: {
      validator: (value) => value % 15 === 0,
      message: (props) => `${props.value} no es múltiplo de 15 minutos`,
    },
  },
  contactEmail: {
    type: String,
    validate: [isEmail, "El correo de contacto no es válido"],
  },
  createdAt: Date,
  slug: {
    type: String,
    required: true,
  },
});

specialtySchema.virtual("info").get(function () {
  return `${this.name} (${this.code}): consulta de ${this.durationMinutes} minutos`;
});
specialtySchema.virtual("label").set(function (value) {
  const [code, ...rest] = value.split(" - ");
  this.code = code;
  this.name = rest.join(" - ");
});

specialtySchema.pre("validate", function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

module.exports = mongoose.model("Specialty", specialtySchema);
