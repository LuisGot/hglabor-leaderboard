import { Routes } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';

export const routes: Routes = [
  { path: '', component: LeaderboardComponent },
  { path: 'player/:uuid', component: PlayerProfileComponent },
];
