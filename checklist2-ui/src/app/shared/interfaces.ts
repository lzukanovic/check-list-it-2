export interface ICard {
    title: string;
    color: string;
    tasks: ITask[];
}

export interface ITask {
    value: string;
    isChecked: boolean;
}