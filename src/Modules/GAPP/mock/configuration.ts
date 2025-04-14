

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
    data: any,
    searchCEP: any
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
                text_value: 'Nome:',
                placeholder: 'Digite a empesa..',
                value: data.name,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueName(e.target.value),
                name: 'name',
                className: 'form-control',
                required: true,
                id: ''
            },
            {
                type: 'textLabel',
                text_value: 'CNPJ:',
                value: data.cnpj,
                placeholder: '00.000.000/0001-00',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const onlyDotsAndDashes = e.target.value.replace(/[^0-9./-]/g, "");
                    captureValueCnpj(onlyDotsAndDashes);
                },
                name: 'cnpj',
                className: 'form-control',
                required: false,
                id: ''
            },
            {
                type: 'textLabel',
                text_value: 'CEP:',
                placeholder: '00000-000',
                value:data.zip_code,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const onlyDashes = e.target.value.replace(/[^0-9/-]/g, "");
                    captureValueZipCode(onlyDashes)
                },
                name: 'zipcode',
                className: 'form-control',
                required: true,
                id: ''
            },
            {
                type: 'button',
                text_value: 'CEP:',
                placeholder: '00000-000',
                onClick: (e: React.ChangeEvent<HTMLInputElement>) => searchCEP(),
                name: 'zipcode',
                value: 'Pesquisar CEP',
                className: 'btn btn-success mt-4',
                required: true,
                id: ''
            },
            
            {
                type: 'textLabel',
                text_value: 'Cidade:',
                placeholder: 'Ex: São Paulo',
                value: data.city,
                disabled: false,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueCity(e.target.value),
                name: 'city',
                className: 'form-control',
                required: true,
                id: ''
            },
            {
                type: 'selectWithLabel',
                text_value: 'Estado:',
                value: data.state,
                placeholder: 'Selecione o estado',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueState(e.target.value),
                name: 'state',
                className: 'form-control',
                required: true,
                disabled: false,
                id: '',
                options: [
                      { value: 'AC', label: 'AC' },
                      { value: 'AL', label: 'AL' },
                      { value: 'AP', label: 'AP' },
                      { value: 'AM', label: 'AM' },
                      { value: 'BA', label: 'BA' },
                      { value: 'CE', label: 'CE' },
                      { value: 'DF', label: 'DF' },
                      { value: 'ES', label: 'ES' },
                      { value: 'GO', label: 'GO' },
                      { value: 'MA', label: 'MA' },
                      { value: 'MT', label: 'MT' },
                      { value: 'MS', label: 'MS' },
                      { value: 'MG', label: 'MG' },
                      { value: 'PA', label: 'PA' },
                      { value: 'PB', label: 'PB' },
                      { value: 'PR', label: 'PR' },
                      { value: 'PE', label: 'PE' },
                      { value: 'PI', label: 'PI' },
                      { value: 'RJ', label: 'RJ' },
                      { value: 'RN', label: 'RN' },
                      { value: 'RS', label: 'RS' },
                      { value: 'RO', label: 'RO' },
                      { value: 'RR', label: 'RR' },
                      { value: 'SC', label: 'SC' },
                      { value: 'SP', label: 'SP' },
                      { value: 'SE', label: 'SE' },
                      { value: 'TO', label: 'TO' },
                ],
            },
            {
                type: 'textLabel',
                text_value: 'Distrito:',
                value: data.district,
                placeholder: 'Digite..',
                disabled: false,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueDistrict(e.target.value),
                name: 'district',
                className: 'form-control',
                required: true,
                id: ''
            },
            {
                type: 'textLabel',
                text_value: 'Numero:',
                placeholder: 'Digite..',
                value: data.number,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueNumber(e.target.value),
                name: 'number',
                className: 'form-control',
                required: true,
                id: ''
            },
            {
                type: 'textLabel',
                text_value: 'Rua:',
                value: data.street,
                disabled: false,
                placeholder: 'Ex: R. medeiros de..',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueStreet(e.target.value),
                name: 'street',
                className: 'form-control',
                required: true,
                id: ''
            },
            {
                type: 'textLabel',
                text_value: 'Complemento:',
                placeholder: 'Ex: Loja 201 bloco 2',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueComplement(e.target.value),
                name: 'complement',
                value: data.complement,
                className: 'form-control',
                required: false,
                id: ''
            },
        ],
    },
}];