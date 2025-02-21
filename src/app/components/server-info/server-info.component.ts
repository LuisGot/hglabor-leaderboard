import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MinecraftServerService,
  MinecraftServerStatus,
} from '../../services/minecraft-server.service';

@Component({
  selector: 'app-server-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-info.component.html',
})
export class ServerInfoComponent implements OnInit {
  serverStatus = signal<MinecraftServerStatus | null>(null);

  constructor(private minecraftServerService: MinecraftServerService) {}

  ngOnInit() {
    this.fetchServerStatus();
  }

  private fetchServerStatus() {
    this.minecraftServerService.getServerStatus('hglabor.de').subscribe({
      next: (status) => this.serverStatus.set(status),
      error: () => this.serverStatus.set(null),
    });
  }
}
