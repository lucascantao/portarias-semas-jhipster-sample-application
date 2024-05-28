import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TopicoComponent } from './list/topico.component';
import { TopicoDetailComponent } from './detail/topico-detail.component';
import { TopicoUpdateComponent } from './update/topico-update.component';
import TopicoResolve from './route/topico-routing-resolve.service';

const topicoRoute: Routes = [
  {
    path: '',
    component: TopicoComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TopicoDetailComponent,
    resolve: {
      topico: TopicoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TopicoUpdateComponent,
    resolve: {
      topico: TopicoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TopicoUpdateComponent,
    resolve: {
      topico: TopicoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default topicoRoute;
