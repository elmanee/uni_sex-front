export interface Estudiante {
  id: number;
  matricula: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;

  // 🏠 Dirección
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;

  // ☎️ Teléfonos
  telefono_casa: string;
  telefono_estudiante: string;
  telefono_tutor: string;

  // 📧 Información académica
  email: string;
  bachillerato_id: number;
  promedio: string;
  especialidad_id: number;
  carrera_id: number;

  // 👨‍👩‍👧‍👦 Datos familiares
  nombre_madre: string;
  apellido_paterno_madre: string;
  apellido_materno_madre: string;

  nombre_padre: string;
  apellido_paterno_padre: string;
  apellido_materno_padre: string;

  // 📎 Archivos y URLs
  foto_url: string;
  certificado_url: string;
  comprobante_domicilio_url: string;

  // 🕒 Fecha de registro
  fecha_registro: string; // o Date si prefieres
}
