import { Routes } from '@angular/router';
import { LeaderboardComponent } from '../pages/leaderboard/leaderboard.component';
import { PlayerProfileComponent } from '../pages/player-profile/player-profile.component';
import { PlayersComponent } from '../pages/players/players.component';

export const routes: Routes = [
  { path: '', component: LeaderboardComponent },
  { path: 'player/:uuid', component: PlayerProfileComponent },
  { path: 'players', component: PlayersComponent },
];
