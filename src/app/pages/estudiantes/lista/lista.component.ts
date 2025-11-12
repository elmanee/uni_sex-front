import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudiantesService } from '../../../core/services/estudiantes.service';
import { CatalogosService } from '../../../core/services/catalogos.service';

declare const lucide: any;

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit, AfterViewChecked {
  estudiantes: any[] = [];
  filtrados: any[] = [];
  carreras: any[] = [];
  especialidades: any[] = [];

  filtroMatricula = '';
  filtroCarrera = '';
  filtroEspecialidad = '';

  private iconsRendered = false;

  constructor(
    private estudiantesService: EstudiantesService,
    private catalogosService: CatalogosService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarEstudiantes();
  }

  ngAfterViewChecked(): void {
    if (lucide && !this.iconsRendered) {
      lucide.createIcons();
      this.iconsRendered = true;
    }
  }

  cargarCatalogos(): void {
    this.catalogosService.obtenerCatalogo('carreras').subscribe({
      next: (res) => (this.carreras = res.data || []),
      error: (err) => console.error('Error al cargar carreras:', err)
    });

    this.catalogosService.obtenerCatalogo('especialidades').subscribe({
      next: (res) => (this.especialidades = res.data || []),
      error: (err) => console.error('Error al cargar especialidades:', err)
    });
  }

  cargarEstudiantes(): void {
    this.estudiantesService.obtenerEstudiantes().subscribe({
      next: (res) => {
        this.estudiantes = res.data || [];
        this.filtrados = [...this.estudiantes];
      },
    });

  }

  aplicarFiltros(): void {
    this.filtrados = this.estudiantes.filter((e) => {
      const porMatricula = e.matricula
        ?.toLowerCase()
        .includes(this.filtroMatricula.toLowerCase());
      const porCarrera =
        !this.filtroCarrera || e.carrera_id == this.filtroCarrera;
      const porEspecialidad =
        !this.filtroEspecialidad || e.especialidad_id == this.filtroEspecialidad;
      return porMatricula && porCarrera && porEspecialidad;
    });
    this.iconsRendered = false;
  }

  getCarreraNombre(id: number): string {
    const c = this.carreras.find((x) => x.id === id);
    return c ? c.nombre : '—';
  }

  getEspecialidadNombre(id: number): string {
    const e = this.especialidades.find((x) => x.id === id);
    return e ? e.nombre : '—';
  }

  verDetalles(item: any): void {
    alert(`📋 Detalles del estudiante:\n\n${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}\n${item.email}`);
  }

  editar(item: any): void {
    alert(`✏️ Editar estudiante ${item.matricula}`);
  }

  eliminar(item: any): void {
    if (confirm(`¿Eliminar estudiante ${item.matricula}?`)) {
      this.estudiantesService.eliminarEstudiante(item.matricula).subscribe({
        next: () => this.cargarEstudiantes(),
        error: (err) => console.error('Error al eliminar estudiante:', err)
      });
    }
  }
}
