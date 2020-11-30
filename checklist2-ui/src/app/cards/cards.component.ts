import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
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
        // {
        //     title: 'School',
        //     color: '',
        //     tasks: [
        //         {value: 'Biochem Homework', isChecked: false},
        //         {value: 'Group study session in the library', isChecked: false},
        //         {value: 'Pick subject for essay', isChecked: false},
        //         {value: 'Start writing essay', isChecked: false}
        //     ]
        // },
        // {
        //     title: 'Hofer Groceries',
        //     color: '',
        //     tasks: [
        //         {value: 'Pelati 4x', isChecked: false},
        //         {value: 'Olivno olje', isChecked: false},
        //         {value: 'Testo za pico', isChecked: false},
        //         {value: 'Testenine', isChecked: false},
        //         {value: 'Yogurt 1L', isChecked: false},
        //         {value: 'Mleko 5L', isChecked: false},
        //         {value: 'Parmezan', isChecked: false},
        //         {value: 'Kokosovo mleko 2x', isChecked: false},
        //         {value: 'Toast kruh 2x', isChecked: false}
        //     ]
        // },
        // {
        //     title: 'Home chores',
        //     color: '',
        //     tasks: [
        //         {value: 'Pospravi kuhinjo', isChecked: false},
        //         {value: 'Posesaj', isChecked: false},
        //         {value: 'Popravi vrata', isChecked: false},
        //         {value: 'Silikoniraj razpoke', isChecked: false},
        //         {value: 'Izprazni lopo', isChecked: false}
        //     ]
        // }
    ];
    faTrashAlt = faTrashAlt;
    faEdit = faEdit;
    activeCard = this.cards.length - 1;
    activeNewTaskIx: number = null;
    isActiveTitleEdit = false;
    @ViewChildren('card') cardsViewChildren: QueryList<ElementRef>;
    @ViewChildren('cardTitle') cardTitleViewChildren: QueryList<ElementRef>;
    @ViewChildren('cardList') cardListViewChildren: QueryList<ElementRef>;
    @ViewChildren('taskItem') taskItemsViewChildren: QueryList<ElementRef>;
    moveY = 0;
    tempTitleHeight = 0;
    newTaskValue = '';
    commsSubscription: Subscription;
    taskViewChildrenChangeSubscription: Subscription;
    cardsViewChildrenChangeSubscription: Subscription;

    constructor(private comms: CommunicationService, private cdRef: ChangeDetectorRef) { }

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
            setTimeout(() => {
                if (this.cards.length > 0 && taskItems.length > 0) {
                    const globalTaskIndex = this.computeTaskGlobalIndex(this.cards[this.activeCard].tasks.length - 1);
                    this.moveElementY(taskItems, globalTaskIndex, 'height', 'margin-bottom', 'task');
                }
            }, 1);
        });

        this.cardsViewChildrenChangeSubscription = this.cardsViewChildren.changes.subscribe(() => {
            const newMaxHeight = this.findMaxHeight(this.cardsViewChildren.toArray());
            this.setCardsHeight(newMaxHeight);
        });

        const maxHeight = this.findMaxHeight(this.cardsViewChildren.toArray());
        this.setCardsHeight(maxHeight);
    }

    ngOnDestroy(): void {
        this.commsSubscription.unsubscribe();
        this.taskViewChildrenChangeSubscription.unsubscribe();
        this.cardsViewChildrenChangeSubscription.unsubscribe();
    }

    /**
     * Sets new min-height property to all cards.
     * @param height - height that gets applied to all cards.
     */
    setCardsHeight(height: number): void {
        for (const [i, cardElem] of this.cardsViewChildren.toArray().entries()) {
            if (i !== 0) {
                cardElem.nativeElement.style.minHeight = height + 'px';
            }
        }
    }

    /**
     * Finds the card with the largest hight value.
     * @param elementsArray - HTML cards array.
     * @returns maximum height in pixels.
     */
    findMaxHeight(elementsArray: ElementRef[]): number {
        const maxHeightCard = elementsArray.reduce((p: ElementRef, v: ElementRef) => {
            return ( p.nativeElement.offsetHeight > v.nativeElement.offsetHeight ? p : v );
        }, new ElementRef({}));
        return maxHeightCard.nativeElement.offsetHeight;
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
     * If neccesary, moves cards to incorporate new title height.
     */
    toggleEditMode(): void {
        if (this.isActiveTitleEdit) {
            // Leave edit mode
            this.isActiveTitleEdit = false;
            let newTitleHeight: number;
            let diffTitleHeight: number;
            this.cdRef.detectChanges();
            newTitleHeight = this.getTitleHeight(this.cardTitleViewChildren.toArray());
            diffTitleHeight = newTitleHeight - this.tempTitleHeight;
            this.moveElementY(this.cardTitleViewChildren.toArray(), this.activeCard, 'height', 'margin', 'title', diffTitleHeight);
        } else {
            // Enter edit mode
            this.isActiveTitleEdit = true;
            this.tempTitleHeight = this.getTitleHeight(this.cardTitleViewChildren.toArray());
        }
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
     * @param items     - array with the HTML elements.
     * @param elementIx - the select element index to search for in the items array.
     * @param property1 - first style property, usually height.
     * @param property2 - second style property, usually margin/padding.
     * @param moveType  - used to identify type of movement.
     * @param offset    - (optional) additional vertical offset; used for long titles.
     */
    moveElementY(items: ElementRef[], elementIx: number, property1: string, property2: string, moveType: string, offset: number = 0): void {
        const newTaskElem: ElementRef[] = items.filter((element, ix) => ix === elementIx);
        const height = getComputedStyle(newTaskElem[0].nativeElement).getPropertyValue(property1);
        const padding = getComputedStyle(newTaskElem[0].nativeElement).getPropertyValue(property2);
        const heightNum = parseInt(height.substring(0, height.length - 2), 10);
        const paddingNum = parseInt(padding.substring(0, padding.length - 2), 10);

        if (moveType === 'card') {
            this.moveY = heightNum + offset;
        } else if (moveType === 'task') {
            this.moveY += heightNum + paddingNum;
        } else if (moveType === 'title') {
            this.moveY += offset;
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
            this.cdRef.detectChanges();
            const titleHeight = this.getTitleHeight(this.cardTitleViewChildren.toArray());
            this.moveElementY(this.cardListViewChildren.toArray(), index, 'height', 'padding', 'card', titleHeight);
        }
        this.isActiveTitleEdit = false;
    }

    /**
     * Returns HTML element height of ACTIVE card title.
     * @param titleElemArray - array with HTML elements.
     */
    getTitleHeight(titleElemArray: ElementRef[]): number {
        const cardTitleElem: ElementRef[] = titleElemArray.filter((element, ix) => ix === this.activeCard);
        const height = getComputedStyle(cardTitleElem[0].nativeElement).getPropertyValue('height');
        return parseInt(height.substring(0, height.length - 2), 10);
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
     * Cards automatically move in changes listener in ngAfterViewInit.
     * Sets the new min-height for cards.
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

            const maxHeightAdjust = this.findMaxHeight(this.cardsViewChildren.toArray());
            this.setCardsHeight(maxHeightAdjust);
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
