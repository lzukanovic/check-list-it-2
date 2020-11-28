import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ICard, ITask } from '../shared/interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { CommunicationService } from '../core/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {
    titleColors: string[] = ['#FF5252', '#FF4081', '#E040FB',
                            '#7C4DFF', '#536DFE', '#448AFF',
                            '#40C4FF', '#18FFFF', '#64FFDA',
                            '#69F0AE', '#B2FF59', '#EEFF41',
                            '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
    cards: ICard[] = [
        {
            title: 'School',
            color: '',
            tasks: [
                {value: 'Biochem Homework', isChecked: false},
                {value: 'Group study session in the library', isChecked: false},
                {value: 'Pick subject for essay', isChecked: false},
                {value: 'Start writing essay', isChecked: false}
            ]
        },
        {
            title: 'Hofer Groceries',
            color: '',
            tasks: [
                {value: 'Pelati 4x', isChecked: false},
                {value: 'Olivno olje', isChecked: false},
                {value: 'Testo za pico', isChecked: false},
                {value: 'Testenine', isChecked: false},
                {value: 'Yogurt 1L', isChecked: false},
                {value: 'Mleko 5L', isChecked: false},
                {value: 'Parmezan', isChecked: false},
                {value: 'Kokosovo mleko 2x', isChecked: false},
                {value: 'Toast kruh 2x', isChecked: false}
            ]
        },
        {
            title: 'Home chores',
            color: '',
            tasks: [
                {value: 'Pospravi kuhinjo', isChecked: false},
                {value: 'Posesaj', isChecked: false},
                {value: 'Popravi vrata', isChecked: false},
                {value: 'Silikoniraj razpoke', isChecked: false},
                {value: 'Izprazni lopo', isChecked: false}
            ]
        }
    ];
    activeCard = this.cards.length - 1;
    activeNewTaskIx: number = null;
    faTrashAlt = faTrashAlt;
    @ViewChildren('cardList') cardListViewChildren: QueryList<ElementRef>;
    @ViewChildren('newTaskBox') newTaskBoxViewChildren: QueryList<ElementRef>;
    moveY = 0;
    newTaskValue = '';
    subscription: Subscription;

    constructor(private comms: CommunicationService) { }

    ngOnInit(): void {
        this.cards.map((card: ICard) => card.color = this.getRandomColor());
        this.subscription = this.comms.addBtnClicked$.subscribe(state => {
            if (state) {
                this.createNewList();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    activateCard(index: number): void {
        if (index === this.activeCard) {
            this.activeCard = this.cards.length - 1;
            this.moveY = 0;
        } else {
            this.activeCard = index;
            const elem: ElementRef[] = this.cardListViewChildren.filter((element, ix) => ix === index);
            const height = getComputedStyle(elem[0].nativeElement).getPropertyValue('height');
            const padding = getComputedStyle(elem[0].nativeElement).getPropertyValue('padding');
            this.moveY = parseInt(height.substring(0, height.length - 2), 10) +
                        parseInt(padding.substring(0, padding.length - 2), 10);
        }
    }

    checkTask(index: number, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        // console.log('clicked task: ' + index);
        this.cards[this.activeCard].tasks[index].isChecked = !this.cards[this.activeCard].tasks[index].isChecked;
        // console.log(this.cards[this.activeCard].tasks[index].isChecked);
    }

    preventClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    activateNewTask(isFocus: boolean): void {
        if (isFocus) {
            this.activeNewTaskIx = this.activeCard;
        } else {
            this.activeNewTaskIx = null;
        }
    }

    addTask(event): void {
        // const elem: ElementRef[] = this.newTaskBoxViewChildren.filter((element, ix) => ix === this.activeCard);
        // elem[0].nativeElement.blur();
        // elem[0].nativeElement.value = '';
        event.preventDefault();
        const taskValue = event.target.value;
        if (taskValue !== '') {
            this.newTaskValue = '';
            const newTask: ITask = {
                value: taskValue,
                isChecked: false
            };
            this.cards[this.activeCard].tasks.push(newTask);
        }
    }

    createNewList(): void {
        const defaultCard: ICard = {
            title: 'Add your title here',
            color: this.getRandomColor(),
            tasks: []
        };
        this.cards.push(defaultCard);
        this.activeCard = this.cards.length - 1;
    }

    getRandomColor(): string {
        return this.titleColors[Math.floor(Math.random() * this.titleColors.length)];
    }

}
