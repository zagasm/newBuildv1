import React, { useState } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import './PostDownloadButton.css';

const BASE_URL = 'https://zagasm.com/content/uploads/';

const PostDownloadButton = ({ data }) => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [downloading, setDownloading] = useState(false); // loader for button

    const hasImages = data.photos?.length > 0;
    const hasText = data.text?.trim().length > 0;

    const toggleSelectImage = (imgSource) => {
        const fullUrl = BASE_URL + imgSource;
        setSelectedImages((prev) =>
            prev.includes(fullUrl)
                ? prev.filter((url) => url !== fullUrl)
                : [...prev, fullUrl]
        );
    };

    const downloadTextAsImage = async () => {
        const div = document.createElement('div');
        div.style.color = data.text_color_code || '#000000';
        div.style.backgroundColor = data.background_color_code || '#ffffff';
        div.style.padding = '40px';
        div.style.borderRadius = '10px';
        div.style.fontSize = '24px';
        div.style.fontWeight = 'bold';
        div.style.textAlign = 'center';
        div.style.display = 'inline-block';
        div.style.maxWidth = '800px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';
        div.textContent = data.text;

        document.body.appendChild(div);

        try {
            const canvas = await html2canvas(div, { scale: 2 });
            canvas.toBlob((blob) => {
                saveAs(blob, 'post-text.png');
                document.body.removeChild(div);
            }, 'image/png');
        } catch (err) {
            console.error('Text image download failed:', err);
            document.body.removeChild(div);
        }
    };

    const handleClick = () => {
        if (hasImages && data.photos.length === 1) {
            const imageUrl = BASE_URL + data.photos[0].source;
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'post-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (hasImages && data.photos.length > 1) {
            setShowGallery(true);
        } else if (hasText) {
            downloadTextAsImage();
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedImages.length === 0) return;
        setDownloading(true);

        selectedImages.forEach((url, index) => {
            const link = document.createElement('a');
            link.href = url;
            link.download = `image-${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        setDownloading(false);
        setShowGallery(false);
        setSelectedImages([]);
    };

    return (
        <>
            {/* <button className="dropdown-item d-flex align-items-center py-2" type="button">
                    <i className="fas fa-bookmark me-3" style={{ width: '20px', color: '#8000FF' }}></i>
                    <span>Save Post</span>
                </button> */}
            {!hasImages &&

                <li className='w-100 text-left d-flex align-items-center py-3 mt-3' style={{ margin: '-10px' }}>
                    <Button
                        // variant="link"
                        // type="button"
                        className=""
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '16px',
                            color: 'black',
                            outline: '0px',
                            margin: 'none'
                        }}
                        onClick={handleClick}
                        title="Download or View"
                    >
                        <i style={{ fontSize: '20px' }} className="feather-download me-3"></i>

                        {<span className='ml-2'>Download text as image</span>}
                        {/* {hasText && <span className='ml-2'>Download text as image</span>} */}
                    </Button>
                </li>
            }

            <Modal
                show={showGallery}
                backdrop="static"
                keyboard={false}
                onHide={() => { }}
                dialogClassName="mobile-slide-modal custom-desktop-width m-md-auto m-0"
                centered
            >
                <Modal.Header className="modal-header-custo border- p-3">
                    <h6 className="fw-bold mb-3 text-center w-100">Select images to download</h6>
                    <div className="d-fle justify-space-betwee position-r mb-3">
                        <Button
                            variant="light"
                            size="sm"
                            className="position-absolute end-0 top-0 m-2 rounded-circle"
                            onClick={() => setShowGallery(false)}
                        >
                            <i className="feather-x"></i>
                        </Button>
                    </div>
                </Modal.Header>

                <Modal.Body className="post-modal-body px-3">
                    <Row className="g-3">
                        {data.photos?.map((photo, idx) => {
                            const imageUrl = BASE_URL + photo.source;
                            return (
                                <Col xs={3} key={idx} className="position-relative">
                                    <div
                                        className="post-image-card shadow rounded overflow-hidden"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleSelectImage(photo.source)}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`post-${idx}`}
                                            className="img-fluid w-100 h-100 object-fit-cover"
                                            style={{ aspectRatio: '1/1' }}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            className="position-absolute top-0 end-0 m-2"
                                            checked={selectedImages.includes(imageUrl)}
                                            style={{ color: '#8000ff' }}
                                            readOnly
                                        />
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>

                    <div className="text-center mt-4">
                        {selectedImages.length > 0 && (
                            <div className="mb-3 text-end fw-bold" style={{ color: '#8000ff' }}>
                                {selectedImages.length} image(s) selected
                            </div>
                        )}
                        <Button
                            className="post-action-button"
                            onClick={handleDownloadSelected}
                            disabled={selectedImages.length === 0 || downloading}
                        >
                            {downloading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Downloading...
                                </>
                            ) : (
                                'Download Selected'
                            )}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default PostDownloadButton;
