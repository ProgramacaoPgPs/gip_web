import { useEffect, useState } from "react";
import { useMyContext } from "../../../Context/MainContext";
import { useWebSocket } from "../../../Context/WsContext";
import { tWindowsMessage } from "../../../types/types";
import StructureModal from "../../../Components/CustomModal";
import { Connection } from "../../../Connection/Connection";
import AttachmentFile from "../../../Components/AttachmentFile";
const logo = require("../../../Assets/Image/peg_pese_loading.png");

export default function WindowsMessage(props: tWindowsMessage): JSX.Element {
    const [attachmentFile, setAttachmentFile] = useState<string>('');
    const { userLog } = useMyContext();
    const { changeChat, handleScroll, messagesContainerRef, previousScrollHeight, listMessage, page, pageLimit, msgLoad } = useWebSocket();
    
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - previousScrollHeight.current;
        }
    }, [listMessage, page]);

    return (
        <div id='divWindowsMessage' className='d-flex flex-column h-100 w-100'>
            {msgLoad && (
                <StructureModal className="StructureModal ModalBgWhite">
                    <div className="d-flex flex-column align-items-center">
                        <img className="spinner-grow-img" src={logo} alt="Logo Peg Pese" />
                    </div>
                </StructureModal>
            )}
            <i onClick={() => {
                changeChat();
                props.onClose();
            }} className="fa-solid fa-rotate-left text-end text-danger my-2"> Voltar</i>
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className='d-flex flex-column overflow-auto h-100 w-100 p-2'
            >
                {listMessage.map((item, index) => (
                    <div key={`message_${index}`} className={`d-flex flex-column my-2 w-100 ${item.id_user === userLog.id ? 'text-end align-items-end ' + `${item.type <= 2 && 'messageSent'} ` : 'text-start align-items-start ' + `${item.type <= 2 && 'messageReceived'}`}`}>
                        <div className="p-2 rounded">{controllerMessage(item)}</div>
                        {
                            item.id_user === userLog.id && <span className={`fa-solid fa-check-double notifyMessage my-2 ${item.notification == 1 ? 'text-secundary' : 'text-primary'}`}></span>
                        }
                    </div>
                ))}
                <div />
            </div>
            <div className="d-flex align-items-center rounded p-2">
                <button className="btn btn-success fa-solid fa-paper-plane col-2" title="Enviar mensagem"></button>
                <textarea rows={2} style={{ resize: "none" }} className="mx-2 col-8 border rounded" />
                <AttachmentFile reset={attachmentFile ? false : true} file={0} onClose={(value) => setAttachmentFile(value)}/>
            </div>
        </div>
    );

    function controllerMessage(message: any): any {
        let response;
        if (parseInt(message.type) === 1) {
            response = message.message;
        } else if (parseInt(message.type) === 2) {
            response = <a href={`http://gigpp.com.br:72/GLOBAL/Controller/CLPP/uploads/${message.message}`} target='_blank'><img alt="Mensagem no formato de imagem." className='fileStyle' src={`http://gigpp.com.br:72/GLOBAL/Controller/CLPP/uploads/${message.message}`} /></a>;
        } else {
            response = iconFileMessage(message);
        }
        return response;
    }

    function iconFileMessage(message: any) {
        let style: string = '';
        let icon: string = '';
        if (parseInt(message.type) === 3) {
            style = "text-danger h1";
            icon = "fa-solid fa-file-pdf";
        } else if (parseInt(message.type) === 4) {
            style = "text-success";
            icon = "fa-solid fa-file-code"
        }
        return componentFile(message, style, icon);
    }

    function componentFile(message: any, style: string, icon: string): JSX.Element {
        return (
            <div id='divMessageFile' className="d-flex flex-column fileStyle bg-white p-2 rounded ">
                <a href={`http://gigpp.com.br:72/GLOBAL/Controller/CLPP/uploads/${message.message}`} target='_blank'>
                    <i className={`${style} ${icon}`} />
                </a>
                <div className="d-flex justify-content-end my-2" onClick={async () => {
                    try {
                        const conn = new Connection('18');
                        const req: { error: boolean, fileName: string, fileContent: string, message?: 'string' } = await conn.get(`&file=${message.message}`, 'GIPP/LoginGipp.php') || { error: true, fileName: '', fileContent: '' };
                        if (req.error) throw new Error(req.message);
                        downloadFile(req);
                    } catch (error) {
                        alert(error)
                    }
                }}>
                    <i className='text-dark fa-solid fa-download' />
                </div>
            </div>
        );
    }
    async function downloadFile(reqFile: { error: boolean, fileName: string, fileContent: string }) {
        const binaryString = atob(reqFile.fileContent);
        const byteNumbers = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteNumbers[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: 'application/octet-stream' });

        // Cria um link temporário para download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = reqFile.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
}