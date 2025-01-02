import { CustomNotification, iStates } from "../../../Interface/iGIPP";

export default class NotificationGTPP {
    list: CustomNotification[] = [];
    states?: iStates[];
    constructor(array: any[], states?: iStates[]) {
        array.forEach(element => {
            this.list.push(this.filterTypeNotify(element));
        });
        this.states = states;
    }

    filterTypeNotify(element: any): CustomNotification {
        let item: CustomNotification = { id: 0, message: '' };
        switch (parseInt(element.type)) {
            case 2:
                item.id = parseInt(element.id);
                item.message = `${element.object.description}:\n ${element.object?.itemUp.description}`
                break;
            case 6:
                item.id = parseInt(element.id);
                item.message = `${element.object.description}:\n ${this.filterStateName(element.object?.task?.state_id)}`;
                break;
            default:
                break;
        }
        return item;
    }

    filterStateName(id: number): string {
        let result: string = '';
        console.log(
            this.states?.filter((value:iStates)=>  value.id = id)
        )

        return result;
    }
}