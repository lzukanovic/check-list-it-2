import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

    // Observable boolean sources
    private addBtnClickedSource = new Subject<boolean>();

    // Observable boolean streams
    addBtnClicked$ = this.addBtnClickedSource.asObservable();

    // Service message commands
    addButtonClick(state: boolean): void {
        this.addBtnClickedSource.next(state);
    }

    constructor() { }
}
