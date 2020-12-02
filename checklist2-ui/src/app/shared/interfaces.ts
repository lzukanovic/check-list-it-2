export interface ICard {
    title: string;
    initalTitle: boolean;
    color: string;
    tasks: ITask[];
}

export interface ITask {
    value: string;
    isChecked: boolean;
}
