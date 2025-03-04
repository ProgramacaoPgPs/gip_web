import { ITask } from "../../../../Interface/iGIPP";

export const filterTasks = ( tasks: ITask[], searchTerm: string = "", rangeDateInitial: string = "", rangeDateInitialFinal: string = "", rangeDateFinal: string = "", rangeDateFinalFinal: string = "", priority: Number, IdentityDataUser: Number, user_id: any) => {
    if (!searchTerm && !rangeDateInitial && !rangeDateFinal && priority === 3 && IdentityDataUser === 3 ) return tasks;
    const filter = tasks
        .filter(task => !searchTerm || task.description.toUpperCase().includes(searchTerm.toUpperCase()))
        .filter(task => priority === 3 || task.priority === priority)
        .filter(task => IdentityDataUser === 3 ? task : IdentityDataUser === 2 ? task.user_id !== user_id.id : task.user_id === user_id.id)
        .filter(task => (rangeDateInitialFinal && rangeDateInitial) ?
                   (rangeDateFinal && rangeDateFinalFinal) ? 
                        task.initial_date  >= rangeDateFinal && task.final_date <= rangeDateFinalFinal :
                        task.initial_date >= rangeDateInitial && task.final_date <=rangeDateInitialFinal : 
                        task)
        .filter(task => (rangeDateFinal && rangeDateFinalFinal) ?
                   (rangeDateInitial && rangeDateInitialFinal) ? 
                        task.initial_date >= rangeDateInitial && task.initial_date <=rangeDateInitialFinal :
                        task.final_date >= rangeDateFinal && task.final_date <= rangeDateFinalFinal : task)
        return filter;
};