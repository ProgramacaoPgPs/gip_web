export const fieldsetsCSDS = (
    optionsCompay: [{ value: string, label: string }],
    onCompany: (id: number) => void,
    optionsDepartament: [{ value: string, label: string }],
    onDepartament: (id: number) => void,
    optionsStore: [{ value: string, label: string }],
    onSubDepartament: (id: number) => void,
    optionsSubDepartament: [{ value: string, label: string }],
    selectSubDep: (id: number) => void,
    nameUser: string,
    setNameUser: (value: string) => void,
    selectCompany: string
) => [
        {
            attributes: { className: 'ps-2 col-3' },
            item: {
                label: 'Nome',
                captureValue: {
                    onChange: (e: any) => { setNameUser(e.target.value) },
                    type: 'text',
                    value: nameUser,
                    placeholder: 'Nome do usuário',
                    name: 'user_name',
                    className: 'form-control'
                }
            }
        }, {
            attributes: { className: 'ps-2 col-2 overflow-hidden', },
            item: {
                label: 'Companhias',
                captureValue: {
                    type: 'select',
                    value: selectCompany,
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
            attributes: { className: 'ps-2 col-2 overflow-hidden', },
            item: {
                label: 'Lojas',
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
        }
        , {
            attributes: { className: 'ps-2 col-2 overflow-hidden', },
            item: {
                label: 'Depart.',
                captureValue: {
                    type: 'select',
                    onChange: (e: any) => { onSubDepartament(parseInt(e.target.value)) },
                    placeholder: '',
                    name: 'depart_id',
                    className: 'form-control',
                    required: true,
                    id: '',
                    options: optionsStore
                },
            }
        }
        , {
            attributes: { className: 'ps-2 col-3 overflow-hidden', },
            item: {
                label: 'Subdep.',
                captureValue: {
                    type: 'select',
                    onChange: (e: any) => { selectSubDep(parseInt(e.target.value)) },
                    placeholder: '',
                    name: 'depart_id',
                    className: 'form-control',
                    required: true,
                    id: '',
                    options: optionsSubDepartament
                },
            }
        }
    ];