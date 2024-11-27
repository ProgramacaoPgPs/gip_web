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