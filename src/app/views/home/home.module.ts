import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {MenuComponent} from './../componentes/menu/menu.component';
import {HeaderComponent} from './../componentes/header/header.component'
import {TabsComponent} from './../componentes/tabs/tabs.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage, MenuComponent, HeaderComponent, TabsComponent]
})
export class HomePageModule {}
