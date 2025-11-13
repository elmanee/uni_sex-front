import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any = null;
  currentPageTitle: string = 'Dashboard';

  constructor(private router: Router) {
        // Escuchar cambios de ruta para actualizar el título
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.url);
      });
  }

  ngOnInit() {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }


    getUserInitials(): string {
    if (!this.user?.nombre) return 'US';
    return this.user.nombre
      .split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

    updatePageTitle(url: string) {
    if (url.includes('/estudiantes')) {
      this.currentPageTitle = 'Estudiantes';
    } else if (url.includes('/catalogos')) {
      this.currentPageTitle = 'Catálogos';
    } else {
      this.currentPageTitle = 'Dashboard';
    }
  }



}
