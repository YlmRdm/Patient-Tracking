import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="sidenav-container">
      <div class="sidenav-header">
        <div class="logo">
          <mat-icon class="logo-icon">health_and_safety</mat-icon>
          <span class="logo-text">PatientTrack</span>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <mat-nav-list>
        @for (item of navItems; track item.label) {
          @if (!item.roles || item.roles.includes('Admin') && isAdmin || item.roles.includes('Doctor')) {
            <a 
              mat-list-item 
              [routerLink]="item.link" 
              routerLinkActive="active-link">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        }
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidenav-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .sidenav-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background-color: #3f51b5;
      color: white;
    }
    
    .logo {
      display: flex;
      align-items: center;
    }
    
    .logo-icon {
      margin-right: 8px;
    }
    
    .logo-text {
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .active-link {
      background-color: rgba(63, 81, 181, 0.1);
    }
    
    @media (max-width: 599px) {
      .sidenav-header {
        height: 56px;
      }
    }
  `]
})
export class SidenavComponent {
  @Input() isAdmin = false;
  
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard'
    },
    {
      label: 'Hastalar',
      icon: 'person',
      link: '/patients'
    },
    {
      label: 'Kullanıcı Yönetimi',
      icon: 'people',
      link: '/users',
      roles: ['Admin']
    },
    {
      label: 'Profil',
      icon: 'account_circle',
      link: '/profile'
    }
  ];
}