import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { PromptComponent } from '../prompt/prompt.component';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
    private promptEvent: any;

    constructor(
        private bottomSheet: MatBottomSheet,
        private platform: Platform
    ) { }

    public initPwaPrompt(): void {
        if (this.platform.ANDROID) {
            window.addEventListener('beforeinstallprompt', (event: any) => {
                event.preventDefault();
                this.promptEvent = event;
                this.openPromptComponent('android');
            });
        }
        if (this.platform.IOS) {
            const key = 'standalone';
            const isInStandaloneMode = (key in window.navigator) && (window.navigator[key]);
            if (!isInStandaloneMode) {
                this.openPromptComponent('ios');
            }
        }
    }

    private openPromptComponent(mobileType: 'ios' | 'android'): void {
        timer(3000)
        .pipe(take(1))
        .subscribe(() => this.bottomSheet.open(PromptComponent, { data: { mobileType, promptEvent: this.promptEvent } }));
    }
}
