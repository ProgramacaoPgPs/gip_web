import React from 'react';

interface IButtonIcon extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
  icon: string;
  description: string;
}

function ButtonIcon({ color, icon, description, ...rest }: IButtonIcon) {
  return (
    <button
      {...rest}
      className={`btn-${color} btn rounded font-weight-bold p-2 text-white d-flex align-items-center`}
    >
      <i className={`fa fa-${icon} text-white`}></i>{description.length > 0 && <span>{description}</span>}
    </button>
  );
}

export default ButtonIcon;
