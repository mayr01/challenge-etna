import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SigInComponent } from './components/sig-in/sig-in.component';
import { HomeComponent } from './components/home/home.component';
import { AutherizationGuard } from './utils/autherization.guard';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { ViewTaskComponent } from './components/view-task/view-task.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
 { path: 'sig-in', component: SigInComponent },
  { path: 'home', component: HomeComponent, canActivate: [AutherizationGuard]},
  { path: 'new-task', component: NewTaskComponent, canActivate: [AutherizationGuard]},
  { path: 'edit-task', component: EditTaskComponent, canActivate: [AutherizationGuard]},
  { path: 'view-task', component: ViewTaskComponent, canActivate: [AutherizationGuard]},

 { path: '**', redirectTo: 'login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
