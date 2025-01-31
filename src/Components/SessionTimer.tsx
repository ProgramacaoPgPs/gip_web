import { useState, useEffect } from "react";
import { isTokenExpired } from "../Util/Util";
import { useMyContext } from "../Context/MainContext";

interface SessionTimerProps {
    expirationDate: string;
    loggedAt: string;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ expirationDate, loggedAt }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { loadDetailsToken } = useMyContext();
    useEffect(() => {
        if (!expirationDate) {
            logout();
            return;
        }

        const expirationTime = new Date(expirationDate).getTime();
        // const currentTime = Date.now();
        const currentTime = new Date(loggedAt).getTime();
        let remainingTime = expirationTime - currentTime;


        if (remainingTime <= 0 || isTokenExpired(expirationDate)) {
            logout();
            return;
        }

        setTimeLeft(remainingTime);

        const interval = setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime <= 0) {
                logout();
                clearInterval(interval);
            } else {
                setTimeLeft(remainingTime);
            }
        }, 1000);

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar
    }, [expirationDate]);

    const logout = async () => {
        await loadDetailsToken();
    };

    // Converte milissegundos para minutos e segundos
    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / 3600000); // Converte ms para horas
        const minutes = Math.floor((ms % 3600000) / 60000); // Pega os minutos restantes
        const seconds = Math.floor((ms % 60000) / 1000); // Pega os segundos restantes

        // Formata para sempre ter dois dígitos (ex: 01:05:09)
        const format = (num: number) => num.toString().padStart(2, "0");

        return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
    };

    return (
        <div style={{ width: "96px" }} className="d-flex bg-secondary flex-column position-fixed bottom-0 rounded p-1 d-flex mx-0 my-4 ">
            <div className="d-flex justify-content-between  w-100">
                <span className="text-white h6 m-0">{formatTime(timeLeft)}</span>
                <i className="d-flex align-items-center fa-solid fa-clock text-white h6 m-0"></i>
            </div>
        </div>
    );
};

export default SessionTimer;
