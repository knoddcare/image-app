import React, { createContext, useContext, useState, ReactNode } from 'react';
import './warningModal.css';

interface ModalContextType {
    showModal: (content: String) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
    showModal: () => { },
    hideModal: () => { },
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalContent, setModalContent] = useState<String | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = (content: String) => {
        setModalContent(content);
        setIsModalVisible(true);
        setTimeout(() => { setIsModalVisible(false),setModalContent(null)}, 5000); 
    };

    const hideModal = () => {
        setIsModalVisible(false);
        setTimeout(() => setModalContent(null), 300); 
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modalContent && (
                <div className={`modal ${isModalVisible ? 'show' : ''}`}>
                    <div className="modal-content">
                        {modalContent}
                        <hr/>
                        <button onClick={hideModal}>Close</button>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};