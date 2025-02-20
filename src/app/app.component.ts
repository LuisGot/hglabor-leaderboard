import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Norisk';
  themeService = inject(ThemeService);
  isDarkMode$ = this.themeService.darkMode$;

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}
