import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  platformId = inject(PLATFORM_ID);
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    if (this.isBrowser()) {
      const savedTheme = localStorage.getItem('theme');
      if (
        savedTheme === 'dark' ||
        (!savedTheme &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.enableDarkMode();
      }

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            if (e.matches) {
              this.enableDarkMode();
            } else {
              this.disableDarkMode();
            }
          }
        });
    }
  }

  toggleDarkMode(): void {
    if (document.documentElement.classList.contains('dark')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    if (this.isBrowser()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.darkMode.next(true);
    }
  }

  private disableDarkMode(): void {
    if (this.isBrowser()) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.darkMode.next(false);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
