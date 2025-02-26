import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  PlayerProfile,
  PlayerProfileService,
} from '../player-profile/player-profile.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './players.component.html',
})
export class PlayersComponent implements OnInit {
  uuid: string = '';
  playerIds = signal<string[]>([]);
  playerProfiles = signal<PlayerProfile[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  compareMode = signal<boolean>(false);

  // LocalStorage keys
  private readonly STORAGE_KEY_COMPARE_MODE = 'player_comparison_mode';
  private readonly STORAGE_KEY_PLAYER_IDS = 'player_comparison_ids';

  constructor(
    private router: Router,
    private playerProfileService: PlayerProfileService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Restore comparison state from localStorage
    this.restoreComparisonState();
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  searchPlayer() {
    if (this.uuid.trim()) {
      this.router.navigate(['/player', this.uuid.trim()]);
    }
  }

  toggleCompareMode() {
    this.compareMode.update((current) => !current);

    if (!this.compareMode()) {
      // Reset comparison data when explicitly exiting compare mode
      this.clearComparisonData();
    }

    // Save the current compare mode state
    if (this.isBrowser()) {
      localStorage.setItem(
        this.STORAGE_KEY_COMPARE_MODE,
        this.compareMode().toString()
      );
    }
  }

  addPlayerToComparison() {
    const uuid = this.uuid.trim();
    if (!uuid) return;

    // Don't add duplicate players
    if (this.playerIds().includes(uuid)) {
      this.error.set('This player is already in the comparison list');
      return;
    }

    this.fetchPlayerProfile(uuid);
    this.uuid = ''; // Clear the input field
  }

  removePlayerFromComparison(index: number) {
    const currentPlayerIds = this.playerIds();
    const currentProfiles = this.playerProfiles();

    const updatedIds = currentPlayerIds.filter((_, i) => i !== index);
    const updatedProfiles = currentProfiles.filter((_, i) => i !== index);

    this.playerIds.set(updatedIds);
    this.playerProfiles.set(updatedProfiles);

    // Save updated player IDs to localStorage
    this.savePlayerIdsToStorage();
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

          // Add the UUID and profile to our arrays
          this.playerIds.update((current) => [...current, uuid]);
          this.playerProfiles.update((current) => [...current, profile]);

          // Save updated player IDs to localStorage
          this.savePlayerIdsToStorage();
        },
        error: (err) => {
          this.error.set('Failed to load player data');
          console.error('Error fetching player profile:', err);
        },
      });
  }

  private savePlayerIdsToStorage(): void {
    if (this.isBrowser()) {
      localStorage.setItem(
        this.STORAGE_KEY_PLAYER_IDS,
        JSON.stringify(this.playerIds())
      );
    }
  }

  private clearComparisonData(): void {
    this.playerIds.set([]);
    this.playerProfiles.set([]);
    if (this.isBrowser()) {
      localStorage.removeItem(this.STORAGE_KEY_PLAYER_IDS);
    }
  }

  private restoreComparisonState(): void {
    if (!this.isBrowser()) {
      return;
    }

    // Restore compare mode
    const savedCompareMode = localStorage.getItem(
      this.STORAGE_KEY_COMPARE_MODE
    );
    if (savedCompareMode === 'true') {
      this.compareMode.set(true);

      // Restore player IDs and fetch profiles
      const savedPlayerIds = localStorage.getItem(this.STORAGE_KEY_PLAYER_IDS);
      if (savedPlayerIds) {
        try {
          const playerIds = JSON.parse(savedPlayerIds) as string[];

          // If there are saved IDs, load each player profile
          if (playerIds.length > 0) {
            playerIds.forEach((uuid) => {
              this.fetchPlayerProfile(uuid);
            });
          }
        } catch (e) {
          console.error('Error parsing saved player IDs:', e);
          // In case of corrupt data, clear storage
          localStorage.removeItem(this.STORAGE_KEY_PLAYER_IDS);
        }
      }
    }
  }
}
