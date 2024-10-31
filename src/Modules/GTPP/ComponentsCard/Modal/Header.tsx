import React from 'react';

interface HeaderModalProps {
  color: string;
  description: string;
  onClick?: () => void; // Usando um tipo mais específico
}

const HeaderModal: React.FC<HeaderModalProps> = ({ color, description, onClick }) => {
  return (
    <div className="w-100">
      <div className="d-flex justify-content-between align-items-center pt-2 px-2">
        <h2 className="font-1">{description}</h2>
        <button
          onClick={onClick ? onClick : () => console.log('teste')}
          className={`btn btn-${color} text-light fa fa-x`}
          aria-label="Fechar modal"
        />
      </div>
    </div>
  );
};

export default HeaderModal;
