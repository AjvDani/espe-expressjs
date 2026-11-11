require("../services/specialityService");

const handleError = (res, error) => {
    if (error.name === "ValidationError") {
        return res.status(400).json({ error: "Error de validación", details: error.errors });
    }
    if (error.name === "CastError") {
        return res.status(400).json({ error: "Error de conversión de tipo", details: error.message });
    }
    return res.status(500).json({ error: "Error en el servidor" });
};