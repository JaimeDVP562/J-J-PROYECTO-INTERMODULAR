import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./modules/login/login-module').then(m => m.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard-module').then(m => m.DashboardModule) },
  { path: 'facturacion', loadChildren: () => import('./modules/facturacion/facturacion-module').then(m => m.FacturacionModule) },
  { path: 'horario', loadChildren: () => import('./modules/horario/horario-module').then(m => m.HorarioModule) },
  { path: 'stock', loadChildren: () => import('./modules/stock/stock-module').then(m => m.StockModule) },
  { path: 'ajustes', loadChildren: () => import('./modules/ajustes/ajustes-module').then(m => m.AjustesModule) },
  { path: 'ayuda', loadChildren: () => import('./modules/ayuda/ayuda-module').then(m => m.AyudaModule) }
];
