import { ITask } from "../../../../Interface/iGIPP";

export const filterTasks = ( tasks: ITask[], searchTerm: String = "", rangeDateInitial: String = "", rangeDateInitialFinal: String = "", rangeDateFinal: String = "", rangeDateFinalFinal: String = "", priority: Number, IdentityDataUser: Number, user_id: any) => {
    if (!searchTerm && !rangeDateInitial && !rangeDateFinal && priority === 3 && IdentityDataUser === 3 ) return tasks;
    const filter = tasks
        .filter(task => searchTask(task, searchTerm))
        .filter(task => priorityTask(task, priority))
        .filter(task => userIndentity(task, IdentityDataUser, user_id))
        .filter(task => dateInitial(task, rangeDateInitial, rangeDateInitialFinal, rangeDateFinal, rangeDateFinalFinal))
        .filter(task => dateFinal(task, rangeDateFinal, rangeDateFinalFinal, rangeDateInitial, rangeDateInitialFinal))
        return filter;
};

// data inicial
function dateInitial(task: ITask, rangeDateInitial:String, rangeDateInitialFinal:String, rangeDateFinal:String, rangeDateFinalFinal:String) {
    return (rangeDateInitialFinal && rangeDateInitial) ?
                (rangeDateFinal && rangeDateFinalFinal) ? 
                    task.initial_date  >= rangeDateFinal && task.final_date <= rangeDateFinalFinal :
                    task.initial_date >= rangeDateInitial && task.final_date <=rangeDateInitialFinal : 
                    task;
}

// Data final
function dateFinal(task: ITask, rangeDateFinal:String, rangeDateFinalFinal:String, rangeDateInitial:String, rangeDateInitialFinal:String) {
    return (rangeDateFinal && rangeDateFinalFinal) ?
                (rangeDateInitial && rangeDateInitialFinal) ? 
                    task.initial_date >= rangeDateInitial && task.initial_date <=rangeDateInitialFinal :
                    task.final_date >= rangeDateFinal && task.final_date <= rangeDateFinalFinal : 
                    task;
}


// Identificando as tarefas de colaboração e se é de usuário.
function userIndentity(task:ITask, IdentityDataUser: Number, user_id: {id: Number}) {
    return IdentityDataUser === 3 ? task : IdentityDataUser === 2 ? task.user_id !== user_id.id : task.user_id === user_id.id;
}

// priopridade da tarefa
function priorityTask(task: ITask, priority:Number) {
    return priority === 3 || task.priority === priority;
}


// pesquisando a tarefa!
function searchTask(task: ITask, searchTerm: String) {
    return !searchTerm || task.description.toUpperCase().includes(searchTerm.toUpperCase())
}

