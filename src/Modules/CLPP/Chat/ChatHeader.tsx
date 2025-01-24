import { useWebSocket } from "../../../Context/WsContext";

export default function ChatHeader(props: { onClose: (value?: any) => void }) {
    const { changeChat } = useWebSocket();
    return (
        <header className="my-2 text-end">
            <i onClick={() => {
                changeChat();
                props.onClose();
            }} className="fa-solid fa-rotate-left text-danger text-end"> Voltar</i>
        </header>
    )
}