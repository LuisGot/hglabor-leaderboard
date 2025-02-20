import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, Player, SortKey } from './leaderboard.service';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent {
  leaderboard = signal<Player[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  currentSort = signal<SortKey>('xp');
  sortOptions: SortKey[] = [
    'xp',
    'kills',
    'deaths',
    'currentKillStreak',
    'highestKillStreak',
    'bounty',
  ];

  constructor(private leaderboardService: LeaderboardService) {
    this.fetchLeaderboardData('xp');
  }

  fetchLeaderboardData(sort: SortKey, page?: number) {
    if (page !== undefined) {
      this.currentPage.set(page);
    }
    this.currentSort.set(sort);
    this.isLoading.set(true);

    this.leaderboardService
      .getLeaderboard(sort, this.currentPage())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        this.leaderboard.set(data);
      });
  }

  nextPage() {
    this.fetchLeaderboardData(this.currentSort(), this.currentPage() + 1);
  }

  previousPage() {
    if (this.currentPage() > 0) {
      this.fetchLeaderboardData(this.currentSort(), this.currentPage() - 1);
    }
  }
}
