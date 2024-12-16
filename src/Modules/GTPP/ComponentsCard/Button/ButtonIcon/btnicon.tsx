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
      className={`bg-${color} rounded font-weight-bold p-2 text-white d-flex gap-2 align-items-center`}
    >
      <i className={`fa fa-${icon} text-white`}></i>
      <span>{description}</span>
    </button>
  );
}

export default ButtonIcon;
