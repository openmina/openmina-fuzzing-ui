import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const APP_TITLE: string = 'Open Mina';
export const FUZZING_TITLE: string = APP_TITLE + ' - Fuzzing';

const routes: Routes = [
  {
    path: 'fuzzing',
    loadChildren: () => import('@fuzzing/fuzzing.module').then(m => m.FuzzingModule),
    title: FUZZING_TITLE,
  },
  {
    path: '**',
    redirectTo: 'fuzzing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'ignore',
      initialNavigation: 'enabledNonBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRouting {}
