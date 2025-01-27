import { ReactElement, useEffect, useState } from "react";
import AttachmentFile from "../../../Components/AttachmentFile";
import SendMessage from "../Class/SendMessage";
import { useWebSocket } from "../../../Context/WsContext";
import { useMyContext } from "../../../Context/MainContext";
import { Connection } from "../../../Connection/Connection";
import { classToJSON } from "../../../Util/Util";

export default function ChatControls() {
    const [file, setFile] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { idReceived, includesMessage, ws } = useWebSocket();
    const { userLog } = useMyContext();

    return (
        <div className="d-flex align-items-center rounded p-2">
            <button onClick={() => {
                sendAllMessage();
                clearChatControls();
            }} className="btn btn-success fa-solid fa-paper-plane col-2" title="Enviar mensagem"></button>
            <textarea value={message} onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key.includes("Enter")) {
                    sendAllMessage();
                    clearChatControls();
                }
            }} onChange={(element: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(element.target.value)} id="chatControlsTextarea" rows={2} style={{ resize: "none" }} className="mx-2 col-8 border rounded" />
            <AttachmentFile reset={file ? false : true} file={0} onClose={(value) => callBackAttachmentFile(value)} fullFiles={true} />
        </div>
    );
    function callBackAttachmentFile(fileBase64: string) {
        if (fileBase64) {
            setFile(fileBase64);
        }
    }
    // async function sendMessage(item:{id:number,id_user:number,message:string,notification:number,type:number},idReceived:number,base64?:string) {
    //     const connection = new Connection("18");
    //     const req: any = await connection.post(classToJSON(new SendMessage(base64 || item.message, idReceived, userLog.id, item.type)), "CLPP/Message.php");
    //     if (req.error) throw new Error(req.message);
    //     includesMessage({...item});
    //     ws.current.informSending(2, idReceived.toString(), req.last_id);
    // }
    async function sendAllMessage() {
        try {
            const connection = new Connection("18");
            if (file.trim() != '') {
                const type = changeTypeMessageForFile(file);
                const req: any = await connection.post(classToJSON(new SendMessage(file.split('base64,')[1], idReceived, userLog.id, type)), "CLPP/Message.php");
                if (req.error) throw new Error(req.message);
                includesMessage({
                    id: req.last_id,
                    id_user: userLog.id,
                    message: `${idReceived}_${userLog.id}_${req.last_id}.${changeTypeMessageForExtension(type)}`,
                    notification: 1,
                    type: type
                });
                ws.current.informSending(2, idReceived.toString(), req.last_id);
            }
            if (message.trim() != '') {
                const req: any = await connection.post(classToJSON(new SendMessage(message, idReceived, userLog.id, 1)), "CLPP/Message.php");
                if (req.error) throw new Error(req.message);
                includesMessage({
                    id: req.last_id,
                    id_user: userLog.id,
                    message: message,
                    notification: 1,
                    type: 1
                });
                ws.current.informSending(2, idReceived.toString(), req.last_id);
            };
        } catch (error: any) {
            alert(error.message);
        }
    }
    function clearChatControls() {
        setFile("");
        setMessage("");
    }

    /*
         function clearAreaMessage() {
            setTextMessage('');
            setFileMessage('');
            setFileNameMessage('');
            setInitScroll(0);
        }
        
    */
    function changeTypeMessageForFile(type: string): number {
        const upperType = type.toUpperCase();
        let result = 0;
        switch (true) {
            case upperType.includes('IMAGE'):
                result = 2;
                break;
            case upperType.includes('PDF'):
                result = 3;
                break;
            case upperType.includes('XML'):
                result = 4;
                break;
            case upperType.includes('CSV'):
                result = 5;
                break;
            default:
                console.log(type);
                result = 6;
                break;
        }
        return result;
    }
    function changeTypeMessageForExtension(typeNumber: number): string {
        let extension = '';
        switch (typeNumber) {
            case 2:
                extension = 'png'; // Ou 'jpg', 'jpeg', dependendo do caso
                break;
            case 3:
                extension = 'pdf';
                break;
            case 4:
                extension = 'xml';
                break;
            case 5:
                extension = 'csv';
                break;
            default:
                console.log(`Número não reconhecido: ${typeNumber}`);
                extension = 'unknown';
                break;
        }
        return extension;
    }

}