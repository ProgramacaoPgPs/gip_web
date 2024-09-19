import User from "../../../Class/User";
import { Connection } from "../../../Connection/Connection";

export default class ContactList {
    #connection: Connection = new Connection('18');
    contacts: User[] = [];
    #idUser: number;

    constructor(id: number) {
        this.#idUser = id;
    }

    async loadListContacts(): Promise<void> {
        try {
            let listFull:any = await this.#connection.get(`&application_id=18&web`, 'CCPP/UserAccess.php')||{error:false,message:''};
      
            if (listFull && listFull.error && !listFull.message.includes('No data')) throw new Error(listFull.message);
            this.contacts = await this.loadInfo(listFull.data);
            console.warn(this.contacts);
            
            let list:any = await this.#connection.get(`&id=${this.#idUser}&id_user`, 'CLPP/Message.php');
            if (list.error) throw new Error(list.message);
            
            // this.checkYouContacts(list.data);

        } catch (error) {
            alert(error);
        }
    }

    async loadInfo(list: any[]): Promise<User[]> {
        const promises = list.map(async (item) => {
            const user = new User({id:item.id,session:'',administrator:0});
            await user.loadInfo();
            return user;
        });
        const results = await Promise.all(promises);
        return results;
    }

    checkYouContacts(list: any[]): void {
        list.forEach(item => {
            if (item.id_user) {
                this.contacts.forEach(contactLocal => {
                    if (contactLocal.id === parseInt(item.id_user)) {
                        contactLocal.youContact = 1;
                        contactLocal.notification = item.notification;
                    }
                });
            }
        });
    }

    // changeYouListContact(id: number): void {
    //     this.contacts.forEach(contact => {
    //         if (parseInt(contact.id) === id) {
    //             contact.youContact = 1;
    //         }
    //     });
    // }
}
