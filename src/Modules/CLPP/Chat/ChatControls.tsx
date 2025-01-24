import { useState } from "react";
import AttachmentFile from "../../../Components/AttachmentFile";

export default function ChatControls() {
    const [attachmentFile, setAttachmentFile] = useState<string>('');
    return (
        <div className="d-flex align-items-center rounded p-2">
            <button className="btn btn-success fa-solid fa-paper-plane col-2" title="Enviar mensagem"></button>
            <textarea rows={2} style={{ resize: "none" }} className="mx-2 col-8 border rounded" />
            <AttachmentFile reset={attachmentFile ? false : true} file={0} onClose={(value) => setAttachmentFile(value)} />
        </div>
    )
}