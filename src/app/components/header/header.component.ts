import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServerInfoComponent } from '../server-info/server-info.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ServerInfoComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  mobileMenuOpen: boolean = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
