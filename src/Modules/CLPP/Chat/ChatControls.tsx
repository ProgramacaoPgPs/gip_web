import { useState } from "react";
import AttachmentFile from "../../../Components/AttachmentFile";
import SendMessage from "../Class/SendMessage";
import { useWebSocket } from "../../../Context/WsContext";
import { useMyContext } from "../../../Context/MainContext";
import { captureTime, classToJSON } from "../../../Util/Util";
import { useConnection } from "../../../Context/ConnContext";

export default function ChatControls() {
    const [file, setFile] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { idReceived, includesMessage, ws } = useWebSocket();
    const { userLog } = useMyContext();
    const { fetchData } = useConnection();

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

    async function sendFile() {
        const type = changeTypeMessageForFile(file);
        const req: any = await fetchData({ method: "POST", params: classToJSON(new SendMessage(file.split('base64,')[1], idReceived, userLog.id, type)), pathFile: "CLPP/Message.php" });
        if (req.error) throw new Error(req.message);
        includesMessage({
            id: req.last_id,
            id_user: userLog.id,
            message: `${idReceived}_${userLog.id}_${req.last_id}.${getBase64FileExtension(file)}`,
            notification: 1,
            type: type,
            date: captureTime()
        });
        ws.current.informSending(2, idReceived.toString(), req.last_id);
    }

    async function sendText() {
        const req: any = await fetchData({ method: "POST", params: classToJSON(new SendMessage(message, idReceived, userLog.id, 1)), pathFile: "CLPP/Message.php" });
        if (req.error) throw new Error(req.message);
        includesMessage({
            id: req.last_id,
            id_user: userLog.id,
            message: message,
            notification: 1,
            type: 1,
            date: captureTime()
        });
        ws.current.informSending(2, idReceived.toString(), req.last_id);
    }

    async function sendAllMessage() {
        try {
            if (file.trim() != '') {
                await sendFile();
            }
            if (message.trim() != '') {
                await sendText();
            };
        } catch (error: any) {
            console.error(error.message);
        }
    }

    function clearChatControls() {
        setFile("");
        setMessage("");
    }

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
    function getBase64FileExtension(base64: string) {
        // Verifica se o base64 possui a estrutura correta com "data:mime/type;base64,"
        const match = base64.match(/^data:(.+);base64,/);
        if (!match) {
            throw new Error("Formato Base64 inválido");
        }

        const mimeType = match[1]; // Obtém o tipo MIME, exemplo: "image/png"
        const extension = mimeType.split("/")[1]; // Pega a extensão após a barra "/"

        return extension; // Retorna, por exemplo: "png"
    };
}