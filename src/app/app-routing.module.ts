import { SpeciesInfoComponent } from './species-info/species-info.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {path: 'home', component: HomepageComponent},
  {path: 'species/:name',component:SpeciesInfoComponent},
  // {
  //   path: 'taxonomy/:name', component: SpeciesInfoComponent,
  //   children: [

  //     {path: 'introduction', component: IntroductionComponent},
  //     {path: ':genome', component: ShowDataComponent,
  //     children: [
  //       {path: ':direction', component: TableComponent},
  //       {path: '', redirectTo: 'up', pathMatch: 'full'}
  //     ]
  //     },
  //     {path: '', redirectTo: 'introduction', pathMatch: 'full'}
  //   ]
  // },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
