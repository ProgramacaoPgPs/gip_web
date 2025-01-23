import React, { useEffect, useState } from 'react';

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

function CustomForm({ fieldsets, titleButton = "Login", ...formProps }: CustomFormProps) {
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

export function SelectFieldDefault(props: {
  label?: string;
  value?: string | number;
  onChange?: any;
  className?: string;
  disabled?: boolean;
  options: { label?: string, value?: string | number }[];
}) {
  return (
    <label className='fw-bold'>
      {props.label}
      <select value={props.value} onChange={props.onChange} className={`form-select ${props.className ? props.className : ""}`} disabled={props.disabled}>
        <option hidden={true} defaultValue={""} value={""}>Selecione</option>
        {props.options.map(({ label, value }, key: number) => (
          <option key={`opt_${key}`} value={value}>{label}</option>
        ))}
      </select>
    </label>
  )
}


export function InputCheckbox(props: { label?: string, checked?: boolean, onChange: any, textColor?: string, task: any, yesNo: number, id: string, order: number,onPosition:()=>void }) {
  const {yesNo,onPosition } = props;

  return (
    <div className='d-flex align-items-center col-12'>
      <button onClick={onPosition} title='Alterar posição do item' className='btn btn-secondary p-0 roedond rounded-circle col-2 col-sm-1'>{props.order.toString().padStart(2, "0")}</button>
      {yesNo == 0 ? <OptionItem /> : <QuestionItem />}
      <label htmlFor={`item_task_${props.id}`} className='fs-6 col-7 col-sm-9'>{props.label}</label>
    </div>
  )

  function QuestionItem() {
    return (
      <div className='d-flex flex-column col-3 col-sm-2 ps-2'>
        <label className='fs-6'>
          <input type="checkbox" name={props.id} checked={yesNo == 1 ? true : false} value={1} onChange={
            (e: any) => {
              submitQuestionItem(e.target, 1);
            }
          } className='form-check-input me-1' />
          Sim
        </label>
        <label className='fs-6'>
          <input type="checkbox" name={props.id} checked={yesNo == 2 ? true : false} value={2} onChange={
            (e: any) => {
              submitQuestionItem(e.target, 2);
            }
          } className='form-check-input me-1' />
          Não
        </label>
      </div>
    );
  }
  function submitQuestionItem(event: any, response: number) {
    const value = yesNo == response ? -1 : event.value;
    props.onChange(props.id, event.checked, props.task.task_id, props.task, value);
  }
  function OptionItem() {
    return (
      <div className='d-flex col-3 col-sm-2 ps-2'>
        <label className={`fs-6 ${props.textColor} cursor-pointer`}>
          <input id={`item_task_${props.id}`} type="checkbox" value={0} checked={props.checked} onChange={(e: any) => {
            props.onChange(props.id, e.target.checked, props.task.task_id, props.task);
          }} className='form-check-input' />
        </label>
      </div>
    );
  }
}


export function TextareaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}

export default CustomForm;
