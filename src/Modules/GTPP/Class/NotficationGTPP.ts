import { CustomNotification } from "../../../Interface/iGIPP";

export default class NotficationGTPP {
    list: CustomNotification[] = [];
    constructor(array: any[]) {
        array.forEach(element => {
            this.list.push(this.filterTypeNotify(element));
        });
    }

    filterTypeNotify(element: any): CustomNotification {
        let item: CustomNotification = {id:0,message:''};
        switch (parseInt(element.type)) {
            case 2:
                item.id = parseInt(element.id);
                item.message = `${element.object.description}:\n ${element.object?.itemUp.description}`
                break;
            case 6:
                item.id = parseInt(element.id);
                item.message = `${element.object.description}:\n ${element.object?.task?.state_id}`;
                break;
            default:
                break;
        }
        return item;
    }
}