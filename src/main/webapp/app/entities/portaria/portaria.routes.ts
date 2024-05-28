import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PortariaComponent } from './list/portaria.component';
import { PortariaDetailComponent } from './detail/portaria-detail.component';
import { PortariaUpdateComponent } from './update/portaria-update.component';
import PortariaResolve from './route/portaria-routing-resolve.service';

const portariaRoute: Routes = [
  {
    path: '',
    component: PortariaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PortariaDetailComponent,
    resolve: {
      portaria: PortariaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PortariaUpdateComponent,
    resolve: {
      portaria: PortariaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PortariaUpdateComponent,
    resolve: {
      portaria: PortariaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default portariaRoute;
