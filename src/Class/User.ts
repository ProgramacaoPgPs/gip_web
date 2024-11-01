import { Connection } from "../Connection/Connection";
import { iUser } from "../Interface/iGIPP";

export default class User {
    #id: number;
    #yourContact?: number;
    #notification?: number;
    #pendingMessage?: number;
    #name?: string;
    #company?: string;
    #administrator: number;
    #session: string;
    photo: string = '';
    shop: number = 0;
    departament: string = '';
    sub: string = '';
    CSDS: string = '';
    #connection: Connection = new Connection('18');

    constructor(user: iUser) {
        this.#id = user.id;
        user.id && this.loadInfo();
        this.#administrator = user.administrator;
        this.#session = user.session;

        // Optional properties
        this.#yourContact = user.yourContact;
        this.#notification = user.notification;
        this.#pendingMessage = user.pendingMessage;
        this.#name = user.name;
        this.#company = user.company;
    }

    // Getter for id
    get id(): number {
        return this.#id;
    }

    // Optional properties' getters and setters
    get yourContact(): number | undefined {
        return this.#yourContact;
    }

    set yourContact(yourContact: number | undefined) {
        this.#yourContact = yourContact;
    }

    get notification(): number | undefined {
        return this.#notification;
    }

    set notification(notification: number | undefined) {
        this.#notification = notification;
    }

    get pendingMessage(): number | undefined {
        return this.#pendingMessage;
    }
    
    set pendingMessage(pendingMessage: number | undefined) {
        this.#pendingMessage = pendingMessage;
    }
    
    get name(): string | undefined {
        return this.#name;
    }
    // getName(): string | undefined {
    //     return this.#name;
    // }

    set name(name: string | undefined) {
        this.#name = name;
    }

    get company(): string | undefined {
        return this.#company;
    }

    set company(company: string | undefined) {
        this.#company = company;
    }

    get administrator(): number {
        return this.#administrator;
    }

    set administrator(administrator: number) {
        this.#administrator = administrator;
    }

    get session(): string {
        return this.#session;
    }

    set session(session: string) {
        this.#session = session;
    }

    async loadInfo(): Promise<void> {
        await this.loadPhotos();
        await this.loadDetails();
    }

    async loadPhotos(): Promise<void> {
        try {
            const userPhoto: any = await this.#connection.get(`&id=${this.id}`, 'CCPP/EmployeePhoto.php');
            if (userPhoto.error && !userPhoto.message.includes('No data')) {
                throw new Error(userPhoto.message);
            } else if (!userPhoto.message) {
                this.photo = userPhoto.photo;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async loadDetails(): Promise<void> {
        try {
            const details: any = await this.#connection.get(`&id=${this.id}`, 'CCPP/Employee.php');
            if (details.error && !details.message.includes('No data')) throw new Error(details.message);

            this.name = details.data[0]["name"];
            this.company = details.data[0]["company"];
            this.shop = details.data[0]["shop"];
            this.departament = details.data[0]["departament"];
            this.sub = details.data[0]["sub"];
            this.CSDS = details.data[0]["CSDS"];
            this.administrator = details.data[1]["administrator"];
        } catch (error) {
            // alert(error);
            console.log(error);
        }
    }

}
