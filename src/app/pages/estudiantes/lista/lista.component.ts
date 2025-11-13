import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudiantesService } from '../../../core/services/estudiantes.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AlertasService } from '../../../core/services/alertas.service';
import { Estudiante } from '../../../core/models/estudiante.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  
  // --- Listas Maestras ---
  estudiantes: Estudiante[] = [];
  carreras: any[] = [];
  especialidades: any[] = [];
  bachilleratos: any[] = [];

  // --- Listas para Vista ---
  filtrados: Estudiante[] = [];
  estudiantesPaginados: Estudiante[] = [];

  // --- Filtros ---
  filtroMatricula = '';
  filtroCarrera: any = ''; 
  filtroEspecialidad: any = '';

  // --- Paginación ---
  itemsPorPagina = 10;
  opcionesItemsPorPagina = [5, 10, 15, 25];
  paginaActual = 1;
  totalItems = 0;

  // --- 🚀 Control de Estado del Formulario ---
  mostrarFormulario: boolean = false;
  formStep: number = 1;
  isLoading: boolean = false;
  modoFormulario: 'crear' | 'editar' = 'crear';
  estudianteSeleccionado: Estudiante | null = null;
  serverUrl = 'http://localhost:3000'; // URL base del backend para archivos

  // --- Modelo para el Formulario ---
  nuevoEstudiante: Partial<Estudiante> = {};

  // --- Manejo de Archivos ---
  archivos: {
    foto: File | null;
    certificado: File | null;
    comprobante: File | null;
  } = {
    foto: null,
    certificado: null,
    comprobante: null,
  };
  
  fotoNombre: string = '';
  certificadoNombre: string = '';
  comprobanteNombre: string = '';

  // --- Referencias a Inputs ---
  @ViewChild('fotoInput') fotoInput!: ElementRef;
  @ViewChild('certificadoInput') certificadoInput!: ElementRef;
  @ViewChild('comprobanteInput') comprobanteInput!: ElementRef;

  constructor(
    private estudiantesService: EstudiantesService,
    private catalogosService: CatalogosService,
    private alertas: AlertasService 
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarEstudiantes();
  }

  // --- Carga de Datos ---
  cargarCatalogos(): void {
    this.catalogosService.obtenerCatalogo('carreras').subscribe({
      next: (res) => (this.carreras = res.data || []),
      error: (err) => this.alertas.error('Error al cargar carreras')
    });
    this.catalogosService.obtenerCatalogo('especialidades').subscribe({
      next: (res) => (this.especialidades = res.data || []),
      error: (err) => this.alertas.error('Error al cargar especialidades')
    });
    this.catalogosService.obtenerCatalogo('bachilleratos').subscribe({
      next: (res) => (this.bachilleratos = res.data || []),
      error: (err) => this.alertas.error('Error al cargar bachilleratos')
    });
  }

  cargarEstudiantes(): void {
    this.estudiantesService.obtenerEstudiantes().subscribe({
      next: (res) => {
        this.estudiantes = res.data || [];
        this.aplicarFiltros(); 
      },
      error: (err) => this.alertas.error('Error al cargar estudiantes')
    });
  }

  // --- Lógica de Filtro y Paginación (sin cambios) ---
  aplicarFiltros(): void {
    this.filtrados = this.estudiantes.filter((e) => {
      const porMatricula = e.matricula
        ?.toLowerCase()
        .includes(this.filtroMatricula.toLowerCase());
      const porCarrera = !this.filtroCarrera || e.carrera_id == this.filtroCarrera;
      const porEspecialidad = !this.filtroEspecialidad || e.especialidad_id == this.filtroEspecialidad;
      return porMatricula && porCarrera && porEspecialidad;
    });
    this.totalItems = this.filtrados.length;
    this.paginaActual = 1;
    this.actualizarEstudiantesPaginados();
  }

  limpiarFiltros(): void {
    this.filtroMatricula = '';
    this.filtroCarrera = '';
    this.filtroEspecialidad = '';
    this.aplicarFiltros();
  }

  actualizarEstudiantesPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.estudiantesPaginados = this.filtrados.slice(inicio, fin);
  }

  onItemsPorPaginaChange(): void {
    this.paginaActual = 1;
    this.actualizarEstudiantesPaginados();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.getTotalPaginas()) {
      this.paginaActual = nuevaPagina;
      this.actualizarEstudiantesPaginados();
    }
  }

  getTotalPaginas(): number {
    if (this.totalItems === 0) return 1;
    return Math.ceil(this.totalItems / this.itemsPorPagina);
  }

  // --- Helpers ---
  getCarreraNombre(id: number): string {
    const c = this.carreras.find((x) => x.id === id);
    return c ? c.nombre : '—';
  }

  getEspecialidadNombre(id: number): string {
    const e = this.especialidades.find((x) => x.id === id);
    return e ? e.nombre : '—';
  }

  // --- 🚀 Métodos para Stepper y Formulario ---
  nextStep(): void {
    this.formStep++;
  }

  prevStep(): void {
    this.formStep--;
  }

  // Resetea el formulario a su estado inicial de "Crear"
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.formStep = 1;
    this.modoFormulario = 'crear';
    this.estudianteSeleccionado = null;
    this.nuevoEstudiante = {
      promedio: undefined,
      carrera_id: undefined,
      bachillerato_id: undefined,
      especialidad_id: undefined
    };
    this.resetArchivos();
  }

  // --- 🚀 Manejo de Archivos (sin cambios) ---
  onFotoChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.archivos.foto = file;
      this.fotoNombre = file.name;
    } else {
      this.eliminarArchivo('foto');
    }
  }

  onCertificadoChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.archivos.certificado = file;
      this.certificadoNombre = file.name;
    } else {
      this.eliminarArchivo('certificado');
    }
  }

  onComprobanteChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.archivos.comprobante = file;
      this.comprobanteNombre = file.name;
    } else {
      this.eliminarArchivo('comprobante');
    }
  }

  eliminarArchivo(tipo: 'foto' | 'certificado' | 'comprobante'): void {
    if (tipo === 'foto') {
      this.archivos.foto = null;
      this.fotoNombre = '';
      if (this.fotoInput) this.fotoInput.nativeElement.value = '';
    } else if (tipo === 'certificado') {
      this.archivos.certificado = null;
      this.certificadoNombre = '';
      if (this.certificadoInput) this.certificadoInput.nativeElement.value = '';
    } else if (tipo === 'comprobante') {
      this.archivos.comprobante = null;
      this.comprobanteNombre = '';
      if (this.comprobanteInput) this.comprobanteInput.nativeElement.value = '';
    }
  }

  resetArchivos(): void {
    this.eliminarArchivo('foto');
    this.eliminarArchivo('certificado');
    this.eliminarArchivo('comprobante');
  }

  // --- 🚀 Métodos de Acción (CRUD) ---

  /**
   * 🚀 VER DETALLES (READ)
   * Muestra un modal con la foto y enlaces de descarga.
   */
  verDetalles(item: Estudiante): void {
    const fotoHtml = item.foto_url
      ? `<img src="${this.serverUrl + item.foto_url}" alt="Foto" class="rounded-lg w-32 h-32 object-cover mx-auto mb-4 border border-slate-200 shadow-sm">`
      : `<div class="rounded-lg w-32 h-32 bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">Sin Foto</div>`;

    const certHtml = item.certificado_url
      ? `<a href="${this.serverUrl + item.certificado_url}" target="_blank" class="text-emerald-600 hover:text-emerald-700 font-medium">Descargar Certificado (PDF)</a>`
      : `<span class="text-slate-500">No disponible</span>`;

    const compHtml = item.comprobante_domicilio_url
      ? `<a href="${this.serverUrl + item.comprobante_domicilio_url}" target="_blank" class="text-emerald-600 hover:text-emerald-700 font-medium">Descargar Comprobante (PDF)</a>`
      : `<span class="text-slate-500">No disponible</span>`;

    Swal.fire({
      title: 'Detalles del Estudiante',
      html: `
        <div class="text-left space-y-4 p-4">
          ${fotoHtml}
          <p class="text-center text-xl font-bold text-slate-800">${item.nombre} ${item.apellido_paterno}</p>
          <p class="text-center text-sm text-slate-500 -mt-3">${item.matricula}</p>
          
          <div class="border-t border-slate-200 pt-4">
            <h3 class="font-semibold text-slate-700 mb-2">Información de Contacto</h3>
            <p><strong>Email:</strong> ${item.email}</p>
            <p><strong>Teléfono:</strong> ${item.telefono_estudiante}</p>
            <p><strong>Tutor:</strong> ${item.telefono_tutor}</p>
          </div>

          <div class="border-t border-slate-200 pt-4">
            <h3 class="font-semibold text-slate-700 mb-2">Archivos</h3>
            <p><strong>Certificado:</strong> ${certHtml}</p>
            <p><strong>Comprobante:</strong> ${compHtml}</p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#10b981'
    });
  }

  /**
   * 🚀 INICIAR EDICIÓN (UPDATE)
   * Prepara el formulario para editar un estudiante.
   */
  editar(item: Estudiante): void {
    this.estudianteSeleccionado = { ...item }; // Copia el item para evitar mutaciones
    this.nuevoEstudiante = { ...item }; // Rellena el modelo del formulario
    this.modoFormulario = 'editar';
    
    this.resetArchivos(); // Limpia la selección de archivos nuevos
    
    this.mostrarFormulario = true;
    this.formStep = 1;
  }

  /**
   * 🚀 ELIMINAR (DELETE)
   * (Esta función ya estaba bien)
   */
  eliminar(item: Estudiante): void {
    if (!item.matricula) {
      this.alertas.error("Error: No se puede eliminar un estudiante sin matrícula.");
      return;
    }
    const matricula = item.matricula;

    this.alertas.confirm(
      `Se eliminará al estudiante ${item.nombre} con matrícula ${matricula}.`,
      '¿Estás seguro de eliminar?',
      'Sí, eliminar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        this.estudiantesService.eliminarEstudiante(matricula).subscribe({
          next: () => {
            this.alertas.success('Estudiante eliminado correctamente.');
            this.cargarEstudiantes(); 
          },
          error: (err) => this.alertas.error('Error al eliminar estudiante.')
        });
      }
    });
  }

  /**
   * 🚀 Controlador principal del formulario (Decide si crear o actualizar)
   */
  submitFormulario(): void {
    if (this.modoFormulario === 'crear') {
      this.submitCreacion();
    } else {
      this.submitActualizacion();
    }
  }

  /**
   * 🚀 Lógica de CREACIÓN
   */
  submitCreacion(): void {
    this.isLoading = true;

    // En modo 'crear', todos los archivos son obligatorios
    if (!this.archivos.foto || !this.archivos.certificado || !this.archivos.comprobante) {
      this.alertas.error('Debes cargar los 3 archivos requeridos: Foto, Certificado y Comprobante.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    
    // Adjuntar campos de texto
    Object.keys(this.nuevoEstudiante).forEach(key => {
      const value = this.nuevoEstudiante[key as keyof Estudiante];
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Adjuntar archivos (obligatorios)
    formData.append('foto', this.archivos.foto);
    formData.append('certificado', this.archivos.certificado);
    formData.append('comprobante', this.archivos.comprobante);

    this.estudiantesService.registrarEstudiante(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.alertas.success('¡Estudiante registrado exitosamente!');
        this.cancelarFormulario();
        this.cargarEstudiantes();
      },
      error: (err) => {
        this.isLoading = false;
        this.alertas.error(err.error?.error || 'Error al registrar estudiante.');
      }
    });
  }

  /**
   * 🚀 Lógica de ACTUALIZACIÓN
   */
  submitActualizacion(): void {
    if (!this.estudianteSeleccionado?.matricula) {
      this.alertas.error("Error: No se ha seleccionado un estudiante para actualizar.");
      return;
    }

    this.isLoading = true;
    const matricula = this.estudianteSeleccionado.matricula;
    const formData = new FormData();

    // Adjuntar campos de texto
    Object.keys(this.nuevoEstudiante).forEach(key => {
      const value = this.nuevoEstudiante[key as keyof Estudiante];
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Adjuntar archivos SÓLO SI se seleccionó uno nuevo
    if (this.archivos.foto) {
      formData.append('foto', this.archivos.foto);
    }
    if (this.archivos.certificado) {
      formData.append('certificado', this.archivos.certificado);
    }
    if (this.archivos.comprobante) {
      formData.append('comprobante', this.archivos.comprobante);
    }

    this.estudiantesService.actualizarEstudiante(matricula, formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.alertas.success('¡Estudiante actualizado exitosamente!');
        this.cancelarFormulario();
        this.cargarEstudiantes();
      },
      error: (err) => {
        this.isLoading = false;
        this.alertas.error(err.error?.error || 'Error al actualizar estudiante.');
      }
    });
  }
}