import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultasComponent } from './consultas/consultas.component';
import { RouterModule, Routes } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import {ChartModule} from 'primeng/chart';





export const routes:Routes =[
  { path: '', component: ConsultasComponent, pathMatch: 'full'},
]

@NgModule({
  declarations: [ConsultasComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    PaginatorModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ChartModule
 ]
})
export class ConsultasModule { }
