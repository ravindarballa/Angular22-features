import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  selector: 'app-navabar',
  styleUrl: './navabar.css',
  templateUrl: './navabar.html',
})
export class Navabar {
  protected readonly links = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/movies', label: 'Movies', icon: 'movie' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];
}
