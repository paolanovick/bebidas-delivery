import mongoose from "mongoose";

const PublicidadSchema = new mongoose.Schema(
  {
    imagenUrl: {
      type: String,
      required: false,
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Publicidad", PublicidadSchema);
