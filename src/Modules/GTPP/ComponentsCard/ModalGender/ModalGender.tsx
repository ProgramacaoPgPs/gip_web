import React from "react";
import './Modal.css';

type TModalGender={
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
  childrenButton?: React.ReactNode;
  title?: string;
}

const ModalGender: React.FC<TModalGender> = ({ isOpen, onClose, children, childrenButton, title = "Titulo", onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="d-flex justify-content-between align-items-center">
          <strong>{title}</strong>
          <button className="btn btn-danger fa fa-close" onClick={onClose} aria-label="Fechar modal"></button>
        </div>
        <section className="content">
          {children}
        </section>
        <div className="d-flex flex-column">
          {childrenButton}
          <div className="modal-actions d-flex justify-content-around">
            <button onClick={onSave}>Salvar</button>
            <button onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalGender;
