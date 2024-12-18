import React, { useEffect, useState } from "react";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  text: string;
  title: string;
  setText: (value: string) => void;
  onClose: () => void;
  onSave: (text: string, isModalEmpty: boolean) => void;
  isModalEmpty?: boolean;
  childrenContent?: React.ReactNode;
};

const ModalContent: React.FC<{
  title: string;
  text: string;
  setText: (value: string) => void;
  selectedOption: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (text: string, isModalEmpty: boolean) => void;
  onClose: () => void;
  childrenContent?: React.ReactNode;
}> = ({
  title,
  text,
  setText,
  selectedOption,
  setSelectedOption,
  onSave,
  onClose,
  childrenContent,
}) => (
  <div className="modal-content">
    <div className="d-flex justify-content-between align-items-center">
      <strong>{title || "Título"}</strong>
      <button className="btn btn-danger" onClick={onClose} aria-label="Fechar modal">
        &times;
      </button>
    </div>

    {selectedOption ? (
      <section className="content">
        <h2>{childrenContent}</h2>
      </section>
    ) : (
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite..."
      />
    )}

    <div className="d-flex justify-content-between">
      <div>
        <strong className="d-block">
          <input
            type="radio"
            checked={!selectedOption}
            onChange={() => setSelectedOption(false)}
          />
          Tarefa
        </strong>
        <strong className="d-block">
          <input
            type="radio"
            checked={selectedOption}
            onChange={() => setSelectedOption(true)}
          />
          Observação
        </strong>
      </div>
      <div className="modal-actions">
        <button onClick={() => onSave(text, selectedOption)}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  </div>
);

const Observer: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  text,
  setText,
  title,
  childrenContent,
}) => {
  const [selectedOption, setSelectedOption] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setText("");
      setSelectedOption(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <ModalContent
        title={title}
        text={text}
        setText={setText}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        onSave={onSave}
        onClose={onClose}
        childrenContent={childrenContent}
      />
    </div>
  );
};

export default Observer;
