export const listPath = [
    { page: '/home', children: 'Home', icon: 'fa fa-home', },
    {
        page: '/', children: 'Sair', icon: 'fa fa-sign-out', actionAdd: () => {
            localStorage.removeItem("tokenGIPP");
            localStorage.removeItem("codUserGIPP");
        }
    }
];



export const fieldsetsRegister = [
    {
        attributes: { id: '', className: 'w-100', },
        item: {
            label: 'Digite o nome da tarefa',
            mandatory: true,
            captureValue: {
                type: 'text',
                placeholder: 'Digite a tarefa',
                name: 'description',
                className: 'form-control',
                required: true,
                id: ''
            },
        },
    }, {
        attributes: { id: '', className: 'w-100', },
        item: {
            label: 'Data Inicial',
            mandatory: true,
            captureValue: {
                type: 'date',
                placeholder: '',
                name: 'initial_date',
                className: 'form-control',
                required: true,
                id: ''
            },
        },
    }, {
        attributes: { id: '', className: 'w-100', },
        item: {
            label: 'Data Final',
            mandatory: true,
            captureValue: {
                type: 'date',
                placeholder: '',
                name: 'final_date',
                className: 'form-control',
                required: true,
                id: ''
            },
        },
    }, {
        attributes: { id: '', className: 'w-100', },
        item: {
            label: 'Prioridade',
            mandatory: true,
            captureValue: {
                type: 'select',
                placeholder: '',
                name: 'priority',
                className: 'form-control',
                required: true,
                id: '',
                options: [
                    { value: '', label: 'selectione' },
                    { value: '0', label: 'Baixa' },
                    { value: '1', label: 'Média' },
                    { value: '2', label: 'Alta' },
                ]
            },
        },
    }
];