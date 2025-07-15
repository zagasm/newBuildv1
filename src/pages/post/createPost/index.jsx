import React, { useState, useEffect } from 'react';
import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../pageAssets/rightNav';
import SuggestedFriends from '../../../component/Friends/suggestedFriends';
import { Tabs, Tab, Form, Button, Carousel, Alert, OverlayTrigger, Popover } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreatePost.css';
import PostShimmerLoader from '../../../component/assets/Loader/creatPostLoader';
import { showToast } from '../../../component/ToastAlert';
import { useAuth } from '../../auth/AuthContext';
import LoadingOverlay from '../../../component/assets/projectOverlay.jsx';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../../component/Posts/PostContext/index.jsx';

function CreatePost() {
    const [key, setKey] = useState('text');
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const maxImages = 6;
    const maxChars = 400;
    const [textBgColor, setTextBgColor] = useState('#8000FF');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [textExceedsLimit, setTextExceedsLimit] = useState(false);
    const [captionExceedsLimit, setCaptionExceedsLimit] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const { user } = useAuth();
    const { refreshPosts } = usePost();
    // 
    const navigate = useNavigate();
    // Color templates organized by category
    const colorTemplates = {
        primary: [
            '#8000FF', '#075E54', '#25D366', '#128C7E', '#673AB7', '#6A1B9A',
            '#0D47A1', '#03A9F4', '#00BCD4', '#212121'
        ],
        secondary: [
            '#F57C00', '#FFA726', '#FFEB3B', '#FFF59D', '#D32F2F', '#FF5252',
            '#FF7F7F', '#39FF14', '#E040FB', '#9C27B0', '#F8BBD0', '#E6E6FA'
        ],
        textColors: [
            '#FFFFFF', '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'
        ],
        pastel: [
            '#DCF8C6', '#F5F5DC', '#E1F5FE', '#D1FAE5', '#FDE68A', '#BFDBFE',
            '#FECACA', '#E9D5FF', '#F0F0F0', '#D1C4E9', '#FFCDD2', '#C8E6C9'
        ]
    };
    const gradientCombinations = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff8177 0%, #ff867a 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
        'linear-gradient(135deg, #3f51b1 0%, #5a55ae 100%)',
        'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
        'linear-gradient(135deg, #b8cbb8 0%, #b8cbb8 100%)'
    ];
    // Validate text length
    useEffect(() => {
        setTextExceedsLimit(text.length > maxChars);
    }, [text]);

    // Validate caption length
    useEffect(() => {
        setCaptionExceedsLimit(caption.length > maxChars);
    }, [caption]);

    const onDrop = acceptedFiles => {
        const totalImages = images.length + acceptedFiles.length;
        if (totalImages > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }
        const newImages = acceptedFiles.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        );
        setImages(prev => [...prev, ...newImages]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop
    });

    const removeImage = (indexToRemove) => {
        console.log('Removing image at index:', indexToRemove);
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleTabSwitch = (k) => {
        // Clear all inputs and messages when switching tabs
        setText('');
        setImages([]);
        setCaption('');
        setError('');
        setSuccess('');
        setTextExceedsLimit(false);
        setCaptionExceedsLimit(false);
        setKey(k);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate based on active tab
        if (key === 'text') {
            if (!text.trim()) {
                setError('Please enter some text for your post');
                return;
            }
            if (textExceedsLimit) {
                setError(`Text exceeds the ${maxChars} character limit`);
                return;
            }
        } else if (key === 'images') {
            if (!caption.trim()) {
                setError('Caption is required for image posts');
                return;
            }
            if (captionExceedsLimit) {
                setError(`Caption exceeds the ${maxChars} character limit`);
                return;
            }
            if (images.length === 0) {
                setError('Please upload at least one image');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            if (key === 'text') {
                formData.append('message', text);
                formData.append('background_color_code', encodeURIComponent(textBgColor) );
                formData.append('text_color_code', textColor);
                console.log(encodeURIComponent(textBgColor));
            } else {
                formData.append('photo_caption', caption);
                images.forEach((image, index) => {
                    console.log('Submitting images with caption:', image);
                    formData.append(`photos[` + index + `]`, image);
                });
            }
            formData.append('user_id', user?.user_id || '0');
            formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');

            // Replace with your actual API endpoint
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/includes/ajax/posts/app_post.php`,
                formData,
                {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            );
            const data = response.data;
            console.log('Response data:', data);
            if (data.success) {
                refreshPosts();
                navigate("/");
                showToast.info(data.message || "Registration successful!");
            } else {
                showToast.error(data.message || "An error occurred. Please try again.");
                setError(data.message || "An error occurred. Please try again.");
            }
            // Reset form
            if (key === 'text') {
                setText('');
            } else {
                setCaption('');
                setImages([]);
            }
        } catch (err) {
            console.error('Error submitting post:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            showToast.error(err.response?.data?.message || 'Failed to create post. Please try again.');
        }

        finally {
            setIsSubmitting(false);
        }
    };

    // Background color picker popover
    const bgColorPickerPopover = (
        <Popover id="bg-color-picker-popover">
            <Popover.Header as="h3">Choose Background</Popover.Header>
            <Popover.Body>
                <div className="mb-3">
                    <h6 className="mb-2">Gradient Backgrounds</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {gradientCombinations.map((gradient, idx) => (
                            <div
                                key={`gradient-${idx}`}
                                onClick={() => {
                                    setTextBgColor(gradient);
                                    setShowBgColorPicker(false);
                                }}
                                style={{
                                    background: gradient,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: textBgColor === gradient ? '2px solid #000' : '1px solid #ccc'
                                }}
                                title={gradient}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <h6 className="mb-2">Primary Colors</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {colorTemplates.primary.map((color, idx) => (
                            <div
                                key={`bg-primary-${idx}`}
                                onClick={() => {
                                    setTextBgColor(color);
                                    setShowBgColorPicker(false);
                                }}
                                style={{
                                    backgroundColor: color,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: textBgColor === color ? '2px solid #000' : '1px solid #ccc'
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <h6 className="mb-2">Secondary Colors</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {colorTemplates.secondary.map((color, idx) => (
                            <div
                                key={`bg-secondary-${idx}`}
                                onClick={() => {
                                    setTextBgColor(color);
                                    setShowBgColorPicker(false);
                                }}
                                style={{
                                    backgroundColor: color,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: textBgColor === color ? '2px solid #000' : '1px solid #ccc'
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <h6 className="mb-2">Pastel Colors</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {colorTemplates.pastel.map((color, idx) => (
                            <div
                                key={`bg-pastel-${idx}`}
                                onClick={() => {
                                    setTextBgColor(color);
                                    setShowBgColorPicker(false);
                                }}
                                style={{
                                    backgroundColor: color,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: textBgColor === color ? '2px solid #000' : '1px solid #ccc'
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );


    // Text color picker popover
    const textColorPickerPopover = (
        <Popover id="text-color-picker-popover">
            <Popover.Header as="h3">Choose Text Color</Popover.Header>
            <Popover.Body>
                <div className="mb-3">
                    <h6 className="mb-2">Standard Colors</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {colorTemplates.textColors.map((color, idx) => (
                            <div
                                key={`text-color-${idx}`}
                                onClick={() => {
                                    setTextColor(color);
                                    setShowTextColorPicker(false);
                                }}
                                style={{
                                    backgroundColor: color,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: textColor === color ? '2px solid #000' : '1px solid #ccc'
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <h6 className="mb-2">Custom Colors</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {colorTemplates.primary.map((color, idx) => (
                            <div
                                key={`text-primary-${idx}`}
                                onClick={() => {
                                    setTextColor(color);
                                    setShowTextColorPicker(false);
                                }}
                                style={{
                                    backgroundColor: color,
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    border: textColor === color ? '2px solid #000' : '1px solid #ccc'
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    //   return <LoadingOverlay/>;
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />

                <div className=" offset-xl-3 offset-lg-1 offset-md-1 create-post-row">
                    {isLoading ? <PostShimmerLoader /> : <main className="col col-xl-7 col-lg-8 col-md-12 col-sm-12 col-12 main-container main_container " style={{ paddingTop: '65px' }}>
                        {/* <div className="container my-4"> */}
                        <div className="car shadow-s p-4 rounde ">
                            <h5 className="mb-4" style={{ color: '#8000FF' }}>Create a Post</h5>

                            {/* Display success/error messages */}
                            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

                            <Tabs activeKey={key} onSelect={handleTabSwitch} className="mb-3">
                                <Tab eventKey="text" title="Text">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="postText">
                                            <Form.Label>Write your post</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={text}
                                                onChange={e => setText(e.target.value)}
                                                style={{
                                                    background: textBgColor, // Changed from backgroundColor to background
                                                    color: textColor,
                                                    borderBottom: textExceedsLimit ? '2px solid red' : '1px solid #ccc',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    textAlign: 'center',
                                                    fontSize: '16px',
                                                    fontWeight: 'bolder',
                                                    resize: 'none',
                                                    outline: 'none',
                                                    height: '200px',
                                                    paddingTop: '80px',
                                                    paddingBottom: '80px',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            />
                                            <div className="d-flex justify-content-between mt-1">
                                                <small className={`text-${textExceedsLimit ? 'danger' : 'muted'}`}>
                                                    {text.length}/{maxChars} characters
                                                </small>
                                                {textExceedsLimit && (
                                                    <small className="text-danger">
                                                        Text exceeds limit
                                                    </small>
                                                )}
                                            </div>
                                        </Form.Group>

                                        <div className="mb-3 mt-4">
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h6 className="mb-0 me-2">Background:</h6>
                                                        <div
                                                            style={{
                                                                backgroundColor: textBgColor,
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '5px',
                                                                border: '1px solid #ccc',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                                                        />
                                                        <span className="ms-2">{textBgColor}</span>
                                                    </div>

                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {colorTemplates.primary.slice(0, 5).map((color, idx) => (
                                                            <div
                                                                key={`bg-quick-${idx}`}
                                                                onClick={() => setTextBgColor(color)}
                                                                style={{
                                                                    backgroundColor: color,
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '5px',
                                                                    cursor: 'pointer',
                                                                    border: textBgColor === color ? '2px solid #000' : '1px solid #ccc'
                                                                }}
                                                                title={color}
                                                            />
                                                        ))}

                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement="top"
                                                            show={showBgColorPicker}
                                                            onToggle={setShowBgColorPicker}
                                                            overlay={bgColorPickerPopover}
                                                        >
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                className="d-flex align-items-center"
                                                            >
                                                                <i className="fas fa-palette me-2" />
                                                                More Colors
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <h6 className="mb-0 me-2">Text Color:</h6>
                                                        <div
                                                            style={{
                                                                backgroundColor: textColor,
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '5px',
                                                                border: '1px solid #ccc',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                                                        />
                                                        <span className="ms-2">{textColor}</span>
                                                    </div>

                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {colorTemplates.textColors.slice(0, 5).map((color, idx) => (
                                                            <div
                                                                key={`text-quick-${idx}`}
                                                                onClick={() => setTextColor(color)}
                                                                style={{
                                                                    backgroundColor: color,
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '5px',
                                                                    cursor: 'pointer',
                                                                    border: textColor === color ? '2px solid #000' : '1px solid #ccc'
                                                                }}
                                                                title={color}
                                                            />
                                                        ))}

                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement="top"
                                                            show={showTextColorPicker}
                                                            onToggle={setShowTextColorPicker}
                                                            overlay={textColorPickerPopover}
                                                        >
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                className="d-flex align-items-center"
                                                            >
                                                                <i className="fas fa-font me-2" />
                                                                More Colors
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="mt-3"
                                            disabled={isSubmitting}
                                            style={{ background: '#8F07E7', float: 'right', border: 'none' }}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Post'}
                                        </Button>
                                    </Form>
                                </Tab>
                                <Tab eventKey="images" title="Images">
                                    <Form.Group className="mt-3 mb-0" controlId="imageCaption">
                                        <textarea
                                            placeholder="Enter caption for the post (required)"
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            style={{
                                                width: '100%',
                                                marginBottom: '10px',
                                                MinHeight: '100px',
                                                border: captionExceedsLimit ? '2px solid red' : 'none',
                                                borderRadius: 'none',
                                                padding: '10px',
                                                resize: 'none',
                                                outline: 'none'
                                            }}
                                        ></textarea>
                                        {caption.length > 0 && <div className="d-flex justify-content-between m-0 p-0 mb-2">
                                            <small className={`text-${captionExceedsLimit ? 'danger' : 'muted'}`}>
                                                {caption.length}/{maxChars} characters
                                            </small>
                                            {captionExceedsLimit && (
                                                <small className="text-danger">
                                                    Caption exceeds limit
                                                </small>
                                            )}
                                        </div>}
                                    </Form.Group>
                                    {/* // Replace the existing dropzone section in your code with this: */}
                                    <div onClick={() => document.getElementById('image-upload-input').click()} className="mt-3 mb-4 text-center d-flex img_upload_container">
                                        <input
                                            {...getInputProps()}
                                            id="image-upload-input"
                                            style={{ display: 'none' }}
                                        />
                                        <div

                                            style={{
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                                padding: '10px',
                                                borderRadius: '50%',
                                                transition: 'background-color 0.3s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <i className="fas fa-image fa-2x" style={{ color: '#8000FF' }}></i>
                                        </div>
                                        <p className="mt-3 small  ">
                                            Click to upload images (max {maxImages})
                                        </p>
                                    </div>
                                    {images.length > 0 && (
                                        <div className="mt-4 position-relative bg-dark">
                                            <Carousel
                                                interval={null}
                                                indicators={false} // This removes the pagination indicators
                                                prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
                                                nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
                                                controls={images.length > 1} // Only show controls if more than one image
                                            >
                                                {[...images].reverse().map((file, index) => (
                                                    <Carousel.Item key={index}>
                                                        <div className="position-relative text-center ">
                                                            <img
                                                                src={file.preview}
                                                                alt={`preview-${index}`}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '300px',
                                                                    objectFit: 'contain',
                                                                    backgroundColor: 'black',
                                                                    borderRadius: '8px',
                                                                    pointerEvents: 'none'
                                                                }}
                                                            />

                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '10px',
                                                                    right: '10px',
                                                                    zIndex: 1050,
                                                                    pointerEvents: 'auto'
                                                                }}
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                &times;
                                                            </Button>
                                                        </div>
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        </div>
                                    )}
                                    {images.length >= maxImages && (
                                        <p className="text-danger mt-2">You can only upload up to {maxImages} images.</p>
                                    )}
                                    <Button
                                        type="submit"
                                        className="mt-3"
                                        style={{ background: '#8F07E7', float: 'right', border: 'none' }}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Post'}
                                    </Button>
                                </Tab>
                            </Tabs>
                        </div>
                        {/* </div> */}
                    </main>}
                    <RightBarComponent>
                        <SuggestedFriends />
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;