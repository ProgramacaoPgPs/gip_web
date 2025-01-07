import React from "react";
import "./CardTask.css"; // Importando o estilo
import { convertdate } from "../../../../Util/Util";
import NotificationBell from "../../../../Components/NotificationBell";
import ProgressBar from "../Modal/Progressbar";


type CardTaskProps = {
    title_card?: string;
    priority_card?: number;
    initial_date?: string;
    final_date?: string;
    percent?:number;
}

type CardTaskAllPropsHTML = React.HTMLAttributes<HTMLDivElement> & {}

type PriorityCardResult = {
    color?: string;
    title?: string;
}

const CardTask: React.FC<CardTaskProps & CardTaskAllPropsHTML> = (props) => {
    const colorPriorityCard = (numberKey: Number | string = 0): PriorityCardResult => {
        switch (numberKey) {
            case 0: return { color: 'primary', title: 'baixa' }
            case 1: return { color: 'warning', title: 'media' }
            case 2: return { color: 'danger', title: 'Alta' }
            default: return { color: '', title: '' }
        }
    }

    let { color, title } = colorPriorityCard(props.priority_card);

    return (
        <div {...props} className={`card-task-container modal-container modal-Xsmall cursor-pointer p-2`}>
            <React.Fragment>
                <div className="card-task-header d-flex justify-content-between col-12 gap-3">
                    {/* Aqui vou colocar o titulo e o dropdown */}
                    <div className="d-flex justify-content-between col-12 mb-2">
                        <h3 className="fw-bold card-text">{props.title_card || "Tarefa sem nome"}</h3>
                        <NotificationBell idTask={parseInt(props.id || '0')} />
                    </div>
                </div>
                <div className="card-task-body">
                    {/* Aqui vou montar aonde vai ficar as datas e uma breve descrição */}
                    <div className="card-font-large">
                        <div className="d-flex justify-content-between flex-wrap">
                            <div><span className="fw-bold">Data Inicial:</span></div>
                            <div><p>{convertdate(props.initial_date || "2024-09-20")}</p></div>
                        </div>
                        <div className="d-flex justify-content-between flex-wrap">
                            <div><span className="fw-bold">Data Final:</span></div>
                            <div><p>{convertdate(props.final_date || "2024-09-20")}</p></div>
                        </div>
                    </div>
                </div>
                <div className="card-task-footer d-flex justify-content-between">
                    <div className="flex-grow-1">
                        <ProgressBar progressValue={props.percent || 0} colorBar="#00DDB2" />
                    </div>
                    {/* Aqui vou colocar seu niível e pessoas vinculadas */}
                    <div className={`card-task-priority bg-${color} text-white px-2 fw-bold rounded-4 font-small mt-2`}>{title}</div>
                </div>
            </React.Fragment>
        </div>
    );
};

export default CardTask;
