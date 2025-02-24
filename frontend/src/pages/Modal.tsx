import React from "react";
import "./Modal.css";

interface ModalProps {
    username: string;
    onClose: () => void;
    enlarged?: boolean;
}

const Modal: React.FC<ModalProps> = ({ username, onClose, enlarged = false }) => {
    return (
        <div className="modal-overlay">
            <div className={`modal-container ${enlarged ? "modal-large" : ""}`}>
                <h2>Üdvözlünk, {username}!</h2>
                <button onClick={onClose} className="modal-button">
                    OK
                </button>
            </div>
        </div>
    );
};

export default Modal;