import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AjudaComponent } from './list/ajuda.component';
import { AjudaDetailComponent } from './detail/ajuda-detail.component';
import { AjudaUpdateComponent } from './update/ajuda-update.component';
import AjudaResolve from './route/ajuda-routing-resolve.service';

const ajudaRoute: Routes = [
  {
    path: '',
    component: AjudaComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AjudaDetailComponent,
    resolve: {
      ajuda: AjudaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AjudaUpdateComponent,
    resolve: {
      ajuda: AjudaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AjudaUpdateComponent,
    resolve: {
      ajuda: AjudaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ajudaRoute;
