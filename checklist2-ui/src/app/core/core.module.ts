import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from './communication.service';
import { LocalStorageService } from './local-storage.service';
import { PwaService } from './pwa.service';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        CommunicationService,
        LocalStorageService,
        {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true},
    ]
})
export class CoreModule { }
