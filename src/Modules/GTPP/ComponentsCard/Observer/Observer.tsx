import React, { useEffect } from "react";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  text: string;
  title: string;
  setText: (value: string) => void;
  onClose: () => void;
  onSave: (text: string) => void;
};

const Observer: React.FC<ModalProps> = ({ isOpen, onClose, onSave, text, setText, title }) => {
  useEffect(() => {
    if (!isOpen) {
      setText(""); // Limpa o texto ao fechar o modal, se necessário
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
          &times;
        </button>
        <strong>{title || "titulo"}</strong>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite..."
        />
        <div className="modal-actions">
          <button onClick={() => onSave(text)}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Observer;
