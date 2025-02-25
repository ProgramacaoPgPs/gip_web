import React from 'react';
// import './columnTaskState.css';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFilters } from '../../mock/mockTeste';
type TaskStateFilterProps = {
    filter: Function[] | any;
    onAction?:() => void;
}

const ContentFilter: React.FC<TaskStateFilterProps>= ({ filter, onAction }) => {
    const [
        handleFilterSearch,
        handleFilterDateInitial,
        handleFilterDateInitialFinal,
        handleFilterPriority,
        handleFilterDateFinal,
        handleFilterDateFinalFinal,
        handleFilterStatus,
    ] = filter;

    // Campo de valores de prioridades
    const optionsFilterPriority = [
        {value: '3', label: 'Todas as propriedades'},
        {value: '2', label: 'Alta'},
        {value: '1', label: 'Média'},
        {value: '0', label: 'Baixa'},
    ];

    // Campo de valores de Radio
    const optionsFilterStatus = [
        {value: '3', label: 'Todos status'},
        {value: '2', label: 'Colaboradores'},
        {value: '1', label: 'Minhas Tarefas'},
    ];

    // alocador de valores.
    const fieldsetsValues = fildsetsFilters(
        handleFilterSearch,
        optionsFilterPriority,
        handleFilterPriority,
        handleFilterDateInitial,
        handleFilterDateInitialFinal,
        handleFilterDateFinal,
        handleFilterDateFinalFinal,
        handleFilterStatus,
        optionsFilterStatus
    );

    return (
        <div>
            <CustomForm
                onAction={onAction}
                classButton='btn btn-danger'
                titleButton='Re-carregar'
                typeButton='submit'
                needButton={true}
                fieldsets={fieldsetsValues}
            />
        </div>
    );
};


export default ContentFilter;