import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { MainContent } from '../main-content/main-content';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Sidebar, MainContent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {}
