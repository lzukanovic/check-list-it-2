import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-header',
    template: `
        <header>
            <div class="date">
                <h1 class="day">{{ currentDate | date:'EEEE' }},</h1>
                <h1 class="mute">{{ currentDate | date:'LLLL' }} {{ (currentDate | date:'d') | dateSuffix }}</h1>
            </div>
            <div class="plus-icon mute">
                <fa-icon [icon]="faPlus"></fa-icon>
            </div>
        </header>
    `,
    styles: [`
        header {
            color: var(--text);
            display: flex;
            justify-content: space-between;
            /* margin: 2.5rem 1.8rem 0; */
        }
        h1 {
            margin: 0;
            font-size: 30px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        .mute {
            color: var(--muted-text);
        }
        .plus-icon {
            align-self: center;
            font-size: 1.5rem;
        }
    `]
})
export class HeaderComponent implements OnInit {
    faPlus = faPlus;
    currentDate = new Date();

    constructor() { }

    ngOnInit(): void {
    }

}
