import React from 'react';

interface IModalConfirm {
    cancel?: () => void;  // Tipo para função de cancelamento
    confirm?: () => void; // Tipo para função de confirmação
}

const ModalConfirm: React.FC<IModalConfirm> = ({ cancel, confirm }) => {
    return (
        <React.Fragment>
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}
            >
                <div 
                    style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}
                >
                    <h3>Tem certeza?</h3>
                    <p>Você deseja continuar com essa ação?</p>
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                            onClick={confirm}
                        >
                            Confirmar
                        </button>
                        <button 
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                            onClick={cancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ModalConfirm;
