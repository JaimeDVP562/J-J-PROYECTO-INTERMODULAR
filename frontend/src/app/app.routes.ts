import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { DashboardComponent } from './dashboard/dashboard';
import { BillingComponent } from './billing/billing';
import { TimeControlComponent } from './time-control/time-control';
import { StockComponent } from './stock/stock';
import { SettingsComponent } from './settings/settings';
import { HelpComponent } from './help/help';
import { UsuariosComponent } from './usuarios/usuarios';
import { PosComponent } from './pos/pos';
import { PerfilComponent } from './perfil/perfil';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login').then((m) => m.LoginComponent) },
  {
    path: '',
    loadComponent: () =>
      import('./authenticated-layout/authenticated-layout').then((m) => m.AuthenticatedLayout),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pos', component: PosComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'time-control', component: TimeControlComponent },
      { path: 'stock', component: StockComponent },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard] },
      { path: 'perfil', component: PerfilComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'help', component: HelpComponent },
    ],
  },
];
