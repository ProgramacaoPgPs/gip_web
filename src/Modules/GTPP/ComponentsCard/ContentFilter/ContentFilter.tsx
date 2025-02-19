import React from 'react';
// import './columnTaskState.css';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFilters } from '../../mock/mockTeste';

type TaskStateFilterProps = {}

const ContentFilter: React.FC<TaskStateFilterProps> = () => {
    // Campo de pesquisa
    const handleFilterSearch = (value: string) => {
        console.log(value);
    }

    const handleFilterDateInitialFinal = (value: Date) => {
        console.log(value);
    }

    // Campo de prioridades
    const handleFilterPriority = (value: string) => {
        console.log(value);
    }


    // Campo de Data de inicio
    const handleFilterDateInitial = (value: Date) => {
        console.log(value);
    }

    // Campo de final final
    const handleFilterDateFinalFinal = (value: Date) => {
        console.log(value);
    }


    // Campo da Data final
    const handleFilterDateFinal = (value: Date) => {
        console.log(value);
    }


    // Campo do status
    const handleFilterStatus = (value: Number) => {
        console.log(value);
    }


    // Campo de valores de prioridades
    const optionsFilterPriority = [
        {value: '1', label: 'Alta'},
        {value: '2', label: 'Média'},
        {value: '3', label: 'Baixa'},
    ];

    // Campo de valores de Radio
    const optionsFilterStatus = [
        {value: "1", label: '', titleRadio: 'Colaborador'},
        {value: "2", label: '', titleRadio: 'Minhas tarefas'},
    ];

    // Campo de valores de Radio
    const optionsFilterStatus2 = [
        {value: "1", label: '', titleRadio: 'Colaborador'},
        {value: "2", label: '', titleRadio: 'Minhas tarefas'},
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
        optionsFilterStatus,
        optionsFilterStatus2
    );

    return (
        <div>
            <CustomForm
                classButton='btn btn-success'
                onSubmit={() => console.log('teste')}
                titleButton={"Confirmar"}
                // @ts-ignore
                fieldsets={fieldsetsValues}
            />
        </div>
    );
};


export default ContentFilter;