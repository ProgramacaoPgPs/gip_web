export const fieldsetsFormsInfractions = (
  captureValueInfraction: (value: string) => void,
  captureValuePoints: (value: string) => void,
  captureValueGravitity: (value: string) => void,
  data: any
) => [
  {
    attributes: { className: 'col-12' },
    item: {
      label: 'Infração:',
      mandatory: true,
      captureValue: {
        type: 'text',
        placeholder: 'Digite a infração',
        name: 'infraction',
        className: 'form-control',
        value: data.infraction,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValueInfraction(e.target.value),
        required: true,
        id: ''
      }
    }
  },
  {
    attributes: { className: 'col-12' },
    item: {
      label: 'Gravidade:',
      mandatory: true,
      captureValue: {
        type: 'select',
        placeholder: 'Selecione',
        name: 'gravitity',
        className: 'form-control',
        value: data.gravitity,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => captureValueGravitity(e.target.value),
        required: true,
        id: '',
        options: [
          { value: '', label: 'Selecione' },
          { value: 'leve', label: 'Leve' },
          { value: 'media', label: 'Média' },
          { value: 'grave', label: 'Grave' },
          { value: 'gravissima', label: 'Gravíssima' }
        ]
      }
    }
  },
  {
    attributes: { className: 'col-12' },
    item: {
      label: 'Pontos:',
      mandatory: true,
      captureValue: {
        type: 'number',
        placeholder: 'Ex: 3',
        name: 'points',
        className: 'form-control',
        value: data.points,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => captureValuePoints(e.target.value),
        required: true,
        id: ''
      }
    }
  }
];
