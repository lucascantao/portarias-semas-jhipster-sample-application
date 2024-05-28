import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PerfilComponent } from './list/perfil.component';
import { PerfilDetailComponent } from './detail/perfil-detail.component';
import { PerfilUpdateComponent } from './update/perfil-update.component';
import PerfilResolve from './route/perfil-routing-resolve.service';

const perfilRoute: Routes = [
  {
    path: '',
    component: PerfilComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PerfilDetailComponent,
    resolve: {
      perfil: PerfilResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PerfilUpdateComponent,
    resolve: {
      perfil: PerfilResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PerfilUpdateComponent,
    resolve: {
      perfil: PerfilResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default perfilRoute;
