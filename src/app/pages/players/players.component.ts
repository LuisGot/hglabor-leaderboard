import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players.component.html',
})
export class PlayersComponent {
  uuid: string = '';

  constructor(private router: Router) {}

  searchPlayer() {
    if (this.uuid.trim()) {
      this.router.navigate(['/player', this.uuid.trim()]);
    }
  }
}
