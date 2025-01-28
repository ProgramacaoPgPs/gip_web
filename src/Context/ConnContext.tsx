import { createContext, useContext } from "react";
import { handleNotification } from "../Util/Util";
import Translator from "../Util/Translate";

interface ConnectionContextProps {
    fetchData: (req: iReq) => Promise<any>;
}
interface iReq {
    method?: "GET" | "POST" | "PUT" | "DELETE", params: string | {}, pathFile: string, appId?: string, urlComplement?: string
}
const ConnectionContext = createContext<ConnectionContextProps | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const fetchData = async (req: iReq) => {
        const URL = settingUrl(`/Controller/${req.pathFile}?app_id=${req.appId ? req.appId : "18"}&AUTH=${localStorage.tokenGIPP ? localStorage.tokenGIPP : ''}${req.urlComplement}`);
        let result:{error:boolean,message?:string,data?:any} = {error:true,message:"Generic Error!"};
        try {
            const response = await fetch(URL, { method: req.method, body: JSON.stringify(req.params) });
            const body = await response.json();
            if (body.error) throw new Error(body.message);
            result = body;
        } catch (messageErr:any) {
            const translate = new Translator(messageErr.message);
            const passDefault = messageErr.message.toLowerCase().includes('default password is not permited');
            handleNotification(passDefault ? "Atenção!" : "Erro!", translate.getMessagePT(), passDefault ? "info" : "danger");
            result = { error: true, message: messageErr.message };
        }finally{
            return result;
        }
    };
    function settingUrl(middlewer: string, params?: string) {
        let server = "http://gigpp.com.br:72/GLOBAL";
        let token = localStorage.getItem("tokenGIPP");
        return server + middlewer + token + (params ? params : "");
    }

    return (
        <ConnectionContext.Provider value={{ fetchData }}>
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => {
    const context = useContext(ConnectionContext);
    if (!context) {
        throw new Error("useConnection must be used within a ConnectionProvider");
    }
    return context;
};
