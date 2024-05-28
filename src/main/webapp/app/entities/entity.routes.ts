import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'jhipsterSampleApplicationApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'topico',
    data: { pageTitle: 'jhipsterSampleApplicationApp.topico.home.title' },
    loadChildren: () => import('./topico/topico.routes'),
  },
  {
    path: 'ajuda',
    data: { pageTitle: 'jhipsterSampleApplicationApp.ajuda.home.title' },
    loadChildren: () => import('./ajuda/ajuda.routes'),
  },
  {
    path: 'portaria',
    data: { pageTitle: 'jhipsterSampleApplicationApp.portaria.home.title' },
    loadChildren: () => import('./portaria/portaria.routes'),
  },
  {
    path: 'assunto',
    data: { pageTitle: 'jhipsterSampleApplicationApp.assunto.home.title' },
    loadChildren: () => import('./assunto/assunto.routes'),
  },
  {
    path: 'setor',
    data: { pageTitle: 'jhipsterSampleApplicationApp.setor.home.title' },
    loadChildren: () => import('./setor/setor.routes'),
  },
  {
    path: 'usuario',
    data: { pageTitle: 'jhipsterSampleApplicationApp.usuario.home.title' },
    loadChildren: () => import('./usuario/usuario.routes'),
  },
  {
    path: 'perfil',
    data: { pageTitle: 'jhipsterSampleApplicationApp.perfil.home.title' },
    loadChildren: () => import('./perfil/perfil.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
