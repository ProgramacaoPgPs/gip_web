import React, { useEffect, useState } from 'react';
// import './columnTaskState.css';
import CustomForm from '../../../../Components/CustomForm';
import { fildsetsFilters } from '../../mock/mockTeste';
import { fetchDataFull } from '../../../../Util/Util';

type TaskStateFilterProps = {}

const ContentFilter: React.FC<TaskStateFilterProps>= () => {

    const [data, setData] = useState<JSX.Element | any>({
        method: "GET",
        pathFile:"GTPP/Task.php",
        appId: "",
        urlComplement: "",
        params: "",
        expection: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const dataAsync = await fetchDataFull(data);
        }
        fetchData();
    }, [])

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
        {value: "1", label: '', titleRadio: 'Colaboradores'},
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
                onSubmit={() => {
                }}
                titleButton={"Confirmar"}
                // @ts-ignore
                fieldsets={fieldsetsValues}
            />
        </div>
    );
};


export default ContentFilter;