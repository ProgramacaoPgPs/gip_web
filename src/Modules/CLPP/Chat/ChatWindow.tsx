import React, { useEffect, useState } from "react";
import { useMyContext } from "../../../Context/MainContext";
import { useWebSocket } from "../../../Context/WsContext";
import { tChatWindow } from "../../../types/types";
import StructureModal from "../../../Components/CustomModal";
import { Connection } from "../../../Connection/Connection";
import AttachmentFile from "../../../Components/AttachmentFile";
import ChatControls from "./ChatControls";
import ChatLoading from "./ChatLoading";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";

export default function ChatWindow(props: tChatWindow): JSX.Element {
    const { messagesContainerRef, previousScrollHeight, listMessage, page, pageLimit } = useWebSocket();

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - previousScrollHeight.current;
        }
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
