import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';

import { ICard, ITask } from '../shared/interfaces';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import { CommunicationService } from '../core/communication.service';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    animations: [
        trigger(
          'fadeAnimation',
          [
            transition(
              ':enter',
              [
                style({ opacity: 0 }),
                animate('0.2s ease-out',
                        style({ opacity: 1 }))
              ]
            ),
            transition(
              ':leave',
              [
                style({ opacity: 1 }),
                animate('0.2s ease-in',
                        style({ opacity: 0 }))
              ]
            )
          ]
        )
    ]
})
export class CardsComponent implements OnInit, OnDestroy, AfterViewInit {
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
    faTrashAlt = faTrashAlt;
    faEdit = faEdit;
    activeCard = this.cards.length - 1;
    activeNewTaskIx: number = null;
    isActiveTitleEdit = false;
    @ViewChildren('cardList') cardListViewChildren: QueryList<ElementRef>;
    @ViewChildren('taskItem') taskItemsViewChildren: QueryList<ElementRef>;
    moveY = 0;
    newTaskValue = '';
    commsSubscription: Subscription;
    taskViewChildrenChangeSubscription: Subscription;

    constructor(private comms: CommunicationService) { }

    ngOnInit(): void {
        this.cards.map((card: ICard) => card.color = this.getRandomColor());
        this.commsSubscription = this.comms.addBtnClicked$.subscribe(state => {
            if (state) {
                this.createNewList();
            }
        });
    }

    ngAfterViewInit(): void {
        this.taskViewChildrenChangeSubscription = this.taskItemsViewChildren.changes.subscribe(taskItems => {
            // setTimeout used to avoid ExpressionChangedAfterItHasBeenCheckedError
            console.log(taskItems);
            setTimeout(() => {
                if (this.cards.length > 0 && taskItems.length > 0) {
                    const globalTaskIndex = this.computeTaskGlobalIndex(this.cards[this.activeCard].tasks.length - 1);
                    this.moveElementY(taskItems, globalTaskIndex, 'height', 'margin-bottom', false);
                }
            }, 10);
        });

    }

    ngOnDestroy(): void {
        this.commsSubscription.unsubscribe();
        this.taskViewChildrenChangeSubscription.unsubscribe();
    }

    /**
     * Saves title change.
     * @param value - new value from textarea input.
     */
    saveTitleChange(value: string): void {
        this.cards[this.activeCard].title = value;
    }

    /**
     * Toggles into title edit mode.
     */
    toggleEditMode(): void {
        this.isActiveTitleEdit = !this.isActiveTitleEdit;
    }

    /**
     * Deletes the ACTIVE card.
     */
    deleteCard(): void {
        if (this.activeCard === this.cards.length - 1) {
            this.cards.splice(this.activeCard, 1);
            this.activeCard--;
        } else {
            this.cards.splice(this.activeCard, 1);
            this.activeCard = this.cards.length - 1;
        }
    }

    /**
     * Used to manually move cards lower to accomodate changes.
     * @param items - ViewChildren QueryList with the HTML elements.
     * @param elementIx - The select element index to search for in the items array.
     * @param property1 - first style property, usually height.
     * @param property2 - second style property, usually margin/padding.
     * @param equals    - used to identify if equation only or equation and addition.
     */
    moveElementY(items, elementIx: number, property1: string, property2: string, equals: boolean): void {
        let moveDif = 0;
        const newTaskElem: ElementRef[] = items.filter((element, ix) => ix === elementIx);
        const height = getComputedStyle(newTaskElem[0].nativeElement).getPropertyValue(property1);
        const padding = getComputedStyle(newTaskElem[0].nativeElement).getPropertyValue(property2);
        moveDif = parseInt(height.substring(0, height.length - 2), 10) +
                    parseInt(padding.substring(0, padding.length - 2), 10);

        if (equals) {
            this.moveY = moveDif;
        } else {
            this.moveY += moveDif;
        }
    }

    /**
     * Changes the activeCard index to the one selected.
     * If the selected card was not the last one, it moves the cards by the calculated value.
     * @param index - index of the selected card.
     */
    activateCard(index: number): void {
        if (index === this.activeCard) {
            this.activeCard = this.cards.length - 1;
            this.moveY = 0;
        } else {
            this.activeCard = index;
            this.moveElementY(this.cardListViewChildren, index, 'height', 'padding', true);
        }
        this.isActiveTitleEdit = false;
    }

    /**
     * Changes the clicked checkbox's task's isChecked property to its adjacent value.
     * @param index - index of the clicked task item of the ACTIVE card.
     */
    checkTask(index: number): void {
        this.cards[this.activeCard].tasks[index].isChecked = !this.cards[this.activeCard].tasks[index].isChecked;
    }

    /**
     * Prevents parent HTML elements of clicked task field from registering click event.
     * Click event happens when user tries to edit task item.
     * @param event - event object from HTML element.
     */
    preventClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Respectively changes the index of the currently active new task input field
     * @param isFocus - is different depending on focus/blur event trigger from HTML element
     */
    activateNewTask(isFocus: boolean): void {
        if (isFocus) {
            this.activeNewTaskIx = this.activeCard;
        } else {
            this.activeNewTaskIx = null;
        }
    }

    /**
     * ENTER key pressed down listener that adds a new task item to the ACTIVE card.
     * and automatically move the other cards appropriately.
     * @param event - event object from HTML element.
     */
    addTask(event): void {
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

    /**
     * Accumulator function that returns calculated global index of task item in ACTIVE card.
     * @param localIndex - local index of task item.
     * @return counted global index of task item.
     */
    computeTaskGlobalIndex(localIndex: number): number {
        let indexAccumulator = 0;
        let cardCursor = 0;
        if (this.cards.length > 0) {
            while (cardCursor <= this.activeCard) {
                if (cardCursor === this.activeCard) {
                    indexAccumulator += localIndex;
                } else {
                    indexAccumulator += this.cards[cardCursor].tasks.length;
                }
                cardCursor++;
            }
        }
        return indexAccumulator;
    }

    /**
     * Creates a new default list and closes any opened cards.
     */
    createNewList(): void {
        const defaultCard: ICard = {
            title: 'Add your title here',
            color: this.getRandomColor(),
            tasks: []
        };
        if (this.activeCard !== this.cards.length - 1) {
            this.activeCard = this.cards.length - 1;
            setTimeout(() => {
                this.cards.push(defaultCard);
                this.activeCard = this.cards.length - 1;
            }, 120);
        } else {
            this.cards.push(defaultCard);
            this.activeCard = this.cards.length - 1;
        }
    }

    /**
     * Returns random color string from array of strings.
     * @return random color HEX code.
     */
    getRandomColor(): string {
        return this.titleColors[Math.floor(Math.random() * this.titleColors.length)];
    }

}
