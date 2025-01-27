import { useEffect } from "react";
import { useWebSocket } from "../../../Context/WsContext";
import { tChatWindow } from "../../../types/types";
import ChatControls from "./ChatControls";
import ChatLoading from "./ChatLoading";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";

export default function ChatWindow(props: tChatWindow): JSX.Element {
    const { messagesContainerRef, previousScrollHeight, listMessage, page } = useWebSocket();

    useEffect(() => {
        setTimeout(() => {
            if (messagesContainerRef.current) {
                const container = messagesContainerRef.current;
                container.scrollTop = container.scrollHeight - container.clientHeight;
            }
        }, 100);
    }, [listMessage, page]);

    return (
        <div id='divChatWindow' className='d-flex flex-column h-100 w-100'>
            <ChatLoading />
            <ChatHeader onClose={props.onClose} />
            <ChatMessages />
            <ChatControls />
        </div>
    );
}
