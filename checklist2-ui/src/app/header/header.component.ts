import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CommunicationService } from '../core/communication.service';

@Component({
    selector: 'app-header',
    template: `
        <header>
            <div class="date">
                <h1 class="day">{{ currentDate | date:'EEEE' }},</h1>
                <h1 class="mute">{{ currentDate | date:'LLLL' }} {{ (currentDate | date:'d') | dateSuffix }}</h1>
            </div>
            <div class="plus-icon mute"
                (click)="plusClick()">
                <fa-icon [icon]="faPlus"></fa-icon>
            </div>
        </header>
    `,
    styles: [`
        header {
            color: var(--text);
            display: flex;
            justify-content: space-between;
        }
        h1 {
            margin: 0;
            /* font-family: 'Montserrat', sans-serif; */
            font-size: 22px;
            font-weight: 600;
            /* letter-spacing: 1px; */
        }
        .mute {
            color: var(--muted-text);
        }
        .plus-icon {
            align-self: center;
            font-size: 1.2rem;
        }

        @media only screen and (min-width: 375px) {
            h1 {
                font-size: 25px;
            }
            .plus-icon {
                font-size: 1.5rem;
            }
        }

        @media only screen and (min-width: 400px) {
            h1 {
                font-size: 27px;
            }
        }

        @media only screen and (min-width: 500px) {
            h1 {
                font-size: 30px;
            }
            .plus-icon {
                font-size: 1.8rem;
            }
        }
    `]
})
export class HeaderComponent implements OnInit {
    faPlus = faPlus;
    currentDate = new Date();

    constructor(private comms: CommunicationService) { }

    ngOnInit(): void {
    }

    plusClick(): void {
        this.comms.addButtonClick(true);
    }
}
