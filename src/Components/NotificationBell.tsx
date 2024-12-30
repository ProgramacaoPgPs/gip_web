import React, { useState, useEffect } from "react";
import { CustomNotification } from "../Interface/iGIPP";
import { useWebSocket } from "../Modules/GTPP/Context/GtppWsContext";


export default function NotificationBell(): JSX.Element {
    const { notifications,setNotifications } = useWebSocket();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        alert(
            `Mensagens:\n${notifications
                .map((n) => `- ${n.message}`)
                .join("\n") || "Sem notificações"}`
        );
        setNotifications([]);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center position-relative"
            style={{ width: "fit-content", cursor: "pointer" }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ícone do Sino */}
            <i
                className={`fa-solid fa-bell`}
                style={{
                    fontSize: "calc(1.5rem + 1vw)", // Responsivo: aumenta conforme o tamanho da tela
                    color: notifications.length > 0 ? "red" : "gray",
                    transition: "color 0.3s",
                }}
            ></i>

            {/* Contador de Notificações */}
            {notifications.length > 0 && (
                <span
                    className="position-absolute top-0 end-0 translate-middle badge rounded-pill"
                    style={{
                        backgroundColor: isHovered ? "#ffc107" : "#dc3545",
                        color: "white",
                        fontSize: "calc(0.6rem + 0.2vw)", // Responsivo
                        minWidth: "20px",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {notifications.length}
                </span>
            )}
        </div>
    );
};


