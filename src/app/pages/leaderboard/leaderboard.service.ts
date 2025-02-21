import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface Player {
  playerId: string;
  xp: number;
  kills: number;
  deaths: number;
  currentKillStreak: number;
  highestKillStreak: number;
  bounty: number;
  username?: string;
  avatar?: string;
}

export type SortKey =
  | 'xp'
  | 'kills'
  | 'deaths'
  | 'currentKillStreak'
  | 'highestKillStreak'
  | 'bounty';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  constructor(private http: HttpClient) {}

  getLeaderboard(sort: SortKey, page: number = 1): Observable<Player[]> {
    // Fetch leaderboard data and enrich with player info
    return this.http
      .get<Player[]>(
        `https://api.hglabor.de/stats/FFA/top?sort=${sort}&page=${page}`
      )
      .pipe(
        switchMap((players) =>
          forkJoin(
            players.map((player) =>
              this.http
                .get(
                  `https://playerdb.co/api/player/minecraft/${player.playerId}`
                )
                .pipe(
                  map((response: any) => {
                    if (response?.data?.player) {
                      player.username = response.data.player.username;
                      player.avatar = response.data.player.avatar;
                    }
                    return player;
                  }),
                  catchError(() => of(player))
                )
            )
          )
        )
      );
  }
}
