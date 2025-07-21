import React, { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(true); // Always true initially

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <ModalContext.Provider value={{ showModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
