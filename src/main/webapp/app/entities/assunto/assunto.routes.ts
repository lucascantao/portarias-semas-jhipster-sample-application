import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AssuntoComponent } from './list/assunto.component';
import { AssuntoDetailComponent } from './detail/assunto-detail.component';
import { AssuntoUpdateComponent } from './update/assunto-update.component';
import AssuntoResolve from './route/assunto-routing-resolve.service';

const assuntoRoute: Routes = [
  {
    path: '',
    component: AssuntoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssuntoDetailComponent,
    resolve: {
      assunto: AssuntoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssuntoUpdateComponent,
    resolve: {
      assunto: AssuntoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssuntoUpdateComponent,
    resolve: {
      assunto: AssuntoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default assuntoRoute;
