import { Store } from "react-notifications-component";
import { Connection } from "../Connection/Connection";

const connection = new Connection("18", true);

export const convertdate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short"
    }).format(new Date(date))
}

export const httpGet = async (url: string, params: any = {}) => {
    return connection.get(url, params);
};

export const httpPost = async (url: string, data: any) => {
    return connection.post(data, url);
};

export const httpPut = async (url: string, data: any) => {
    return connection.put(data, url);
};

export function convertImage(src: any) {
    if (src != null) {
        var image = new Image();
        image.src = "data:image/jpeg;base64, " + src;
        return image.src;
    } else {
        return null;
    }
}

export function isJSON(obj: string): boolean {
    try {
        JSON.parse(obj);
        return true;
    } catch (error) {
        return false;
    }
}

export function classToJSON(instance: object): Record<string, unknown> {
    const json: Record<string, unknown> = {};

    // Itera sobre os próprios getters da classe
    Object.entries(Object.getOwnPropertyDescriptors(instance.constructor.prototype))
        .filter(([_, descriptor]) => typeof descriptor.get === "function") // Apenas getters
        .forEach(([key]) => {
            json[key] = (instance as any)[key];
        });
    return json;
}

export function handleNotification(title: string, message: string, type: 'success' | 'danger' | 'info' | 'default' | 'warning', align?: "bottom-left" | "bottom-right" | "bottom-center" | "center" | "top-left" | "top-right" | "top-center", time?: number) {
    Store.addNotification({
        title: title,
        message: message,
        type: type, // Tipos: "success", "danger", "info", "default", "warning"
        insert: "top", // Posição na tela: "top" ou "bottom"
        container: align ? align : "bottom-left",
        animationIn: ["animate__animated animate__zoomIn"],
        animationOut: ["animate__animated animate__flipOutX"],
        dismiss: {
            duration: time ? time : 5000, // Tempo em ms
            onScreen: true,
        },
    });
}

export function isTokenExpired(expirationDate: string): boolean {
    let result: boolean = true;
    if (expirationDate) {
        const expirationTime = new Date(expirationDate).getTime();
        const currentTime = Date.now();
        result = currentTime > expirationTime;
    }
    return result;
};