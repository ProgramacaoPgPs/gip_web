

export const fildsetsFormsBusiness = (
    captureValueCnpj: (value: string) => void,
    captureValueName: (value: string) => void,
    captureValueStreet: (value: string) => void,
    captureValueDistrict: (value: string) => void,
    captureValueCity: (value: string) => void,
    captureValueState: (value: string) => void,
    captureValueNumber: (value: string) => void,
    captureValueZipCode: (value: string) => void,
    captureValueComplement: (value: string) => void,
    captureValueStateFavorite: (value: boolean) => void,
    valueOptionsState: Array<string>,
    data: any,
) => [{
    attributes: { 
        className: 'w-100', 
    },
    item: {
        label: '',
        mandatory: false,
        captureValue: [
            {
                type: 'textLabel',
                captureValueInputText: 'Nome:',
                placeholder: 'Digite a empesa..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueName(e.target.value),
                name: 'name',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'CEP:',
                placeholder: '00000-000',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueZipCode(e.target.value.replace("-", "")),
                name: 'zipcode',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'CNPJ:',
                captureValueStyle: {
                    fontSize: '10px',
                },
                placeholder: '00.000.000/0001-00',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueCnpj(e.target.value.replace(/[^a-z0-9]/gi, "")),
                name: 'cnpj',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'selectWithLabel',
                captureValueInputText: 'Estado:',
                value: data.state,
                placeholder: 'Selecione o estado',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueState(e.target.value),
                name: 'state',
                className: 'form-control',
                required: false,
                id: '',
                options: valueOptionsState,
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Cidade:',
                placeholder: 'Ex: São Paulo',
                value: data.city,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueCity(e.target.value),
                name: 'city',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Distrito:',
                value: data.district,
                placeholder: 'Digite..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueDistrict(e.target.value),
                name: 'district',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Numero:',
                placeholder: 'Digite..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueNumber(e.target.value),
                name: 'number',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Rua:',
                value: data.street,
                placeholder: 'Ex: R. medeiros de..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueStreet(e.target.value),
                name: 'street',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Complemento:',
                placeholder: 'Ex: Loja 201 bloco 2',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueComplement(e.target.value),
                name: 'complement',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'selectWithLabel',
                captureValueInputText: 'Favoritar ?',
                placeholder: 'Selecione',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueStateFavorite(e.target.value == 'true'),
                name: 'favorite',
                className: 'form-select',
                required: false,
                id: '',
                options: [
                    {value: false, label: 'Não'},
                    {value: true, label: 'Sim'}
                ]
            },
        ],
    },
}];