import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface MinecraftServerStatus {
  online: boolean;
  ip: string;
  players: {
    online: number;
    max: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MinecraftServerService {
  constructor(private http: HttpClient) {}

  getServerStatus(address: string): Observable<MinecraftServerStatus> {
    return this.http.get<MinecraftServerStatus>(
      `https://api.mcsrvstat.us/3/${address}`
    );
  }
}
