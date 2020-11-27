import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSuffixPipe } from './date-suffix.pipe';



@NgModule({
  declarations: [ DateSuffixPipe ],
  imports: [ CommonModule ],
  exports: [ DateSuffixPipe ]
})
export class SharedModule { }
