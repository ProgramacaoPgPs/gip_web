import React, { HTMLAttributes, useState } from 'react';
import './columnTaskState.css';
import ContentFilter from '../ContentFilter/ContentFilter';
import MinimalFilterModel from '../MinimalFilterModel/MinimalFilterModel';
import CardTask from '../CardTask/CardTask';
import { useWebSocket } from '../../Context/GtppWsContext';
import { ITask } from '../../../../Interface/iGIPP';
import { useMyContext } from '../../../../Context/MainContext';
// import { convertdate } from '../../../../Util/Util';
import { DateConverter } from '../../Class/DataConvert';

type ColumnPropsTaskState = HTMLAttributes<HTMLDivElement> & {
    title: string;
    bg_color: string;
    buttonIcon?: string;
    buttonHeader?: JSX.Element;
    content_body?: any;
};

type ColumnPropsTaskStateBoolean = {
    is_first_column?: boolean;
}

type ColumnPropsTaskStateFunction = {
    exportCsv?: () => void;
    exportPdf?: () => void;
    addTask?: () => void;
}

type TaskFilter = {
    search: string;
    prioritySearch: number;
    dateInitialSearch: string;
    dateInitialFinalSearch: string;
    dateFinalSearch: string;
    dateFinalFinalSearch: string;
    filterCollaboration: boolean;
    statusSearch: boolean;
}

const ColumnTaskState: React.FC<ColumnPropsTaskState & ColumnPropsTaskStateFunction & ColumnPropsTaskStateBoolean> = (props) => {
    const { userLog } = useMyContext();
    const { exportCsv, exportPdf, addTask, is_first_column, ...rest } = props;
    const [filterHandler, setFilterHandler] = useState(false);
    const { setTask, setTaskPercent, setOpenCardDefault, setNotifications, notifications } = useWebSocket();

    const [filterData, setFilterData] = useState<TaskFilter>({
        search: "",
        prioritySearch: 3,
        dateInitialSearch: "",
        dateInitialFinalSearch: "",
        dateFinalSearch: "",
        dateFinalFinalSearch: "",
        filterCollaboration: false,
        statusSearch: false,
    });
    
    const handleFilterForContentBody = () => setFilterHandler(!filterHandler);
    
    const filterTasks = (
        tasks: ITask[],
        searchTerm: string = "",
        rangeDateInitial: string = "",
        rangeDateInitialFinal: string = "",
        rangeDateFinal: string = "",
        rangeDateFinalFinal: string = "",
        priority: number = 3,
        status: boolean = false,
        collaborate: boolean = false
    ) => {
        if (!searchTerm && !rangeDateInitial && !rangeDateFinal && priority === 3 && !status && !collaborate) return tasks;

        return tasks
            .filter(task => !searchTerm || task.description.toUpperCase().includes(searchTerm.toUpperCase()))
            .filter(task => priority === 3 || task.priority === priority)
            .filter(task => !status || userLog.id === task.user_id)
            .filter(task => !collaborate || task.user_id !== userLog.id)
            .filter(task => {
                if (!rangeDateInitial || !rangeDateInitialFinal) return true;
                let rangeStart = DateConverter.formatDate(rangeDateInitial);
                let rangeFinal = DateConverter.formatDate(rangeDateInitialFinal);
                let taskDate = DateConverter.formatDate(task.final_date);
                if (!rangeStart || !rangeFinal || !taskDate) {
                    console.warn("Erro ao converter datas:", { rangeStart, rangeFinal, taskDate });
                    return true;
                }
                return taskDate >= rangeStart && taskDate <= rangeFinal;
            })
            .filter(task => {
                if (!rangeDateInitial || !rangeDateInitialFinal) return true;
                let rangeStart = DateConverter.formatDate(rangeDateFinal);
                let rangeFinal = DateConverter.formatDate(rangeDateFinalFinal);
                let taskDate = DateConverter.formatDate(task.final_date);
                if (!rangeStart || !rangeFinal || !taskDate) {
                    console.warn("Erro ao converter datas:", { rangeStart, rangeFinal, taskDate });
                    return true;
                }
                return taskDate >= rangeStart && taskDate <= rangeFinal;
            })
    };

    return (
        <div style={{ display:"flex",flexDirection:"column",height: '100%', marginLeft: '1rem' }} {...rest}>
            <div className={`columnTaskState-title  rounded-top d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center`} style={{ background: `#${props.bg_color}` }}>
                <div className='d-flex justify-content-between align-items-center w-100'>
                    <div><h1 className="rounded p-1">{props.title}</h1></div>
                    <div className='w-100 d-flex justify-content-end'>
                        <button onClick={handleFilterForContentBody} className="btn font-filter-button">filtro</button>
                    </div>
                    <div style={{position: 'relative'}}>      
                        {filterHandler && (
                            <MinimalFilterModel>
                            <ContentFilter 
                                filter={[
                                    (value: string) => setFilterData(x => ({ ...x, search: value })),
                                    (value: string) => setFilterData(x => ({ ...x, dateInitialSearch: value })),
                                    (value: string) => setFilterData(x => ({ ...x, dateInitialFinalSearch: value })),
                                    (value: number) => setFilterData(x => ({ ...x, prioritySearch: value })),
                                    (value: string) => setFilterData(x => ({ ...x, dateFinalSearch: value })),
                                    (value: string) => setFilterData(x => ({ ...x, dateFinalFinalSearch: value })),
                                    (value: boolean) => setFilterData(x => ({ ...x, filterCollaboration: value })),
                                    (value: boolean) => setFilterData(x => ({ ...x, statusSearch: !value })),
                                ]}
                            />
                            </MinimalFilterModel>
                        )}
                    </div>
                </div>
            </div>
            <div className="columnTaskState-container">
                <div className="columnTaskState-body">
                    {/* {props.content_body} */}
                      <div className="task-cards-container">
                        {/* O filtro é que vai filtrar fato.  */}
                        {filterTasks(
                            props.content_body, 
                            filterData.search, 
                            filterData.dateInitialSearch, 
                            filterData.dateInitialFinalSearch, 
                            filterData.dateFinalSearch,
                            filterData.dateFinalFinalSearch,
                            filterData.prioritySearch,
                            filterData.statusSearch,
                            filterData.filterCollaboration
                        )?.map((task:any, _: number) => {
                        return (
                            <CardTask
                            key={`simple_card_task_${task.id}`}
                            id={task.id}
                            initial_date={task.initial_date}
                            final_date={task.final_date}
                            title_card={task.description}
                            priority_card={task.priority}
                            percent={task.percent}
                            create_by={task.user_id}
                            onClick={() => {
                                setTask(task);
                                setTaskPercent(task.percent);
                                setOpenCardDefault(true);
                                setNotifications(
                                    notifications.filter((item) => item.task_id !== task.id)
                                );
                            }}
                        />)
                        })}
                    </div>
                </div>
            </div>
            <div className={`columnTaskState-title rounded-bottom d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center justify-content-around`} style={{ background: `#${props.bg_color}` }}>
                <i className='fa save cursor-pointer text-white fa-file-csv' onClick={exportCsv} />
                <i className='fa file cursor-pointer text-white fa-file-pdf' onClick={exportPdf} />
                {is_first_column && <i className='fa add cursor-pointer text-white fa-circle-plus' onClick={addTask} />}
            </div>
        </div>
    );
};

export default ColumnTaskState;
