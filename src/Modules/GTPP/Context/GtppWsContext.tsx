import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { iGtppWsContextType, iTaskReq } from '../../../Interface/iGIPP';
import GtppWebSocket from './GtppWebSocket';
import { Connection } from '../../../Connection/Connection';
import { useMyContext } from '../../../Context/MainContext';

const GtppWsContext = createContext<iGtppWsContextType | undefined>(undefined);

export const EppWsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [task, setTask] = useState<any>({});
    const [taskDetails, setTaskDetails] = useState<iTaskReq>({});
    const [taskPercent, setTaskPercent] = useState<number>(0);

    const ws = useRef(new GtppWebSocket());
    const { userLog } = useMyContext();
    useEffect(() => {
        // Abre a coonexão com o websocket.
        ws.current.connect();
    }, []);

    // Garante a atualização do callback.
    useEffect(() => {
        ws.current.callbackOnMessage = callbackOnMessage;
    }, [task, taskDetails]);

    // Recupera as informações detalhadas da tarefa.
    useEffect(() => {
        task.id && getTaskInformations();
    }, [task]);

    async function getTaskInformations() {
        try {
            const connection = new Connection("18", true);
            const getTaskItem: any = await connection.get(
                `&id=${task.id}`,
                "GTPP/Task.php"
            );
            if (getTaskItem.error) throw new Error(getTaskItem.message);
            setTaskDetails(getTaskItem);
        } catch (error) {
            console.error("Erro ao obter as informações da tarefa:", error);
        }
    }

    async function callbackOnMessage(event: any) {
        let response = JSON.parse(event.data);
    
        if (response.error && response.message.includes("This user has been connected to another place")) {
            // Criar lógica para voltá-lo para login
        }

        //Aqui será feito a atualização das tarefas.
        if (!response.error && response.type == 2) {
            if (response.object) {
                if(response.object.isItemUp) {
                    itemUp(response.object);
                } else if(response.object.isStopAndToBackTask) {
                    // Aqui vamos indentificar pelo objeto qual dos objetos estmos tratando para evitar erros
                    if(response.object.taskState == 2) {
                    }
                    if(response.object.taskState == 4) {
                    }
                } else {
                    console.log("Sem retorno");
                }
            }
        }

        if (!response.error && response.type == 3) {
            if (response.object) {
                getDescription(response.object);
            }
        }
    }

    function itemUp(itemUp: any) {
        setTaskPercent(itemUp.percent);
        
        taskDetails.data?.task_item.forEach((element, index) => {
            if (taskDetails.data && element.id == itemUp.itemUp.id) taskDetails.data.task_item[index] = itemUp.itemUp;
        });

        setTaskDetails({ ...taskDetails });
    }

    function getDescription (description: any) {
        if(taskDetails.data){
            taskDetails.data.full_description = description.full_description;
            setTaskDetails({ ...taskDetails });
        }
    }

    // atualizando o estados dos components via WebSocket
    function getNewChangeOfStopAndBackToTask() {
        if(taskDetails.data){
            
        }
    }

    // atualizando o estados do usuário.
    function getNewUserList() {
        if(taskDetails.data){

        }
    }

    async function checkedItem(id: number, checked: boolean, idTask: any, taskLocal: any) {
        const connection = new Connection('18');
        let result: any = await connection.put({ check: checked, id: id, task_id: idTask }, "GTPP/TaskItem.php");
        taskLocal.check = checked;
        setTaskPercent(result.data?.percent);
        ws.current.informSending({
            "error": false,
            user_id: userLog.id,
            object: {
                description: taskLocal.check
                    ? "Um item foi marcado"
                    : "Um item foi desmarcado",
                percent: result.data?.percent,
                itemUp: taskLocal,
                isItemUp: true
            },
            task_id: taskLocal.task_id,
            type: 2,
        });
    }

    // aqui podemos trabalhar com a vinculação  das tarefas com as lojas e departamentos
    async function checkTaskComShoDepSub(task_id: number, company_id:number, shop_id:number, depart_id:number, taskLocal: any) {
       try {
        const connection = new Connection('18');
        let result = await connection.post({ task_id: task_id, company_id: company_id, shop_id: shop_id, depart_id: depart_id }, "GTPP/TaskComShoDepSub.php");
        console.log(result);
        ws.current.informSending({
            "error": false,
            user_id: userLog.id,
            object: {
                description: "A descrição completa da tarefa foi atualizada",
                task_id: task_id, 
                company_id: company_id, 
                shop_id: shop_id, 
                depart_id: depart_id
            },
            task_id: taskLocal,
            type: 2
        });
       } catch (error) {
        console.log(error);
       }
    }

    // Aqui podemos trabalhar de forma horizontal para atualizar a descrição da tarefa de ponta a ponta.
    async function changeDescription (description: string, id: number, descLocal: string) {
        try {
            const connection = new Connection('18');
            let result = await connection.put({ id: id, full_description: description }, "GTPP/Task.php");
            console.log(result);
            ws.current.informSending({
                "error": false,
                user_id: userLog.id,
                object: {
                    description: "A descrição completa da tarefa foi atualizada",
                    task_id: id,
                    full_description: description
                },
                task_id: descLocal,
                type: 3
            });
        } catch (error) {
            console.log("erro ao fazer o PUT em Task.php");
        }
    }

    async function stopAndToBackTask(taskId: number, resource: string | null, date: string | null, taskList: any) {
        try {
            const connection = new Connection("18", true);

            if(taskList.state_id == 4) {
                let result = await connection.put({task_id: taskId, reason: resource, days: date}, "GTPP/TaskState.php");
                console.log('response => ', result);

                ws.current.informSending({
                    "error": false,
                    user_id: userLog.id,
                    object: {
                        description: `Tarefa que estava parado está de volta!`,
                        task_id: taskId, 
                        reason: resource, 
                        days: date,
                        taskState: taskList.state_id, // pegando o id do estado da tarefa.
                    },
                    task_id: taskId,
                    type: 2
                });
            }

            if(taskList.state_id == 2) {
            // aquit temos que fazer um modal para pegar o porque o usuario está parando essa tarefa!
            let result = await connection.put({task_id: taskId, reason: resource, days: date}, "GTPP/TaskState.php");
            console.log('response => ', result);

                ws.current.informSending({
                    "error": false,
                    user_id: userLog.id,
                    object: {
                        description: "A tarefa que estava ativa foi parada!",
                        task_id: taskId, 
                        reason: resource, 
                        days: date, 
                        taskState: taskList.state_id, // pegando o id do estado da tarefa.
                    },
                    task_id: taskId,
                    type: 2
                });
            }

           

        } catch (error) {
            console.log("erro ao fazer o PUT em TaskState.php");
        }
    }

    function setUpdateUserAndAdd() {
        console.log("setUpdateUserAndAdd");
    }

    function clearGtppWsContext() {
        setTask({});
        setTaskDetails({});
    }


    return (
        <GtppWsContext.Provider value={{ taskDetails, task, taskPercent, setTaskPercent, setTask, clearGtppWsContext, checkedItem, checkTaskComShoDepSub, changeDescription, stopAndToBackTask }}>
            {children}
        </GtppWsContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(GtppWsContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};