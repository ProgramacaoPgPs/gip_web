

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
    valueOptionsState: Array<string>
) => [{
    attributes: { 
        className: 'w-100', 
    },
    item: {
        label: 'GAPP Empresa',
        mandatory: false,
        captureValue: [
            {
                type: 'textLabel',
                captureValueInputText: 'CNPJ:',
                captureValueStyle: {
                    fontSize: '10px',
                },
                placeholder: '00.000.000/0001-00',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueCnpj(e.target.value),
                name: 'cnpj',
                className: 'form-control',
                required: false,
                id: ''
            },
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
                captureValueInputText: 'Rua:',
                placeholder: 'Ex: R. medeiros de..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueStreet(e.target.value),
                name: 'street',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Distrito:',
                placeholder: 'Digite..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueDistrict(e.target.value),
                name: 'district',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                captureValueInputText: 'Cidade:',
                placeholder: 'Ex: São Paulo',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueCity(e.target.value),
                name: 'city',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'selectWithLabel',
                captureValueInputText: 'Estado:',
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
                captureValueInputText: 'CEP:',
                placeholder: '00000-000',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueZipCode(e.target.value),
                name: 'zipcode',
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
                // @ts-ignore
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueStateFavorite(e.target.value),
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