import { ReactElement, useEffect, useState } from "react";
import AttachmentFile from "../../../Components/AttachmentFile";
import SendMessage from "../Class/SendMessage";

export default function ChatControls() {
    const [file, setFile] = useState<string>("");
    const [message, setMessage] = useState<string>("");


    return (
        <div className="d-flex align-items-center rounded p-2">
            <button onClick={() => {
                sendAllMessage();
                clearChatControls();
            }} className="btn btn-success fa-solid fa-paper-plane col-2" title="Enviar mensagem"></button>
            <textarea value={message} onChange={(element: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(element.target.value)} id="chatControlsTextarea" rows={2} style={{ resize: "none" }} className="mx-2 col-8 border rounded" />
            <AttachmentFile reset={file ? false : true} file={0} onClose={(value) => callBackAttachmentFile(value)} fullFiles={true} />
        </div>
    );
    function callBackAttachmentFile(fileBase64: string) {
        if (fileBase64) {
            setFile(fileBase64);
        }
    }

    async function sendAllMessage() {
        if (file) console.log(new SendMessage(file,148,68,changeTypeMessageForFile(file)));
        if (message) console.log(new SendMessage(message,148,68,1));
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
}