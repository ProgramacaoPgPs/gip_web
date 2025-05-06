export interface Iurl {
    pageNumber: number;
    pageSize: number;
    statusCod: number;
    name?: string | '',
    codWorkSchedule?: string | '',
    branch?: number | "" ,
    costCenter?: number | "" ,
}

export type TSelectForm = {
    label: string;
    value: string;
}