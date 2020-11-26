import { Component, OnInit } from '@angular/core';
import { ICard } from '../shared/interfaces';

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
      title: 'Groceries form Hofer',
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

  constructor() { }

  ngOnInit(): void {
    this.cards.map((card: ICard) => card.color = this.getRandomColor());
  }

  activateCard(index: number): void {
    console.log(index);
    if (index === this.activeCard) {
      this.activeCard = this.cards.length - 1;
    } else {
      this.activeCard = index;
    }
  }

  getRandomColor(): string {
    return this.titleColors[Math.floor(Math.random() * this.titleColors.length)];
  }

}
