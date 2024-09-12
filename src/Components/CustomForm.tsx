import React from 'react';

type CustomFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  fieldsets: {
    attributes?: React.FieldsetHTMLAttributes<HTMLFieldSetElement>;
    item: {
      label: string;
      mandatory?: boolean;
      captureValue:
        | React.InputHTMLAttributes<HTMLInputElement>
        | React.SelectHTMLAttributes<HTMLSelectElement>
        | React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    };
    legend?:{
      style?:string;
      text?:string;
    };
    buttons?:[

    ]
  }[];
};

function CustomForm({ fieldsets, ...formProps }: CustomFormProps) {
  return (
    <form {...formProps}>
      {fieldsets.map((fieldset, fieldsetIndex) => (
        <fieldset key={fieldsetIndex} {...fieldset.attributes}>
          <legend className={fieldset.legend?.style}>{fieldset.legend?.text}</legend>
          <label>
            {fieldset.item.label}
            <b className={fieldset.item.mandatory ? 'text-danger' : ''}>{fieldset.item.mandatory ? ' *' : ''}</b>
            :
          </label>
          {renderField(fieldset.item.captureValue)}
        </fieldset>
      ))}
      <button className='btn my-2'>Login</button>
    </form>
  );
}

function renderField(
  captureValue:
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.SelectHTMLAttributes<HTMLSelectElement>
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  if ('type' in captureValue) {
    switch (captureValue.type) {
      case 'select':
        return <SelectField {...(captureValue as React.SelectHTMLAttributes<HTMLSelectElement>)} />;
      case 'textarea':
        return <TextareaField {...(captureValue as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />;
      default:
        return <InputField {...(captureValue as React.InputHTMLAttributes<HTMLInputElement>)} />;
    }
  }
  // Fallback to input if type is not specified
  return <InputField {...(captureValue as React.InputHTMLAttributes<HTMLInputElement>)} />;
}

function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} />;
}

function TextareaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}

export default CustomForm;
