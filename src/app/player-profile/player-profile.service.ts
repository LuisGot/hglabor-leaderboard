import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

export interface PlayerProfile {
  playerId: string;
  xp: number;
  kills: number;
  deaths: number;
  currentKillStreak: number;
  highestKillStreak: number;
  bounty: number;
  heroes: any;
  username?: string;
  avatar?: string;
}

export interface PlayerDBResponse {
  data: {
    player: {
      username: string;
      avatar: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class PlayerProfileService {
  constructor(private http: HttpClient) {}

  getPlayerProfile(uuid: string): Observable<PlayerProfile> {
    // Combine stats and player info data
    return forkJoin({
      stats: this.http.get<PlayerProfile>(
        `https://api.hglabor.de/stats/FFA/${uuid}`
      ),
      playerInfo: this.http.get<PlayerDBResponse>(
        `https://playerdb.co/api/player/minecraft/${uuid}`
      ),
    }).pipe(
      map(({ stats, playerInfo }) => ({
        ...stats,
        username: playerInfo.data.player.username,
        avatar: playerInfo.data.player.avatar,
      }))
    );
  }
}
