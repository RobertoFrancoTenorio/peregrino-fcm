import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasAsignadasPageRoutingModule } from './citas-asignadas-routing.module';

import { CitasAsignadasPage } from './citas-asignadas.page';
import { MenuComponent } from 'src/app/views/componentes/menu/menu.component';
import { HeaderComponent } from 'src/app/views/componentes/header/header.component';
import { TabsComponent } from '../componentes/tabs/tabs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasAsignadasPageRoutingModule
  ],
  declarations: [CitasAsignadasPage, HeaderComponent, MenuComponent, TabsComponent]
})
export class CitasAsignadasPageModule {}
