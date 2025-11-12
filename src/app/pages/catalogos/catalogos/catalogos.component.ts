import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AlertasService } from '../../../core/services/alertas.service';

declare const lucide: any;

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit, AfterViewChecked {
  tipoSeleccionado = 'carreras';
  catalogoActual: any[] = [];

  mostrarModal = false;
  modoEdicion = false;

  nombreNuevo = '';
  duracion = 8;
  tipoBach = '';
  itemEditando: any = null;

  private iconsRendered = false;

  constructor(
    private catalogosService: CatalogosService,
    private alerts: AlertasService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  ngAfterViewChecked(): void {
    if (lucide && !this.iconsRendered) {
      lucide.createIcons();
      this.iconsRendered = true;
    }
  }

  cargarCatalogo(): void {
    this.catalogosService.obtenerCatalogo(this.tipoSeleccionado).subscribe({
      next: (res) => {
        this.catalogoActual = res.data || [];
        this.iconsRendered = false;
      },
      error: () => {
        this.alerts.error('No se pudo cargar el catálogo. Verifica tu conexión.');
      }
    });
  }

  abrirModalNuevo(): void {
    this.mostrarModal = true;
    this.modoEdicion = false;
    this.nombreNuevo = '';
    this.duracion = 8;
    this.tipoBach = '';
  }

  abrirModalEditar(item: any): void {
    this.mostrarModal = true;
    this.modoEdicion = true;
    this.itemEditando = item;
    this.nombreNuevo = item.nombre;
    this.duracion = item.duracion_semestres || 8;
    this.tipoBach = item.tipo || '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.nombreNuevo = '';
    this.duracion = 8;
    this.tipoBach = '';
  }

  guardar(): void {
    if (!this.nombreNuevo.trim()) {
      this.alerts.warning('Debes ingresar un nombre antes de guardar.');
      return;
    }

    const data: any = { nombre: this.nombreNuevo };
    if (this.tipoSeleccionado === 'carreras') data.duracion_semestres = this.duracion;
    if (this.tipoSeleccionado === 'bachilleratos') data.tipo = this.tipoBach;

    const obs = this.modoEdicion
      ? this.catalogosService.actualizarCatalogo(this.tipoSeleccionado, this.itemEditando.id, data)
      : this.catalogosService.crearCatalogo(this.tipoSeleccionado, data);

    obs.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarCatalogo();
        this.alerts.success(
          this.modoEdicion
            ? 'El registro se actualizó correctamente.'
            : 'El registro se agregó correctamente.'
        );
      },
      error: (err) => {
        this.alerts.error(
          err.error?.message || 'Ocurrió un error al guardar el registro.'
        );
      }
    });
  }

  eliminar(item: any): void {
    this.alerts
      .confirm(`¿Eliminar ${item.nombre}?`, 'Esta acción no se puede deshacer.')
      .then((result) => {
        if (result.isConfirmed) {
          this.catalogosService.eliminarCatalogo(this.tipoSeleccionado, item.id).subscribe({
            next: () => {
              this.cargarCatalogo();
              this.alerts.success('El registro fue eliminado correctamente.');
            },
            error: (err) => {
              this.alerts.error(
                err.error?.message || 'Ocurrió un error al eliminar el registro.'
              );
            }
          });
        }
      });
  }
}
