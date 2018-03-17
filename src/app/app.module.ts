import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, TimerComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ Title ]
})
export class AppModule { }
