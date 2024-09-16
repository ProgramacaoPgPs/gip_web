import React, { useState, ReactNode } from 'react';
import './CollapseAll.style.css';

type CollapseProps = {
  toggleText: string;
  children: ReactNode;
}

const CollapseAll: React.FC<CollapseProps> = (props) => {
  return (
    <div className='dropdown'>
      <input type="checkbox" className='dropdown__input' id="dropdown" />
      <label className='dropdown__face' htmlFor="dropdown">
        <div className='dropdown__text'>
          {props.toggleText}
        </div>
        <div className="dropdown__arrow"></div>
      </label>
      <ul className='dropdown__items'>
        {props.children}
      </ul>
    </div>
  );
};

export default CollapseAll;
