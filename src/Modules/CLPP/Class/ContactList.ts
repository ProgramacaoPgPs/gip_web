import User from "../../../Class/User";
import { Connection } from "../../../Connection/Connection";

export default class ContactList {
    #connection: Connection = new Connection('18');
    #contacts: User[] = [];
    #idUser: number;

    constructor(id: number) {
        this.#idUser = id;
    }

    async loadListContacts(): Promise<{ error: boolean; message?: any; data?: any }> {
        try {
            let listFull: any = await this.#connection.get(`&application_id=7&web`, 'CCPP/UserAccess.php') || { error: false, message: '' };

            if (listFull && listFull.error && !listFull.message.includes('No data')) throw new Error(listFull.message);
            this.#contacts = await this.loadInfo(listFull.data);

            let list: any = await this.#connection.get(`&id=${this.#idUser}&id_user`, 'CLPP/Message.php');
            if (list.error) throw new Error(list.message);

            this.checkyourContacts(list.data);
            return { error: false, data: this.#contacts }
        } catch (error) {
            return { error: true, message: error }
        }
    }

    async loadInfo(list: any[]): Promise<User[]> {
        const promises = list.map((item) => {
            const user = new User({ id: item.id, session: '', administrator: 0 });
            return user;
        });
        const results = await Promise.all(promises);
        return results;
    }

    checkyourContacts(list: any[]): void {
        list.forEach(item => {
            if (item.id_user) {
                this.#contacts.forEach(contact => {
                    if (contact.id == parseInt(item.id_user)) {
                        contact.yourContact = 1;
                        contact.notification = item.notification;
                    }
                });
            }
        });
    }

    changeYouListContact(id: number): void {
        this.#contacts.forEach(contact => {
            if (contact.id === id) {
                contact.yourContact = 1;
            }
        });
    }
}
