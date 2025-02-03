export const listPath = [
    { page: '/home', children: 'Home', icon: 'fa fa-home', },
    {
        page: '/', children: 'Sair', icon: 'fa fa-sign-out', actionAdd: () => {
            localStorage.removeItem("tokenGIPP");
            localStorage.removeItem("codUserGIPP");
        }
    }
];



export const fieldsetsRegister = (
    optionsCompay: [{ value: string, label: string }],
    onCompany: (id: number) => void,
    optionsDepartament: [{ value: string, label: string }],
    onDepartament:(id: number) => void,
    optionsStore: [{ value: string, label: string }]
) => [
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
                        { value: '', label: 'Selecione' },
                        { value: '0', label: 'Baixa' },
                        { value: '1', label: 'Média' },
                        { value: '2', label: 'Alta' },
                    ]
                },
            },
        }, {
            attributes: { className: 'w-100', },
            item: {
                label: 'Companhias',
                mandatory: true,
                captureValue: {
                    type: 'select',
                    onChange: (e: any) => { onCompany(parseInt(e.target.value)) },
                    placeholder: '',
                    name: 'company_id',
                    className: 'form-control',
                    required: true,
                    id: '',
                    options: optionsCompay
                },
            }
        }, {
            attributes: { className: 'w-100', },
            item: {
                label: 'Lojas',
                mandatory: true,
                captureValue: {
                    type: 'select',
                    onChange: (e: any) => { onDepartament(parseInt(e.target.value)) },
                    placeholder: '',
                    name: 'shop_id',
                    className: 'form-control',
                    required: true,
                    id: '',
                    options: optionsDepartament
                },
            }
        }, {
            attributes: { className: 'w-100', },
            item: {
                label: 'Departamentos',
                mandatory: true,
                captureValue: {
                    type: 'select',
                    placeholder: '',
                    name: 'depart_id',
                    className: 'form-control',
                    required: true,
                    id: '',
                    options: optionsStore
                },
            }
        }
    ];