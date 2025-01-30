import { createContext, useContext, useState } from "react";
import { handleNotification } from "../Util/Util";
import Translator from "../Util/Translate";

interface ConnectionContextProps {
    fetchData: (req: iReq) => Promise<any>;
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
}
interface iReq {
    method?: "GET" | "POST" | "PUT" | "DELETE", params: null | {}, pathFile: string, appId?: string, urlComplement?: string
}
const ConnectionContext = createContext<ConnectionContextProps | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogged, setIsLogged] = useState<boolean>(true);
    const fetchData = async (req: iReq) => {
        let URL = settingUrl(`/Controller/${req.pathFile}?app_id=${req.appId ? req.appId : "18"}&AUTH=${localStorage.tokenGIPP ? localStorage.tokenGIPP : ''}${req.urlComplement ? req.urlComplement : ""}`);

        let result: { error: boolean, message?: string, data?: any } = { error: true, message: "Generic Error!" };
        try {
            let objectReq: any = { method: req.method };
            if (req.params) objectReq.body = JSON.stringify(req.params);
            const response = await fetch(URL, objectReq);
            const body = await response.json();
            if (body.error) throw new Error(body.message);
            result = body;
        } catch (messageErr: any) {
            const translate = new Translator(messageErr.message);
            const passDefault = messageErr.message.toLowerCase().includes('default password is not permited');
            const tokenExpired = messageErr.message.toLowerCase().includes('authorization denied') || messageErr.message.toLowerCase().includes('time expired token 24rs limit');
            
            if(tokenExpired && isLogged){
                setIsLogged(false);
                localStorage.clear();
            }
            handleNotification(passDefault ? "Atenção!" : "Erro!", translate.getMessagePT(), passDefault ? "info" : "danger");
            result = { error: true, message: messageErr.message };
        } finally {
            return result;
        }
    };
    function settingUrl(middlewer: string, params?: string) {
        let server = "http://gigpp.com.br:72/GLOBAL";
        return server + middlewer + (params ? params : "");
    }

    return (
        <ConnectionContext.Provider value={{ fetchData, isLogged, setIsLogged }}>
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
