import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ICard } from '../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    localStorage: Storage;

    changes$ = new Subject();

    constructor() {
        this.localStorage = window.localStorage;
    }

    get(key: string): any {
        if (this.isLocalStorageSupported) {
            return JSON.parse(this.localStorage.getItem(key));
        }

        return null;
    }

    set(key: string, value: any): boolean {
        if (this.isLocalStorageSupported) {
            this.localStorage.setItem(key, JSON.stringify(value));
            // this.changes$.next({
            //     type: 'set',
            //     key,
            //     value
            // });
            return true;
        }

        return false;
    }

    removeById(key: string, index: number): boolean {
        if (this.isLocalStorageSupported) {
            const cards: ICard[] = this.get(key);
            cards.splice(index, 1);
            this.set('cards', cards);
            return true;
        }

        return false;
    }

    doesKeyExist(key: string): boolean {
        if (this.isLocalStorageSupported) {
            if (JSON.parse(this.localStorage.getItem(key))) {
                return true;
            } else {
                return false;
            }
        }

        return false;
    }

    get isLocalStorageSupported(): boolean {
        return !!this.localStorage;
    }

}
