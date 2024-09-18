import React, { useState, ReactNode } from "react";
import {
  Button,
  Collapse,
  Image,
  Card as BootstrapCard,
} from "react-bootstrap";

type TypeButtonCollapse = {
  isImage?: boolean; // Define se é imagem ou botão
  isIcon?: Boolean; // Define se é icon ou botão
  buttonText?: string; // Texto do botão se for botão
  employeeImage?: string; // URL da imagem, se for imagem
  employeeName?: string; // Nome do usuário (caso imagem)
  collapseContent?: React.ReactNode; // Conteúdo que será exibido no Collapse
  children?: React.ReactNode; // pode entrar um elemento HTML
  className?: string; // Classe personalizada
};

const UseButtonCollapse: React.FC<TypeButtonCollapse> = ({
  isImage = false, // Por padrão, não é imagem
  isIcon = false,
  children=null,
  buttonText = "Detalhes", // Texto padrão do botão
  employeeImage = "https://via.placeholder.com/50", // Imagem padrão
  employeeName = "User", // Nome padrão
  collapseContent,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para o Collapse
  return (
    <>
      {isImage ? (
        <div className="d-flex justify-content-start align-items-center mt-3">
          <Button
            variant="transparent"
            className={className || "user-toggle-btn"}
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="collapse-content"
            aria-expanded={isOpen}
          >
            <Image
              src={employeeImage}
              roundedCircle
              className="employee-img"
              alt={employeeName}
            />
          </Button>
          <span className="ms-2 employee-name">{employeeName}</span>
        </div>
      ) : isIcon ? (
        (
            <Button
              variant="trasparent"
              className={className || "mt-3"}
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="collapse-content"
              aria-expanded={isOpen}
            >
              {children}
            </Button>
          )
      ) : (
        <Button
          variant="outline-success"
          className={className || "mt-3"}
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="collapse-content"
          aria-expanded={isOpen}
        >
          {buttonText}
        </Button>
      )}

      {/* Conteúdo colapsável */}
      <Collapse in={isOpen}>
        <div id="collapse-content" className="mt-2">
          {collapseContent}
        </div>
      </Collapse>
    </>
  );
};

export default UseButtonCollapse;
