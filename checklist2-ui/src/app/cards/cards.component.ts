import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ICard } from '../shared/interfaces';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
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
    activeNewTask = false;
    faTrashAlt = faTrashAlt;
    @ViewChildren('cardList') cardListViewChildren: QueryList<ElementRef>;
    @ViewChildren('newTaskBox') newTaskBoxViewChildren: QueryList<ElementRef>;
    moveY = 0;

    constructor() { }

    ngOnInit(): void {
        this.cards.map((card: ICard) => card.color = this.getRandomColor());
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
        console.log('clicked task: ' + index);
        this.cards[this.activeCard].tasks[index].isChecked = !this.cards[this.activeCard].tasks[index].isChecked;
        console.log(this.cards[this.activeCard].tasks[index].isChecked);
    }

    preventClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    activateNewTask(): void {
        this.activeNewTask = !this.activeNewTask;
    }

    getRandomColor(): string {
        return this.titleColors[Math.floor(Math.random() * this.titleColors.length)];
    }

}
