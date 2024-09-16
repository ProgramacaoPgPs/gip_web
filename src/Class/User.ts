import { iUser } from "../Interface/iGIPP";

export default class User {
    #id: number;
    #youContact?: number;
    #notification?: number;
    #pendingMessage?: number;
    #name?: string;
    #company?: string;
    #administrator: number;
    #session: string;

    constructor(user: iUser) {
        this.#id = user.id;
        this.#administrator = user.administrator;
        this.#session = user.session;

        // Optional properties
        this.#youContact = user.youContact;
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
    get youContact(): number | undefined {
        return this.#youContact;
    }

    set youContact(youContact: number | undefined) {
        this.#youContact = youContact;
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
}
