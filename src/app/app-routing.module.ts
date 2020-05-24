import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PizzaTableComponent } from './components/pizza-table/pizza-table.component';


const routes: Routes = [
  {
    path: '',
    component: PizzaTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
