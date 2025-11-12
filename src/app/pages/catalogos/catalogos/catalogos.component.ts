import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogosService } from '../../../core/services/catalogos.service';

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
  nombreNuevo = '';
  modoEdicion = false;
  itemEditando: any = null;
  mostrarModal = false;
  private iconsRendered = false;

  constructor(private catalogosService: CatalogosService) {}

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
      error: (err) => console.error('❌ Error al cargar catálogo:', err)
    });
  }

  abrirModalNuevo(): void {
    this.mostrarModal = true;
    this.modoEdicion = false;
    this.nombreNuevo = '';
  }

  abrirModalEditar(item: any): void {
    this.mostrarModal = true;
    this.modoEdicion = true;
    this.itemEditando = item;
    this.nombreNuevo = item.nombre;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.nombreNuevo = '';
  }

  guardar(): void {
    if (!this.nombreNuevo.trim()) return;

    const data = { nombre: this.nombreNuevo };

    if (this.modoEdicion && this.itemEditando) {
      this.catalogosService.actualizarCatalogo(this.tipoSeleccionado, this.itemEditando.id, data)
        .subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarCatalogo();
          },
          error: (err) => console.error('❌ Error al editar:', err)
        });
    } else {
      this.catalogosService.crearCatalogo(this.tipoSeleccionado, data)
        .subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarCatalogo();
          },
          error: (err) => console.error('❌ Error al crear:', err)
        });
    }
  }

  eliminar(item: any): void {
    if (!confirm(`¿Eliminar ${item.nombre}?`)) return;

    this.catalogosService.eliminarCatalogo(this.tipoSeleccionado, item.id)
      .subscribe({
        next: () => this.cargarCatalogo(),
        error: (err) => console.error('❌ Error al eliminar:', err)
      });
  }
}
