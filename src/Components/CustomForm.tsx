import React from 'react';

type CustomFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  fieldsets: {
    attributes?: React.FieldsetHTMLAttributes<HTMLFieldSetElement>;
    item: {
      label: string;
      mandatory?: boolean;
      captureValue:
        | React.InputHTMLAttributes<HTMLInputElement>
        | (React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[] })  // Aqui adicionamos options somente para select
        | React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    };
    legend?: {
      style?: string;
      text?: string;
    };
    buttons?: [];
    
  }[];
  onAction?: any;
  titleButton?: any;
};

interface SelectOption {
  value: string | number;
  label: string;
}

function CustomForm({ fieldsets, titleButton="Login", ...formProps }: CustomFormProps) {
  return (
    <form {...formProps}>
      {fieldsets.map((fieldset, fieldsetIndex) => (
        <fieldset key={fieldsetIndex} {...fieldset.attributes}>
          <legend className={fieldset.legend?.style}>{fieldset.legend?.text}</legend>
          <label>
            {fieldset.item.label}
            <b className={fieldset.item.mandatory ? 'text-danger' : ''}>
              {fieldset.item.mandatory ? ' *' : ''}
            </b>
            :
          </label>
          {renderField(fieldset.item.captureValue)}
        </fieldset>
      ))}
      {/* <button className='btn mt-5 my-2'>Enviar</button> */}
      <button className="btn my-2">{titleButton}</button>
    </form>
  );
}

function renderField(
  captureValue:
    | React.InputHTMLAttributes<HTMLInputElement>
    | (React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[] }) // Certifique-se que options só existe em select
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  if ('type' in captureValue) {
    switch (captureValue.type) {
      case 'select':
        return (
          <SelectField
            {...(captureValue as React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[] })}
            // @ts-ignore
            options={captureValue?.options || []} 
          />
        );
      case 'textarea':
        return <TextareaField {...(captureValue as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />;
      default:
        return <InputField {...(captureValue as React.InputHTMLAttributes<HTMLInputElement>)} />;
    }
  }
  return <InputField {...(captureValue as React.InputHTMLAttributes<HTMLInputElement>)} />;
}

export function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }
) {
  return (
    <select {...props} className={`form-control ${props.className}`}>
      {props.options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function SelectFieldDefault (props: {
  label?: string;
  value?: string | number;
  onChange?: any;
  className?: string;
  options: {label?: string, value?: string | number}[];
}) {
  return (
    <label>
      {props.label}
      <select value={props.value} onChange={props.onChange} className={`form-select ${props.className}`}>
        <option defaultValue={""} value={""}>Selecione</option>
        {props.options.map(({label, value}, key: number) => (
          <option key={`opt_${key}`} value={value}>{label}</option>
        ))}
      </select>
    </label>
  )
}


export function InputCheckbox(props: {label: string, value: boolean , onChange: any}) {
  return (
    <label className='cursor-pointer'>
      <input type="checkbox" checked={props.value} onChange={props.onChange} className='form-check-input' />{" "}
      {props.label}
    </label>
  )
}

export function TextareaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}

export default CustomForm;
