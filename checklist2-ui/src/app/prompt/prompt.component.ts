import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

    faTimesCircle = faTimesCircle;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: { mobileType: 'ios' | 'android', promptEvent?: any },
        private bottomSheetRef: MatBottomSheetRef<PromptComponent>,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        this.matIconRegistry.addSvgIcon(
            `ios_share`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/ios_share_icon.svg')
        );
    }

    ngOnInit(): void {
    }

    public installPwa(): void {
        this.data.promptEvent.prompt();
        this.close();
    }

    public close(): void {
        this.bottomSheetRef.dismiss();
    }

}
