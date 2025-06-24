import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      @if (isSmallScreen) {
        <button 
          mat-icon-button 
          (click)="sidenav.toggle()" 
          aria-label="Menüyü aç/kapa"
          matTooltip="Menüyü aç/kapa">
          <mat-icon>menu</mat-icon>
        </button>
      }
      
      <a class="app-title" routerLink="/dashboard">
        <span>Hasta Takip Platformu</span>
      </a>
      
      <span class="spacer"></span>
      
      @if (currentUser) {
        <div class="user-info">
          <button 
            mat-button
            [matMenuTriggerFor]="userMenu" 
            class="user-button">
            <mat-icon>account_circle</mat-icon>
            <span class="username">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profil</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Çıkış Yap</span>
            </button>
          </mat-menu>
        </div>
      }
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .app-title {
      text-decoration: none;
      color: white;
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-info {
      display: flex;
      align-items: center;
    }
    
    .user-button {
      display: flex;
      align-items: center;
    }
    
    .username {
      margin: 0 8px;
    }
    
    @media (max-width: 599px) {
      .username {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() sidenav!: MatSidenav;
  @Input() isSmallScreen = false;
  @Input() currentUser: User | null = null;
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}