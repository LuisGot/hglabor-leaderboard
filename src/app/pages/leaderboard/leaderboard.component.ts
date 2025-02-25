import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Player, SortKey } from './leaderboard.service';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PlayerWithPlace extends Player {
  originalPlace: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent {
  leaderboard = signal<PlayerWithPlace[]>([]);
  filteredLeaderboard = signal<PlayerWithPlace[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  currentSort = signal<SortKey>('xp');
  sortDirection = signal<'asc' | 'desc'>('desc');
  searchTerm = signal<string>('');
  sortOptions: SortKey[] = [
    'xp',
    'kills',
    'deaths',
    'currentKillStreak',
    'highestKillStreak',
    'bounty',
  ];

  constructor(private leaderboardService: LeaderboardService) {
    this.fetchLeaderboardData('xp'); // Initial data fetch
  }

  fetchLeaderboardData(
    sort: SortKey,
    page?: number,
    toggleDirection: boolean = false
  ) {
    if (page !== undefined) {
      this.currentPage.set(page);
    }

    if (toggleDirection && this.currentSort() === sort) {
      this.sortDirection.set(this.sortDirection() === 'desc' ? 'asc' : 'desc');
    } else if (toggleDirection) {
      this.sortDirection.set('desc');
    }

    this.currentSort.set(sort);
    this.isLoading.set(true);

    this.leaderboardService
      .getLeaderboard(sort, this.currentPage())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        const playersWithPlace = data.map((player, index) => ({
          ...player,
          originalPlace: (this.currentPage() - 1) * 100 + index + 1,
        }));

        if (this.sortDirection() === 'asc') {
          playersWithPlace.reverse();
        }

        this.leaderboard.set(playersWithPlace);
        this.filterLeaderboard(this.searchTerm());
      });
  }

  sortByHeader(sort: SortKey) {
    this.fetchLeaderboardData(sort, undefined, true);
  }

  filterLeaderboard(searchTerm: string) {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredLeaderboard.set(this.leaderboard());
      return;
    }

    const filtered = this.leaderboard().filter((player) =>
      player.username?.toLowerCase().includes(term)
    );
    this.filteredLeaderboard.set(filtered);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.filterLeaderboard(input.value);
  }

  nextPage() {
    this.fetchLeaderboardData(this.currentSort(), this.currentPage() + 1);
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.fetchLeaderboardData(this.currentSort(), this.currentPage() - 1);
    }
  }
}
