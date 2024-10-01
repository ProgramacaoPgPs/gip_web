export const fieldsetsData = [
    {
        attributes: { id: '', className: '', },
        item: {
            label: 'Descrição',
            mandatory: true,
            captureValue: {
                type: 'text',
                placeholder: 'Digite a taréfa',
                name: 'description',
                className: 'form-control',
                required: true,
                id: 'description_form'
            },
        },
    },
    {
        attributes: { id: '', className: '', },
        item: {
            label: 'Data Inicial',
            mandatory: true,
            captureValue: {
                type: 'date',
                placeholder: '',
                name: 'date_initial',
                className: 'form-control',
                required: true,
                id: 'date_initial'
            },
        },
    },
    {
        attributes: { id: '', className: '', },
        item: {
            label: 'Data Final',
            mandatory: true,
            captureValue: {
                type: 'date',
                placeholder: '',
                name: 'date_initial',
                className: 'form-control',
                required: true,
                id: 'date_initial'
            },
        },
    }
  ];