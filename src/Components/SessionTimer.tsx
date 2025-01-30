import { useState, useEffect } from "react";
import { isTokenExpired } from "../Util/Util";
import { useMyContext } from "../Context/MainContext";

interface SessionTimerProps {
    expirationDate: string;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ expirationDate }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { loadDetailsToken } = useMyContext();
    useEffect(() => {
        if (!expirationDate) {
            logout();
            return;
        }

        const expirationTime = new Date(expirationDate).getTime();
        const currentTime = Date.now();
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
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="d-none d-md-flex flex-column bg-dark position-fixed bottom-0 rounded p-1 d-flex mx-2 my-4">
            <p className="text-white m-0">Token:</p>
            <div className="d-flex gap-2">
                <label className="text-white">{formatTime(timeLeft)}</label>
                <i className="d-flex align-items-center fa-solid fa-clock text-white"></i>
            </div>
        </div>
    );
};

export default SessionTimer;
