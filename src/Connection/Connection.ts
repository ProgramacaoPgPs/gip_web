export class Connection{
    #URL:string='';
    #params:string='';
    #pathFile:string='';
    #err:boolean = false;
    #appId:string='';
    #login:string='';
    #isInternalNetwork: boolean | null = null;

    constructor(appId:string,isLogin?:boolean){
        this.#appId = appId;
        if(isLogin) this.#login = '&login=';
        this.detectNetwork();
    }

    // Detecta a rede uma única vez e guarda o estado
    async initialize() {
        if (this.#isInternalNetwork === null) {
            await this.detectNetwork();
        }
    }

    // Detecta se estamos na rede interna ou externa
    async detectNetwork() {
        try {
            const response = await fetch('http://192.168.0.99:71/GLOBAL/');
            this.#isInternalNetwork = response.ok;
        } catch (e) {
            // Se a requisição falhar, assume que estamos na rede externa
            this.#isInternalNetwork = false;
        }
    }

    async get(params:string, pathFile:string, err?:boolean) {
        this.validationParams(params, pathFile, err);
        await this.settingUrl(`/Controller/${this.#pathFile}?app_id=${this.#appId}&AUTH=`, params)
        let req;
        await fetch(this.#URL, {
            method: 'GET'
        }).then(response => response.json()) 
            .then(body => {
                if (body.error) throw new Error(body.message)
                req = body;
            }).catch(messageErr => {
                req = this.prepareCatchReturn(messageErr);
            })
        return req;
    }
    async post(params:{}, pathFile:string, err?:boolean) {
        this.validationParams(params, pathFile, err);
        await this.settingUrl(`/Controller/${this.#pathFile}?app_id=${this.#appId}${this.#login}&AUTH=`)
        let req;
        await fetch(this.#URL, {
            method: 'POST',
            body: JSON.stringify(this.#params)
        }).then(response => response.json())
            .then(body => {
                if (body.error) throw Error(body.message);
                req = body;
            }).catch(messageErr => {
                req = this.prepareCatchReturn(messageErr);
            })
        return req;
    }
    async put(params:{}, pathFile:string, err?:boolean) {
        this.validationParams(params, pathFile, err);
        await this.settingUrl(`/Controller/${this.#pathFile}?app_id=${this.#appId}${this.#login}&AUTH=`)
        let req;
        await fetch(this.#URL, {
            method: 'PUT',
            body: JSON.stringify(this.#params)
        }).then(response => response.json())
            .then(body => {
                if (body.error) throw Error(body.message)
                req = body;
            }).catch(messageErr => {
                req = this.prepareCatchReturn(messageErr);
            })
        return req;
    }
    async delete(params:{}, pathFile:string, err?:boolean) {
        this.validationParams(params, pathFile, err);
        await this.settingUrl(`/Controller/${this.#pathFile}?app_id=${this.#appId}&AUTH=`);
        let req;
        await fetch(this.#URL, {
            method: "DELETE",
            body: JSON.stringify(this.#params)
        }).then((response) => response.json())
            .then((body) => {
                if (body.error) throw Error(body.message);
                req = body;
            }).catch((messageErr) => {
                req = this.prepareCatchReturn(messageErr);
            });
        return req;
    }
    validationParams(params:any, pathFile:string, err?:boolean) {
        if (params) this.#params = params;
        if (pathFile) this.#pathFile = pathFile;
        if (err) this.#err = err;
    }
    async settingUrl(middlewer: string, params?: string) {
        await this.initialize();
        let server = this.#isInternalNetwork ? "http://192.168.0.99:71/GLOBAL" : "http://187.92.74.154:71/GLOBAL";
        let token = localStorage.getItem("token");
        this.#URL = server + middlewer + token + (params ? params : "");
    }
    prepareCatchReturn(messageErr:any) {
        return { "error": true, "message": messageErr["message"] }
    }
}