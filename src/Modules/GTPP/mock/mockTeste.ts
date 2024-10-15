export const listPath = [
    { page: '/home', children: 'Home' },
];


export const fieldsetsRegister = [
    {
        attributes: { id: '', className: 'w-100', },
        item: {
            label: 'Digite o nome da tarefa',
            mandatory: true,
            captureValue: {
                type: 'text',
                placeholder: 'Digite a taréfa',
                name: 'description',
                className: 'form-control',
                required: true,
                id: ''
            },
        },
    },{
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
    },{
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
    },{
        attributes: { id: '', className: 'w-100', },
        item: {
            label: 'Status',
            mandatory: true,
            captureValue: {
                type: 'select',
                placeholder: '',
                name: 'date_initial',
                className: 'form-control',
                required: true,
                id: '',
                options: [
                  {value: '', label: 'selectione'},
                  {value: '1', label: 'baixo'},
                  {value: '2', label: 'médio'},
                  {value: '3', label: 'alto'},
                ]
            },
        },
    }
];