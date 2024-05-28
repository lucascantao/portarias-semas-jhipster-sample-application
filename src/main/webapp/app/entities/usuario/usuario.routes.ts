import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UsuarioComponent } from './list/usuario.component';
import { UsuarioDetailComponent } from './detail/usuario-detail.component';
import { UsuarioUpdateComponent } from './update/usuario-update.component';
import UsuarioResolve from './route/usuario-routing-resolve.service';

const usuarioRoute: Routes = [
  {
    path: '',
    component: UsuarioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsuarioDetailComponent,
    resolve: {
      usuario: UsuarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsuarioUpdateComponent,
    resolve: {
      usuario: UsuarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsuarioUpdateComponent,
    resolve: {
      usuario: UsuarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default usuarioRoute;
