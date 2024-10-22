import React, { useState } from "react";
import "./Style.css";

// Componente individual do checkbox
const Checkbox = (props: { label: string, isChecked: boolean, onChange: any }) => {
  return (
    <div className="checkbox-item">
      <label>
        <input type="checkbox" checked={props.isChecked} onChange={props.onChange} />
        {props.label}
      </label>
    </div>
  );
};

const CheckboxList = (props: { items: any }) => {
  const [checkboxes, setCheckboxes] = useState(props.items);

  const handleCheckboxChange = (index: any) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].check = !newCheckboxes[index].check;
    setCheckboxes(newCheckboxes);
  };

  const checkedCount = checkboxes.filter((item: any) => item.check).length;

  return (
    <div className="checkbox-list">
      <div className="checkbox-counter">
        {checkedCount} checked
      </div>
      {checkboxes.map((item:any, index:number) => (
        <Checkbox
          key={index}
          label={item.description}
          isChecked={item.check}
          onChange={(e:any) => {
            handleCheckboxChange(index);
            console.log(e.target.value);
          }}
        />
      ))}
    </div>
  );
};

export default CheckboxList;
