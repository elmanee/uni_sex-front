import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AlertasService } from '../../../core/services/alertas.service';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {
  
  // --- Listas de datos COMPLETAS (de la BD) ---
  carreras: any[] = [];
  bachilleratos: any[] = [];
  especialidades: any[] = [];

  // --- Listas PAGINADAS (para mostrar en la tabla) ---
  carrerasPaginadas: any[] = [];
  bachiPaginados: any[] = [];
  especPaginadas: any[] = [];

  // --- Control de Paginación ---
  itemsPorPagina = 15; // Valor por defecto
  opcionesItemsPorPagina = [5, 10, 15, 25]; // Opciones para el select
  
  paginacionCarreras = { paginaActual: 1, totalItems: 0 };
  paginacionBachi = { paginaActual: 1, totalItems: 0 };
  paginacionEspec = { paginaActual: 1, totalItems: 0 };


  activeTab: 'carreras' | 'bachilleratos' | 'especialidades' = 'carreras';

  mostrarModal = false;
  modoEdicion = false;
  tipoCatalogo: 'carreras' | 'bachilleratos' | 'especialidades' | null = null;
  itemActual: any = {};
  itemEditandoId: number | null = null;

  constructor(
    private catalogosService: CatalogosService,
    private alerts: AlertasService
  ) {}

  ngOnInit(): void {
    this.cargarCarreras();
    this.cargarBachilleratos();
    this.cargarEspecialidades();
  }

  cargarCarreras(): void {
    this.catalogosService.obtenerCatalogo('carreras').subscribe({
      next: (res) => {
        this.carreras = res.data || [];
        this.paginacionCarreras.totalItems = this.carreras.length;
        this.paginacionCarreras.paginaActual = 1; 
        this.actualizarCarrerasPaginadas();
      },
      error: (err) => this.alerts.error('Error al cargar carreras')
    });
  }

  cargarBachilleratos(): void {
    this.catalogosService.obtenerCatalogo('bachilleratos').subscribe({
      next: (res) => {
        this.bachilleratos = res.data || [];
        this.paginacionBachi.totalItems = this.bachilleratos.length;
        this.paginacionBachi.paginaActual = 1;
        this.actualizarBachiPaginados();
      },
      error: (err) => this.alerts.error('Error al cargar bachilleratos')
    });
  }

  cargarEspecialidades(): void {
    this.catalogosService.obtenerCatalogo('especialidades').subscribe({
      next: (res) => {
        this.especialidades = res.data || [];
        this.paginacionEspec.totalItems = this.especialidades.length;
        this.paginacionEspec.paginaActual = 1;
        this.actualizarEspecPaginados();
      },
      error: (err) => this.alerts.error('Error al cargar especialidades')
    });
  }

  // --- Métodos de Paginación ---

  actualizarCarrerasPaginadas(): void {
    const pagina = this.paginacionCarreras.paginaActual;
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.carrerasPaginadas = this.carreras.slice(inicio, fin);
  }

  actualizarBachiPaginados(): void {
    const pagina = this.paginacionBachi.paginaActual;
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.bachiPaginados = this.bachilleratos.slice(inicio, fin);
  }

  actualizarEspecPaginados(): void {
    const pagina = this.paginacionEspec.paginaActual;
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.especPaginadas = this.especialidades.slice(inicio, fin);
  }

  // 🎨 NUEVO: Método que se llama cuando el <select> cambia
  onItemsPorPaginaChange(): void {
    // Ir a la página 1 en todas las pestañas
    this.paginacionCarreras.paginaActual = 1;
    this.paginacionBachi.paginaActual = 1;
    this.paginacionEspec.paginaActual = 1;
    
    // Recalcular las vistas paginadas
    this.actualizarCarrerasPaginadas();
    this.actualizarBachiPaginados();
    this.actualizarEspecPaginados();
  }

  cambiarPaginaCarreras(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.getTotalPaginas('carreras')) {
      this.paginacionCarreras.paginaActual = nuevaPagina;
      this.actualizarCarrerasPaginadas();
    }
  }

  cambiarPaginaBachi(nuevaPagina: number): void {
     if (nuevaPagina > 0 && nuevaPagina <= this.getTotalPaginas('bachilleratos')) {
      this.paginacionBachi.paginaActual = nuevaPagina;
      this.actualizarBachiPaginados();
    }
  }

  cambiarPaginaEspec(nuevaPagina: number): void {
     if (nuevaPagina > 0 && nuevaPagina <= this.getTotalPaginas('especialidades')) {
      this.paginacionEspec.paginaActual = nuevaPagina;
      this.actualizarEspecPaginados();
    }
  }

  getTotalPaginas(tipo: 'carreras' | 'bachilleratos' | 'especialidades'): number {
    let totalItems = 0;
    if (tipo === 'carreras') totalItems = this.paginacionCarreras.totalItems;
    if (tipo === 'bachilleratos') totalItems = this.paginacionBachi.totalItems;
    if (tipo === 'especialidades') totalItems = this.paginacionEspec.totalItems;
    
    return Math.ceil(totalItems / this.itemsPorPagina);
  }

  selectTab(tab: 'carreras' | 'bachilleratos' | 'especialidades') {
    this.activeTab = tab;
  }

  abrirModalNuevo(): void {
    this.modoEdicion = false;
    this.tipoCatalogo = null;
    this.itemActual = {};
    this.itemEditandoId = null;
    this.mostrarModal = true;
  }

  seleccionarTipoParaCrear(tipo: 'carreras' | 'bachilleratos' | 'especialidades'): void {
    this.tipoCatalogo = tipo;
    if (tipo === 'carreras') this.itemActual = { nombre: '', duracion_semestres: 8 };
    if (tipo === 'bachilleratos') this.itemActual = { nombre: '', tipo: 'Técnico' };
    if (tipo === 'especialidades') this.itemActual = { nombre: '' };
  }

  abrirModalEditar(item: any, tipo: 'carreras' | 'bachilleratos' | 'especialidades'): void {
    this.modoEdicion = true;
    this.tipoCatalogo = tipo;
    this.itemActual = { ...item };
    this.itemEditandoId = item.id;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.tipoCatalogo = null;
    this.itemActual = {};
    this.itemEditandoId = null;
  }


  guardar(): void {
    if (!this.tipoCatalogo) return;

    const data = this.itemActual;
    const tipo = this.tipoCatalogo;

    const obs = this.modoEdicion
      ? this.catalogosService.actualizarCatalogo(tipo, this.itemEditandoId!, data)
      : this.catalogosService.crearCatalogo(tipo, data);
    
    obs.subscribe({
      next: () => {
        this.alerts.success(this.modoEdicion ? 'Registro actualizado' : 'Registro creado');
        this.cerrarModal();
        if (tipo === 'carreras') this.cargarCarreras();
        if (tipo === 'bachilleratos') this.cargarBachilleratos();
        if (tipo === 'especialidades') this.cargarEspecialidades();
      },
      error: (err) => this.alerts.error('Error al guardar el registro')
    });
  }

  eliminar(item: any, tipo: 'carreras' | 'bachilleratos' | 'especialidades'): void {
    this.alerts.confirm(`¿Eliminar "${item.nombre}"?`).then(result => {
      if (result.isConfirmed) {
        this.catalogosService.eliminarCatalogo(tipo, item.id).subscribe({
          next: () => {
            this.alerts.success('Registro eliminado');
            if (tipo === 'carreras') this.cargarCarreras();
            if (tipo === 'bachilleratos') this.cargarBachilleratos();
            if (tipo === 'especialidades') this.cargarEspecialidades();
          },
          error: (err) => this.alerts.error('Error al eliminar el registro')
        });
      }
    });
  }

  get modalTitle(): string {
    if (this.modoEdicion) {
      if (this.tipoCatalogo === 'carreras') return 'Editar Carrera';
      if (this.tipoCatalogo === 'bachilleratos') return 'Editar Bachillerato';
      if (this.tipoCatalogo === 'especialidades') return 'Editar Especialidad';
    }
    return 'Agregar Nuevo Registro';
  }
}