import React, { useState, useEffect, useCallback } from 'react';
import SideBarNav from '../../pageAssets/sideBarNav';
import { Form, Button, Alert, OverlayTrigger, Popover, Card, Row, Col, ButtonGroup, Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreatePost.css';
import PostShimmerLoader from '../../../component/assets/Loader/creatPostLoader';
import { showToast } from '../../../component/ToastAlert';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../../component/Posts/PostContext/index.jsx';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import default_profilePicture from '../../../assets/avater_pix.webp';
import emoji_icon from '../../../assets/nav_icon/emoji_icon.png';
import watermarkLogo from '../../../assets/nav_icon/watermarkLogo.png';
function CreatePost({ createType, viewTemplate, externalData, reload }) {
    const [textContent, setTextContent] = useState(externalData && externalData.description ? externalData.description : '');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStylePanel, setShowStylePanel] = useState(false);
    const [activeTab, setActiveTab] = useState('textAndImage'); // 'textOnly' or 'textAndImage'
    const maxImages = createType === 'CreateTemplate' ? 1 : 50;
    const { user, token } = useAuth();
    const applyWatermark = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Load logo
                const logo = new Image();
                logo.src = watermarkLogo;

                logo.onload = () => {
                    const logoWidth = img.width * 0.3; // 30% of image width
                    const logoHeight = (logo.height / logo.width) * logoWidth;
                    // Center X
                    const x = (img.width - logoWidth) / 2;
                    // Center Y but move up (e.g., 10% of logoHeight higher)
                    const y = (img.height - logoHeight) / 2 - (logoHeight * 0.2);

                    ctx.globalAlpha = 0.3;
                    ctx.drawImage(logo, x, y, logoWidth, logoHeight);

                    canvas.toBlob((blob) => {
                        const watermarkedFile = new File([blob], file.name, { type: file.type });
                        watermarkedFile.preview = URL.createObjectURL(blob);
                        resolve(watermarkedFile);
                    }, file.type);
                };

            };
        });
    };
    let maxChars;
    switch (createType) {
        case 'CreateTemplate': maxChars = 50;
            break;
        case 'remixPost': maxChars = 400;
            break;
        default: maxChars = 400;
    }
    const [textExceedsLimit, setTextExceedsLimit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const Default_user_image = user.meta_data.profile_picture || default_profilePicture;
    // API parameters
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(15);
    const [textColor, setTextColor] = useState('#003300');
    const [backgroundColor, setBackgroundColor] = useState(externalData && externalData.title ? externalData.title : '#ffffff');
    const [textAlign, setTextAlign] = useState('left');
    const [verticalAlign, setVerticalAlign] = useState('middle');
    const [isNSFW, setIsNSFW] = useState(false);
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [visibility, setVisibility] = useState(0); // 0 = everyone, 1 = followers, 2 = only me
    const [whoCanComment, setWhoCanComment] = useState(0); // 0 = everyone, 1 = followers, 2 = only me
    const { refreshPosts, addNewPost } = usePost();
    const [fieldErrors, setFieldErrors] = useState({ textContent: false, images: false });
    // Template specific state
    // const [title, setTitle] = useState('');
    const [defaultText, setDefaultText] = useState([
        { text: "Top Caption", position: "top", font_size: 20, color: "#FFFFFF" },
        { text: "Bottom Caption", position: "bottom", font_size: 18, color: "#000000" }
    ]);
    // Font families array for dropdown
    const fontFamilies = [
        'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
        'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS',
        'Arial Black', 'Palatino', 'Garamond', 'Bookman', 'Avant Garde'
    ];
    // Predefined color palettes
    const colorPalettes = {
        text: ['#000000', '#333333', '#666666', '#999999', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#800000'],
        background: ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057', '#343A40', '#212529', '#FFE6E6', '#E6F3FF', '#E6FFE6', '#FFF0E6', '#F0E6FF']
    };
    useEffect(() => {
        setTextExceedsLimit(textContent.length > maxChars);
    }, [textContent, maxChars]);
    const [imageLoading, setImageLoading] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        if (createType === 'CreateTemplate' && images.length + acceptedFiles.length > 1) {
            setError('You can only upload one image for templates');
            setFieldErrors(prev => ({ ...prev, images: true }));
            return;
        }
        const totalImages = images.length + acceptedFiles.length;
        if (totalImages > maxImages) {
            setError(`You can only upload up to ${maxImages} images.`);
            setFieldErrors(prev => ({ ...prev, images: true }));
            return;
        }
        setImageLoading(true);
        Promise.all(acceptedFiles.map(file => applyWatermark(file)))
            .then((watermarkedFiles) => {
                setImages(prev => [...prev, ...watermarkedFiles]);
            })
            .finally(() => {
                setImageLoading(false);
            });
        setFieldErrors(prev => ({ ...prev, images: false }));
        setError('');
    }, [images.length, createType, maxImages]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop,
        maxFiles: maxImages,
        onDropRejected: (rejectedFiles) => {
            setError(`Some files were rejected. Please upload only images (max ${maxImages} files)`);
            setFieldErrors(prev => ({ ...prev, images: true }));
        }
    });
    const removeImage = useCallback((indexToRemove) => {
        setImages(prev => {
            const imageToRemove = prev[indexToRemove];
            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter((_, index) => index !== indexToRemove);
        });
        setFieldErrors(prev => ({ ...prev, images: false }));
        setError('');
    }, []);
    const validateForm = () => {
        let hasError = false;
        const newFieldErrors = {
            title: false,
            textContent: false,
            images: false
        };

        if (createType === 'CreateTemplate') {
            if (images.length !== 1) {
                setError('Exactly one image must be uploaded for a template.');
                newFieldErrors.images = true;
                hasError = true;
            }
            if (!textContent.trim()) {
                setError('Template description (text content) is required.');
                newFieldErrors.textContent = true;
                hasError = true;
            }
        } else {
            // For text-only posts, don't require images
            if (activeTab === 'textAndImage') {
                if (images.length > 0 && !textContent.trim()) {
                    setError('Please add a caption for the uploaded image(s).');
                    newFieldErrors.textContent = true;
                    hasError = true;
                }
                if (!textContent.trim() && images.length === 0) {
                    setError('Please enter text content or upload at least one image.');
                    newFieldErrors.textContent = true;
                    newFieldErrors.images = true;
                    hasError = true;
                }
            } else {
                // Text-only validation
                if (!textContent.trim()) {
                    setError('Please enter text content.');
                    newFieldErrors.textContent = true;
                    hasError = true;
                }
            }
        }

        if (textExceedsLimit) {
            setError(`Text exceeds the ${maxChars} character limit`);
            newFieldErrors.textContent = true;
            hasError = true;
        }

        setFieldErrors(newFieldErrors);
        return !hasError;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            if (createType === 'CreateTemplate') {
                await handleTemplateSubmit();
            } else {
                await handlePostSubmit();
            }
        } catch (err) {
            console.error('Error submitting:', err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to create. Please try again.';
            setError(errorMessage);
            showToast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handlePostSubmit = async () => {
        const formData = new FormData();
        formData.append('text_content', textContent);
        const postType = images.length > 0 ? 'media' : 'text';
        formData.append('type', postType);

        // Append images as media[] only if there are images
        images.forEach((img, index) => {
            formData.append('media[]', img);
        });

        // Append styling parameters
        formData.append('font_family', fontFamily);
        formData.append('font_size', fontSize);
        formData.append('text_color', textColor);
        formData.append('background_color', backgroundColor);
        formData.append('text_align', textAlign);
        formData.append('vertical_align', verticalAlign);
        formData.append('is_nsfw', isNSFW ? 1 : 0);
        formData.append('is_spoiler', isSpoiler ? 1 : 0);
        formData.append('visibility', visibility);
        formData.append('who_can_comment', whoCanComment);

        const template_id = externalData && externalData.id;
        const URL = createType === 'remixPost' ? `api/v1/meme/remix/${template_id}` : `api/v1/meme/create`;
        console.log('tokennn', token);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/${URL}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;
            // console.log(data);

            if (data.status) {
                addNewPost(data.data);
                showToast.success(data.message || "Post created successfully!");
                setSuccess(data.message || "Post created successfully!");
                navigate("/");
                resetForm();
            } else {
                throw new Error(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            throw error;
        }
    };
    const handleTemplateSubmit = async () => {
        const formData = new FormData();
        formData.append('title', 'title');
        formData.append('description', textContent);
        formData.append('default_text[]', JSON.stringify(defaultText));

        if (images.length > 0) {
            formData.append('media[]', images[0]);
        }

        formData.append('background_color', backgroundColor);
        formData.append('text_color', textColor);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/template/create`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;
            console.log(data);

            if (data.status) {
                showToast.success(data.message || "Template created successfully!");
                setSuccess(data.message || "Template created successfully!");
                viewTemplate(false);
                reload(data.data);
                navigate("/template");
                resetForm();
            } else {
                throw new Error(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    const resetForm = () => {
        setTextContent('');
        setImages([]);
        // setTitle('');
        setFontFamily('Arial');
        setFontSize(20);
        setTextColor('#003300');
        setBackgroundColor('#ffffff');
        setTextAlign('center');
        setVerticalAlign('middle');
        setError('');
        setSuccess('');
        setFieldErrors({
            textContent: false,
            images: false
        });
    };
    const addEmoji = (emoji) => {
        setTextContent(prevText => prevText + emoji.native);
    };
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (createType !== 'CreateTemplate' && createType !== 'remixPost') {
            setTextContent('');
            setImages([]);
            setError('');
            setSuccess('');
            setFieldErrors({
                textContent: false,
                images: false
            });
        }
    }, [activeTab]);
    const emojiPicker = (
        <Popover id="emoji-picker-popover" style={{ width: '350px', maxWidth: '100%' }}>
            <Popover.Body>
                <Picker
                    data={data}
                    onEmojiSelect={addEmoji}
                    theme="light"
                    previewPosition="none"
                    skinTonePosition="none"
                />
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="py-4" >
            <div className="container-fluid p-0" style={{ background: 'white' }}>
                <SideBarNav />
                <div className="offset-xl-3 offset-lg-1 offset-md-1 create-post-row">
                    {isLoading ? <>
                        <main className="col col-xl-11 col-lg-8 col-md-12 col-sm-12 col-12 main-container main_container" style={{ paddingTop: '65px' }}>
                            <div className="post-creator-container d-flex justify-content-center align-items-center" style={{height:'calc(100vh - 200px)'}}>
                                <Spinner animation="grow"  style={{color:'#8000FF'}} />
                            </div>
                        </main>
                    </> :
                        <main className="col col-xl-11 col-lg-8 col-md-12 col-sm-12 col-12 main-container main_container" style={{ paddingTop: '65px' }}>
                            {error && (
                                <Alert
                                    variant="danger"
                                    onClose={() => setError('')}
                                    dismissible
                                    className="mb-3"
                                >
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert
                                    variant="success"
                                    onClose={() => setSuccess('')}
                                    dismissible
                                    className="mb-3"
                                >
                                    {success}
                                </Alert>
                            )}
                            <div className="post-creator-container">
                                {createType !== 'CreateTemplate' && createType !== 'remixPost' ? (
                                    <div className="row mb-3">
                                        <div className="d-sm-flex d-sm-none col-md-none d-xl-none col-xl-6 col-lg-6 col-md-6 col-sm-12 d-flex justify-content-end">
                                            <div className="buttons pr-3 mb-3">
                                                <button
                                                    type="submit"
                                                    className="post_button p-4 pt-2 pb-2"
                                                    disabled={isSubmitting || textExceedsLimit}
                                                    onClick={handleSubmit}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
                                                            {'Posting...'}
                                                        </>
                                                    ) : 'Post'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                            <div className="tabs-container shadow-sm m-2 rounded ">
                                                <div className="btn-group w-100" role="group">
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        style={{ color: activeTab === 'textAndImage' ? 'rgba(143, 7, 231, 1)' : 'rgba(152, 152, 152, 1)', background: activeTab === 'textAndImage' ? 'rgba(244, 230, 253, 1)' : 'white' }}
                                                        onClick={() => setActiveTab('textAndImage')}
                                                    >
                                                        <i className="fas fa-image me-1"></i> Image & Text
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        style={{ color: activeTab === 'textOnly' ? 'rgba(143, 7, 231, 1)' : 'rgba(152, 152, 152, 1)', background: activeTab === 'textOnly' ? 'rgba(244, 230, 253, 1)' : 'white' }}

                                                        onClick={() => setActiveTab('textOnly')}
                                                    >
                                                        <i className="fas fa-font me-1"></i> Text Only
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-none d-sm-flex col-md-flex d-xl-flex col-xl-6 col-lg-6 col-md-6 col-sm-12 d-flex justify-content-end">
                                            <div className="buttons pr-3">
                                                <button
                                                    type="submit"
                                                    className="post_button "
                                                    disabled={isSubmitting || textExceedsLimit}
                                                    onClick={handleSubmit}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>
                                                            {'Posting...'}
                                                        </>
                                                    ) : 'Post'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="buttons d-flex gap-2 justify-content-end">
                                        {createType === 'CreateTemplate' ? (
                                            <div>
                                                <button
                                                    type="button"
                                                    className="template_button"
                                                    disabled={isSubmitting || textExceedsLimit || images.length === 0}
                                                    onClick={handleSubmit}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Creating Template...
                                                        </>
                                                    ) : 'Create Template'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => viewTemplate(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    type="submit"
                                                    className="post_button"
                                                    disabled={isSubmitting || textExceedsLimit}
                                                    onClick={handleSubmit}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            {createType === 'remixPost' ? 'Remixing...' : 'Posting...'}
                                                        </>
                                                    ) : createType === 'remixPost' ? 'Remix post' : 'Post'}
                                                </button>
                                                {createType === 'remixPost' && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => viewTemplate(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}


                                <div className="row">
                                    <div className={activeTab === 'textAndImage' ? '' : `col-xl-6 col-lg-6 col-sm-12`}>
                                        {(activeTab === 'textAndImage' || createType === 'CreateTemplate') && (
                                            <div className="row mt-4">
                                                {createType !== 'remixPost' && images.length == 0 && <div className="col-xl-5 col-lg-12 col-md-6 col-7 m-2 ">
                                                    <div  {...getRootProps()} style={{ fontSize: '18px', cursor: 'pointer' }} className='shadow-sm gap-3 p-4 mb-4 d-flex justify-content-center'>
                                                        <div className='d-flex gap-3 align-items-center'><i style={{ color: 'rgba(143, 7, 231, 1)' }} className='fa fa-camera'></i> Upload image</div>
                                                    </div>
                                                </div>}
                                            </div>)}
                                        <input {...getInputProps()} />
                                        {/* Image preview section - only show for textAndImage tab or templates */}
                                        {((activeTab === 'textAndImage' && images.length > 0) || (externalData && externalData.image) || createType === 'CreateTemplate') && (
                                            <div className={`image-preview-container mb-3 p-3 bg-ligh rounded ${fieldErrors.images ? 'border border-danger' : ''}`}>
                                                {fieldErrors.images && (
                                                    <div className="text-danger mb-2">
                                                        <small>{createType === 'CreateTemplate' ? 'Exactly one image is required' : 'At least one image is required'}</small>
                                                    </div>
                                                )}
                                                <div className="row">
                                                    {/* Show external data image if it exists */}
                                                    {externalData && externalData.image && (
                                                        <div className="position-relative col-xl-6 col-lg-6 col-sm-12 pb-3">
                                                            <img
                                                                src={externalData.image.startsWith('http') ?
                                                                    externalData.image :
                                                                    `${import.meta.env.VITE_API_URL}/${externalData.image}`}
                                                                alt="image-preview"
                                                                style={{
                                                                    width: createType == 'remixPost' || createType == 'CreateTemplate' ? '100%' : '100%',
                                                                    height: createType == 'remixPost' || createType == 'CreateTemplate' ? '100%' : '300px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px'
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Show uploaded images */}
                                                    {images.map((file, index) => (
                                                        <div key={`image-${index}-${file.name}`} className="position-relative col-xl-6 col-lg-6 col-sm-12 pb-3">
                                                            {imageLoading ? (
                                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '300px', border: '1px solid #eee', borderRadius: '8px' }}>
                                                                    <div className="spinner-border text-primary" role="status">
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={file.preview}
                                                                    alt={`preview-${index}`}
                                                                    style={{
                                                                        width: createType == 'remixPost' || createType == 'CreateTemplate' ? '100%' : '100%',
                                                                        height: createType == 'remixPost' || createType == 'CreateTemplate' ? '100%' : '300px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '8px'
                                                                    }}
                                                                />
                                                            )}
                                                            <button
                                                                className="btn btn-danger btn-sm rounded-circle"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '-5px',
                                                                    right: '-5px',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    padding: 0
                                                                }}
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {((createType != 'CreateTemplate' && createType != 'remixPost') && images.length < maxImages) && (
                                                        <div className="col-xl-4 col-lg-4 col-sm-12 pb-3" style={{
                                                            width: createType == 'remixPost' || createType == 'CreateTemplate' ? '100%' : '200px',
                                                            height: createType == 'remixPost' || createType == 'CreateTemplate' ? '100%' : '200px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px'
                                                        }}>
                                                            <div {...getRootProps()} style={{
                                                                fontSize: '15px',
                                                                cursor: 'pointer',
                                                                width: '100%',
                                                                height: '100%',
                                                                border: '2px dashed #ccc',
                                                                borderRadius: '8px'
                                                            }} className='shadow-sm d-flex align-items-center justify-content-center'>
                                                                <div className='text-center'>
                                                                    <i style={{ color: 'rgba(143, 7, 231, 1)' }} className='fa fa-camera fa-2x mb-2'></i>
                                                                    <div>Upload image</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}


                                        <div className="d-flex align-items-start mb-1 p-2">
                                            <div className="">
                                                <img
                                                    src={Default_user_image}
                                                    alt="Profile"
                                                    className="rounded-circle"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="flex-gro w-100 ">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={6}
                                                    value={textContent}
                                                    className={`${fieldErrors.textContent ? 'is-invalid' : ''}`}
                                                    onChange={e => setTextContent(e.target.value)}
                                                    placeholder={createType === 'CreateTemplate' ? "Enter template text" : "Write something funny"}
                                                    isInvalid={fieldErrors.textContent}
                                                    style={{
                                                        borderRadius: '8px',
                                                        resize: 'none',
                                                        width: '100%',
                                                        padding: '12px',
                                                        minHeight: '200px',
                                                        overflow: 'auto',
                                                        outline: 'none',
                                                        lineHeight: '1.5',
                                                        fontFamily: fontFamily,
                                                        display: 'flex',
                                                        alignItems: verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center',
                                                        border: 'none'
                                                    }}
                                                />
                                                {fieldErrors.textContent && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {createType === 'CreateTemplate'
                                                            ? 'Template description is required'
                                                            : 'Please enter text content or upload at least one image'}
                                                    </Form.Control.Feedback>
                                                )}
                                                {textContent.length > 0 && (
                                                    <div className="d-flex justify-content-between m-0 p-0 ">
                                                        <small className={`text-${textExceedsLimit ? 'danger' : 'muted'}`}>
                                                            {textContent.length}/{maxChars} characters
                                                        </small>
                                                        {textExceedsLimit && (
                                                            <small className="text-danger">
                                                                Text exceeds limit
                                                            </small>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="post-footer pt-3 p-2">
                                            <div className="d-flex gap-3">
                                                <OverlayTrigger
                                                    trigger="click"
                                                    placement="top"
                                                    overlay={emojiPicker}
                                                    show={showEmojiPicker}
                                                    onToggle={setShowEmojiPicker}
                                                    rootClose
                                                >
                                                    <span
                                                        style={{ fontSize: '25px', cursor: 'pointer' }}
                                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                    >
                                                        <img src={emoji_icon} alt="" />
                                                    </span>
                                                </OverlayTrigger>
                                            </div>
                                        </div>
                                    </div>
                                    {activeTab === 'textOnly' && textContent && <div className="col-xl-6 col-lg-6 col-sm-12">
                                        <div className='m-3'>
                                            <p><b>Meme preview</b></p>
                                            <div className="card "
                                                style={{
                                                    borderRadius: '8px',
                                                    resize: 'none',
                                                    width: '100%',
                                                    padding: '12px',
                                                    fontSize: `${fontSize}px`,
                                                    // minHeight: '100px',
                                                    marginBottom: '40px',
                                                    // overflow: 'auto',
                                                    outline: 'none',
                                                    backgroundColor: backgroundColor,
                                                    color: textColor,
                                                    textAlign: textAlign,
                                                    lineHeight: '1.5',
                                                    fontFamily: fontFamily,
                                                    display: 'flex',
                                                    wordWrap: 'break-word',    /* old standard */
                                                    overflowWrap: 'break-word',
                                                    alignItems: verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center',
                                                    border: 'none',
                                                    // width: '300px',
                                                    padding: '10px',
                                                    whiteSpace: 'normal',        /* allow wrapping */
                                                    wordBreak: 'break-all'
                                                }} >
                                                {textContent}
                                            </div>
                                        </div>
                                    </div>}
                                </div>

                                {activeTab === 'textOnly' && <div className='textStylingContainer pl-4'>
                                    {/* Style Panel Toggle Button */}
                                    {createType !== 'CreateTemplate' && (
                                        <div className="mb-3">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => setShowStylePanel(!showStylePanel)}
                                                className="style-panel-toggle"
                                            >
                                                <i className="fas fa-palette me-2"></i>
                                                {showStylePanel ? 'Hide' : 'Show'} Text Styling Options
                                            </Button>
                                        </div>
                                    )}
                                    {/* Enhanced Style Panel */}
                                    {showStylePanel && createType !== 'CreateTemplate' && (
                                        <Card className="style-panel mb-3">
                                            <Card.Header>
                                                <h6 className="mb-0">
                                                    <i className="fas fa-paint-brush me-2"></i>
                                                    Text Styling Options
                                                </h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    {/* Font Family */}
                                                    <Col md={6} className="mb-3">
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-font me-2"></i>Font Family
                                                        </Form.Label>
                                                        <Form.Select
                                                            value={fontFamily}
                                                            onChange={(e) => setFontFamily(e.target.value)}
                                                            className="font-selector"
                                                        >
                                                            {fontFamilies.map(font => (
                                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                                    {font}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>

                                                    {/* Font Size */}
                                                    <Col md={6} className="mb-3">
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-text-height me-2"></i>
                                                            Font Size: {fontSize}px
                                                        </Form.Label>
                                                        <Form.Range
                                                            min="12"
                                                            max="48"
                                                            value={fontSize}
                                                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                            className="font-size-slider"
                                                        />
                                                        <div className="d-flex justify-content-between">
                                                            <small className="text-muted">12px</small>
                                                            <small className="text-muted">48px</small>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    {/* Text Color */}
                                                    <Col md={6} className="mb-3">
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-tint me-2"></i>Text Color
                                                        </Form.Label>
                                                        <div className="color-picker-section">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <Form.Control
                                                                    type="color"
                                                                    value={textColor}
                                                                    onChange={(e) => setTextColor(e.target.value)}
                                                                    className="color-input me-2"
                                                                    style={{ width: '50px', height: '40px' }}
                                                                />
                                                                <Form.Control
                                                                    type="text"
                                                                    value={textColor}
                                                                    onChange={(e) => setTextColor(e.target.value)}
                                                                    className="color-hex-input"
                                                                    placeholder="#000000"
                                                                />
                                                            </div>
                                                            <div className="color-palette">
                                                                {colorPalettes.text.map(color => (
                                                                    <button
                                                                        key={color}
                                                                        type="button"
                                                                        className={`color-swatch ${textColor === color ? 'active' : ''}`}
                                                                        style={{ backgroundColor: color }}
                                                                        onClick={() => setTextColor(color)}
                                                                        title={color}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    {/* Background Color */}
                                                    <Col md={6} className="mb-3">
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-fill-drip me-2"></i>Background Color
                                                        </Form.Label>
                                                        <div className="color-picker-section">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <Form.Control
                                                                    type="color"
                                                                    value={backgroundColor}
                                                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                                                    className="color-input me-2"
                                                                    style={{ width: '50px', height: '40px' }}
                                                                />
                                                                <Form.Control
                                                                    type="text"
                                                                    value={backgroundColor}
                                                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                                                    className="color-hex-input"
                                                                    placeholder="#FFFFFF"
                                                                />
                                                            </div>
                                                            <div className="color-palette">
                                                                {colorPalettes.background.map(color => (
                                                                    <button
                                                                        key={color}
                                                                        type="button"
                                                                        className={`color-swatch ${backgroundColor === color ? 'active' : ''}`}
                                                                        style={{ backgroundColor: color }}
                                                                        onClick={() => setBackgroundColor(color)}
                                                                        title={color}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    {/* Text Alignment */}
                                                    <Col md={6} className="mb-3">
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-align-center me-2"></i>Text Alignment
                                                        </Form.Label>
                                                        <ButtonGroup className="w-100 alignment-buttons">
                                                            <Button
                                                                variant={textAlign === 'left' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setTextAlign('left')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-align-left"></i>
                                                            </Button>
                                                            <Button
                                                                variant={textAlign === 'center' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setTextAlign('center')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-align-center"> </i>
                                                            </Button>
                                                            <Button
                                                                variant={textAlign === 'right' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setTextAlign('right')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-align-right"></i>
                                                            </Button>
                                                            <Button
                                                                variant={textAlign === 'justify' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setTextAlign('justify')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-align-justify"></i>
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Col>

                                                    {/* Vertical Alignment */}
                                                    <Col md={6} className="mb-3">
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-arrows-alt-v me-2"></i>Vertical Alignment
                                                        </Form.Label>
                                                        <ButtonGroup className="w-100 alignment-buttons">
                                                            <Button
                                                                variant={verticalAlign === 'top' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setVerticalAlign('top')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-arrow-up"></i> Top
                                                            </Button>
                                                            <Button
                                                                variant={verticalAlign === 'middle' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setVerticalAlign('middle')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-minus"></i> Middle
                                                            </Button>
                                                            <Button
                                                                variant={verticalAlign === 'bottom' ? 'primary' : 'outline-primary'}
                                                                onClick={() => setVerticalAlign('bottom')}
                                                                size="sm"
                                                            >
                                                                <i className="fas fa-arrow-down"></i> Bottom
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Col>
                                                </Row>

                                                {/* Content Settings */}
                                                <Row>
                                                    <Col md={12}>
                                                        <Form.Label className="fw-bold">
                                                            <i className="fas fa-cog me-2"></i>Content Settings
                                                        </Form.Label>
                                                        <div className="d-flex gap-3">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="nsfw-check"
                                                                label="NSFW Content"
                                                                checked={isNSFW}
                                                                onChange={(e) => setIsNSFW(e.target.checked)}
                                                                className="content-checkbox"
                                                            />
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="spoiler-check"
                                                                label="Spoiler Alert"
                                                                checked={isSpoiler}
                                                                onChange={(e) => setIsSpoiler(e.target.checked)}
                                                                className="content-checkbox"
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </div>}
                                {createType !== 'CreateTemplate' && (
                                    <div className="privacy-settings mb-3 pl-2">
                                        <div className="d-flex justify-content-left align-items-center gap-4">
                                            <div className="dropdown">
                                                <button
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    id="privacyDropdown"
                                                    data-bs-toggle="dropdown"
                                                    onClick={() => setShowEmojiPicker(false)}
                                                >
                                                    <i className="fas fa-globe-americas me-1"></i> Who can view <br />
                                                    {visibility == 0 && 'Every one'}
                                                    {visibility == 1 && 'Followers'}
                                                    {visibility == 2 && 'Only me'}
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="privacyDropdown">
                                                    <li><button className="dropdown-item" onClick={() => setVisibility(0)}>Everyone</button></li>
                                                    <li><button className="dropdown-item" onClick={() => setVisibility(1)}>Followers</button></li>
                                                    <li><button className="dropdown-item" onClick={() => setVisibility(2)}>Only me</button></li>
                                                </ul>
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    id="commentDropdown"
                                                    data-bs-toggle="dropdown"
                                                    onClick={() => setShowEmojiPicker(false)}
                                                >
                                                    <i className="fas fa-comment me-1"></i> Who can comment? <br />
                                                    {whoCanComment == 0 && 'Everyone'}
                                                    {whoCanComment == 1 && 'Followers'}
                                                    {whoCanComment == 2 && 'Only me'}
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="commentDropdown">
                                                    <li><button className="dropdown-item" onClick={() => setWhoCanComment(0)}>Everyone</button></li>
                                                    <li><button className="dropdown-item" onClick={() => setWhoCanComment(1)}>Followers</button></li>
                                                    <li><button className="dropdown-item" onClick={() => setWhoCanComment(2)}>Only me</button></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </main>
                    }
                </div>
            </div>
        </div >
    );
}
export default CreatePost;