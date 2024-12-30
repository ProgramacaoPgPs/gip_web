import React, { useState } from 'react';

function AnexoImage(props: any) {
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result?.toString() || '');
        setImage(URL.createObjectURL(file));
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImage(null);
    setBase64Image(null);
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
            <button onClick={() => {
                console.log({
                    file: base64Image
                })
            }} className="btn btn-success" style={{ marginTop: '10px' }}>
              Salvar
            </button>
            <button onClick={closeModal} className="btn btn-danger" style={{ marginTop: '10px' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnexoImage;
