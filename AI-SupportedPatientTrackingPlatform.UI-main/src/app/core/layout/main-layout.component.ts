import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../models/user.model';
import { SidenavComponent } from '../../core/layout/sidenav/sidenav.component';
import { HeaderComponent } from '../../core/layout/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    SidenavComponent,
    HeaderComponent
  ],
  template: `
    <div class="main-layout-container">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav 
          #sidenav 
          [mode]="isSmallScreen ? 'over' : 'side'"
          [opened]="!isSmallScreen" 
          class="sidenav"
          fixedInViewport>
          <app-sidenav [isAdmin]="isAdmin"></app-sidenav>
        </mat-sidenav>
        
        <mat-sidenav-content>
          <app-header 
            [sidenav]="sidenav" 
            [isSmallScreen]="isSmallScreen"
            [currentUser]="currentUser">
          </app-header>
          
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .main-layout-container {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    
    .sidenav-container {
      flex: 1;
    }
    
    .sidenav {
      width: 250px;
    }
    
    .content-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
    
    @media (max-width: 599px) {
      .content-container {
        min-height: calc(100vh - 56px);
      }
    }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  
  isSmallScreen = window.innerWidth < 768;
  currentUser: User | null = this.authService.getUserData();
  
  get isAdmin(): boolean {
    return this.authService.hasRole('Admin');
  }
  
  constructor() {
    window.addEventListener('resize', () => {
      this.isSmallScreen = window.innerWidth < 768;
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}