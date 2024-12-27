// App.js
import React, { useState } from 'react';

function AnexoImage() {
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // @ts-ignore
      setImage(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImage(null);
  };

  return (
    <div>
      <label className="file-input-container">
        <div className='fa fa-paperclip p-2 cursor-pointer'/>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content rounded" onClick={(e) => e.stopPropagation()}>
            <span>Imagem anexada  </span>
            <img className='rounded' src={image || ""} alt="Imagem selecionada" style={{ width: '100%', maxWidth: '500px' }} />
            <button onClick={closeModal} className="btn btn-danger">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnexoImage;
