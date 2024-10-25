import { HTMLAttributes } from "react";

export type TaskItem = {
    card_id?: string;
    task_id?: string;
    description?: string;
    percent?: number;
    close_modal?: any;
    taskFilter?: any;
    listItem?: any;
    resetTask?: any;
    taskCheckReset?: any;
  }
  
 export type FormTextAreaDefaultProps = HTMLAttributes<HTMLInputElement> &{
    disabledForm?: boolean;
    task_description: string;
    onChange?: (value: string) => void;
    buttonTextOpen?: string;
    buttonTextClosed?: string;
    buttonClasses?: string;
    textAreaClasses?: string;
    rows?: number;
    cols?: number;
  }
  
 export type SubTask = {
    id: number;
    description: string;
    check: boolean;
    task_id: number;
  }
  
 export type SubTasksWithCheckboxProps = {
    subTasks: SubTask[];
    taskCheckReset?: any;
    onTaskChange: (id: number, checked: boolean) => void;
  }