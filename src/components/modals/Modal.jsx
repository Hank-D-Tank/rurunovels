import React from 'react';
import { RxCross1 } from 'react-icons/rx';

const Modal = ({ children, show=false, modalTitle, modalAction, modalActionIcon, modalActionEvent, onClose }) => {
    return (
        <div className={"modal modal-lg fade " + (show ? "show" : "hide")}  role="dialog" style={{display: show ? "block" : "none"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{modalTitle}</h2>
                        <div className="modal-close-btn" onClick={onClose}><RxCross1 /></div>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-blue me-auto d-flex align-items-center" onClick={modalActionEvent}> &nbsp; {modalAction}
                            &nbsp; {modalActionIcon} </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
