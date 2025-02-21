import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlayerProfile, PlayerProfileService } from './player-profile.service';
import { finalize } from 'rxjs';
import { HeroAbilitiesComponent } from './hero-abilities/hero-abilities.component';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroAbilitiesComponent],
  templateUrl: './player-profile.component.html',
})
export class PlayerProfileComponent implements OnInit {
  playerProfile = signal<PlayerProfile | null>(null);
  isLoading = signal<boolean>(false);
  uuid = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private playerProfileService: PlayerProfileService
  ) {}

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.uuid.set(uuid);
      this.fetchPlayerProfile(uuid);
    }
  }

  async copyUUID(): Promise<void> {
    const uuid = this.uuid();
    if (uuid) {
      try {
        await navigator.clipboard.writeText(uuid);
      } catch (err) {
        console.error('Failed to copy UUID:', err);
      }
    }
  }

  private fetchPlayerProfile(uuid: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.playerProfileService
      .getPlayerProfile(uuid)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (profile) => {
          if (!profile) {
            this.error.set('No player data found');
            return;
          }
          this.playerProfile.set(profile);
        },
        error: (err) => {
          this.error.set('Failed to load player data');
          console.error('Error fetching player profile:', err);
        },
      });
  }
}
