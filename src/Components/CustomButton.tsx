import React from 'react';
type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value?: string; 
    customStyle?:string;
};

export function CustomButton({ value,customStyle, children, ...props }: CustomButtonProps) {
    return (
        <button className={customStyle} {...props}>
            {value ? value : children}
        </button>
    );
}