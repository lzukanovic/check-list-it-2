import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from './communication.service';
import { LocalStorageService } from './local-storage.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ CommunicationService, LocalStorageService ]
})
export class CoreModule { }
