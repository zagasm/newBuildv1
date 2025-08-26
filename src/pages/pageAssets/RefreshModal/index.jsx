import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import SessionPage from "../../auth/SessionPage/BrowserSession";
import AUthModalContent from "../../auth/AuthModal/AUthModalContent";
import { useAuth } from "../../auth/AuthContext";

const RefreshModal = () => {
    const [show, setShow] = useState(false);
    const { user } = useAuth();
    useEffect(() => {
        // const isFirstVisit = !sessionStorage.getItem("hasVisited");

        if (user) {
            sessionStorage.setItem("hasVisited", "true");
            setShow(false);
        } else { // Type 1 means page was reloaded
            setShow(true);
        }
    }, [user]);
    // useEffect(() => {
    //     if (show) {
    //         const timer = setTimeout(() => {
    //             handleClose();
    //         }, 5000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [show]);
    const handleClose = () => setShow(false);

    return (
        <Modal backdrop="static"  keyboard={false} show={show} onHide={handleClose} centered animation={true}>
            <Modal.Body className="p-0 m-0" >
                <AUthModalContent refresh={true} closrefresh={handleClose} />
            </Modal.Body>
        </Modal>
    );
};

export default RefreshModal;