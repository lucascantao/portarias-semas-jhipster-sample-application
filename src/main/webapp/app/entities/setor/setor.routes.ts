import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SetorComponent } from './list/setor.component';
import { SetorDetailComponent } from './detail/setor-detail.component';
import { SetorUpdateComponent } from './update/setor-update.component';
import SetorResolve from './route/setor-routing-resolve.service';

const setorRoute: Routes = [
  {
    path: '',
    component: SetorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SetorDetailComponent,
    resolve: {
      setor: SetorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SetorUpdateComponent,
    resolve: {
      setor: SetorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SetorUpdateComponent,
    resolve: {
      setor: SetorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default setorRoute;
