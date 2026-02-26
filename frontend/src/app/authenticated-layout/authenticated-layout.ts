import { Component } from '@angular/core';
import { Header } from '../header/header';
import { MainLayoutComponent } from '../main-layout/main-layout';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [Header, MainLayoutComponent, Footer],
  templateUrl: './authenticated-layout.html',
  styleUrls: ['./authenticated-layout.css'],
})
export class AuthenticatedLayout {}
