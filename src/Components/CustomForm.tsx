import React from 'react';
import '../Modules/GAPP/Business/Component/style/style.css';

type CaptureValueArray = Array<
  [
    React.InputHTMLAttributes<HTMLInputElement>,
    React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[], type: string[] } | any,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
  ]
> | {
  labelText: string;
};

type CaptureValueTuple = [
  React.InputHTMLAttributes<HTMLInputElement>,
  React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[], type: string[] },
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
];

type CustomFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  classRender?: string;
  notButton?: boolean;
  typeButton?: 'submit' | 'reset' | 'button' | undefined;
  fieldsets: {
    attributes?: React.FieldsetHTMLAttributes<HTMLFieldSetElement>;
    item: {
      label: string;
      classLabel?: string;
      mandatory?: boolean;
      captureValue:
        | React.InputHTMLAttributes<HTMLInputElement>
        | (React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[], type: string })
        | React.TextareaHTMLAttributes<HTMLTextAreaElement>
        | CaptureValueArray
        | CaptureValueTuple;
    };
    legend?: {
      style?: string;
      text?: string;
    };
    buttons?: [];
  }[] | any;
  onAction?: () => void;
  titleButton?: string;
  classButton?: string;
};

interface SelectOption {
  value: string | number;
  label: string;
};

function CustomForm({ fieldsets, onAction, classRender, classButton, notButton = true, typeButton = 'submit', titleButton = "Login", ...formProps }: CustomFormProps) {
  return (
    <form {...formProps}>
      <div className='container'>
        <div className='row w-100 m-auto'>
          {fieldsets.map((fieldset: any, fieldsetIndex: any) => (
            <div key={fieldsetIndex} {...fieldset.attributes}>
              <legend className={fieldset.legend?.style}>{fieldset.legend?.text}</legend>
              <label className={fieldset.item.classLabel}>
                {fieldset.item.label}
                <b className={fieldset.item.mandatory ? 'text-danger' : ''}>
                  {fieldset.item.mandatory ? ' *' : ''}
                </b>
              </label>
              <div className={`${classRender}`}>{renderField(fieldset.item.captureValue)}</div>
            </div>
          ))}
          {notButton &&
            <button
              onClick={onAction}
              type={typeButton}
              title="Executar ação"
              className={classButton ? classButton : "btn my-2 "}>
              {titleButton}</button>}
        </div>
      </div>
    </form>
  );
}

export function renderField(captureValue: CaptureValueArray | CaptureValueTuple) {
  const convertValueArray = Array.isArray(captureValue) ? captureValue : [captureValue];
  return (
    <React.Fragment>
      {convertValueArray.map((field: any, index) => (
        <React.Fragment key={`field_${index}`}>
          {renderFieldSingle(field)}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

function renderFieldSingle(captureValue: CaptureValueArray | any) {
  if (isFieldWithType(captureValue)) {
    switch (captureValue?.type) {
      case 'textarea':
        return renderTextarea(captureValue);
      case 'select':
        return renderSelect(captureValue);
      default:
        return renderInput(captureValue);
    }
  }
}

function renderInput(captureValue: React.InputHTMLAttributes<HTMLInputElement>) {
  return <InputField {...captureValue} />;
}

function renderSelect(captureValue: React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[] } | any) {
  return <SelectField {...captureValue} options={captureValue?.options || []} />;
}

function renderTextarea(captureValue: React.TextareaHTMLAttributes<HTMLTextAreaElement> | object) {
  return <TextareaField {...captureValue} />;
}

export function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

function isFieldWithType(captureValue: any): captureValue is { type: string } {
  return captureValue && typeof captureValue.type === 'string';
}

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }
) {
  return (
    <select name={props.name} value={props.value} required={props.required} onChange={props.onChange} className={`form-select ${props.className ? props.className : ""}`} disabled={props.disabled}>
      <option value="" hidden></option>
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

export function InputCheckbox(props: { label?: string, checked?: boolean, onChange: any, textColor?: string, task: any, yesNo: number, id: string, order: number, onPosition: () => void }) {
  const { yesNo, onPosition } = props;

  return (
    <div className='d-flex align-items-center col-12'>
      <button onClick={onPosition} title='Alterar posição do item' className='btn btn-secondary p-0 rounded rounded-circle col-2 col-sm-1'>{props.order.toString().padStart(2, "0")}</button>
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