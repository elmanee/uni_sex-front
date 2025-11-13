import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() pageTitle: string = 'Dashboard';
  @Input() userName: string = '';
  @Input() userInitials: string = '';
}