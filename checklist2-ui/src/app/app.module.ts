import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardsComponent } from './cards/cards.component';
import { SharedModule } from './shared/shared.module';
import { AutosizeModule } from 'ngx-autosize';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CardsComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    SharedModule,
    AutosizeModule,
    FormsModule,
    CoreModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
