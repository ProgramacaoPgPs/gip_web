import { ITask } from "../../../../Interface/iGIPP";

export const filterTasks2 = (
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

export class ClassTaskFilter {
    constructor(
        private tasks: ITask[],
        private searchTerm: string = "",
        private rangeDateInitial: string = "",
        private rangeDateInitialFinal: string = "",
        private rangeDateFinal: string = "",
        private rangeDateFinalFinal: string = "",
        private priority: number,
        private IdentityDataUser: number,
        private user_id: any
    ) {}

    public filterTasks(): ITask[] {
        return this.tasks.filter(task => 
            (!this.searchTerm || task.description.toUpperCase().includes(this.searchTerm.toUpperCase())) &&
            (this.priority === 3 || task.priority === this.priority) &&
            (this.IdentityDataUser === 3 || task.user_id === this.user_id.id) &&
            this.filterByDate(task)
        );
    }
    private filterByDate(task: ITask): boolean {
        return (this.rangeDateInitial && this.rangeDateInitialFinal) 
            ? task.initial_date >= this.rangeDateInitial && task.final_date <= this.rangeDateInitialFinal 
            : (this.rangeDateFinal && this.rangeDateFinalFinal) 
            ? task.final_date >= this.rangeDateFinal && task.final_date <= this.rangeDateFinalFinal 
            : true;
    }
}

