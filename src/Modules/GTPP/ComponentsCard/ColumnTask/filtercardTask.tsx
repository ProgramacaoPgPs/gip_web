import { ITask } from "../../../../Interface/iGIPP";

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

