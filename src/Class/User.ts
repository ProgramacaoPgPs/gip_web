import { iUser } from "../Interface/iGIPP";

export default class User{
    #login:string;
    #password:string;
    constructor(user:iUser){
        this.#login = user.login;
        this.#password = user.password;
    }

    getLogin():string{
        return this.#login;
    }

    getPassword():string{
        return this.#password;
    }

    setLogin(login:string):void{
        this.#login = login;
    }
    setPassword(password:string):void{
        this.#password = password;
    }
}