import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LiteBriteChartComponent } from './lite-brite-chart/lite-brite-chart.component';
import { PenseesDisplayComponent } from './pensees-display/pensees-display.component';

@NgModule({
  declarations: [
    AppComponent,
    LiteBriteChartComponent,
    PenseesDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
