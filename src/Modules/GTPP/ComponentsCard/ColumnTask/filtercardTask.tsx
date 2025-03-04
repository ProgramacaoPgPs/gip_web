import { ITask } from "../../../../Interface/iGIPP";

export const filterTasks = (
    tasks: ITask[],
    searchTerm: string = "",
    rangeDateInitial: string = "",
    rangeDateInitialFinal: string = "",
    rangeDateFinal: string = "",
    rangeDateFinalFinal: string = "",
    priority: Number,
    IdentityDataUser: Number,
    user_id: any,
) => {
    if (!searchTerm && !rangeDateInitial && !rangeDateFinal && priority === 3 && IdentityDataUser === 3 ) return tasks; // && !IdentityDataUser

    const filter = tasks
        .filter(task => !searchTerm || task.description.toUpperCase().includes(searchTerm.toUpperCase()))
        .filter(task => priority === 3 || task.priority === priority)
        .filter(task => IdentityDataUser === 3 ? task : IdentityDataUser === 2 ? task.user_id !== user_id.id : task.user_id === user_id.id)
        .filter(task => {
            if(rangeDateInitialFinal && rangeDateInitial){
                if(rangeDateFinal && rangeDateFinalFinal) {
                    return task.initial_date  >= rangeDateFinal && task.final_date <= rangeDateFinalFinal;
                } 
                return task.initial_date >= rangeDateInitial && task.final_date <=rangeDateInitialFinal;
            }else {
                return task;
            }            
        })
        .filter(task => {
            if(rangeDateFinal && rangeDateFinalFinal) {
                if(rangeDateInitial && rangeDateInitialFinal) {
                    return task.initial_date >= rangeDateInitial && task.initial_date <=rangeDateInitialFinal;
                }
                return task.final_date >= rangeDateFinal && task.final_date <= rangeDateFinalFinal;
            } else {
                return task;
            }
        })
        return filter;
};