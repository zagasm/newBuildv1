import React, { useState, useEffect } from 'react';
import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../pageAssets/rightNav';
import SuggestedFriends from '../../../component/Friends/suggestedFriends';
import { Form, Button, Alert, OverlayTrigger, Popover } from 'react-bootstrap';
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
import default_profilePicture from '../../../assets/avater_pix.avif';

function CreatePost() {
    const [textContent, setTextContent] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const maxImages = 6;
    const maxChars = 400;
    const [textExceedsLimit, setTextExceedsLimit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const Default_user_image = user.avatar || default_profilePicture;
    // API parameters
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(20);
    const [textColor, setTextColor] = useState('#003300');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [textAlign, setTextAlign] = useState('center');
    const [verticalAlign, setVerticalAlign] = useState('middle');
    const [isNSFW, setIsNSFW] = useState(false);
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [visibility, setVisibility] = useState(0); // 0 = everyone, 1 = followers, 2 = only me
    const [whoCanComment, setWhoCanComment] = useState(1); // 0 = everyone, 1 = followers, 2 = only me
    const { refreshPosts, addNewPost } = usePost();
    useEffect(() => {
        setTextExceedsLimit(textContent.length > maxChars);
    }, [textContent]);
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

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop
    });
    const removeImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!textContent.trim()) {
            setError('Text content is required for all posts');
            return;
        }
        if (textExceedsLimit) {
            setError(`Text exceeds the ${maxChars} character limit`);
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('text_content', textContent);
            const postType = images.length > 0 ? 'media' : 'text';
            formData.append('type', postType);
            // ... (other form data append operations remain the same)
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
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/meme/create`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );
            const data = response.data;
            if (data.status) {
                // Add the new post to the existing posts instead of refreshing
                addNewPost(data.data); // This is the key change
                showToast.info(data.message || "Post created successfully!");
                navigate("/");
                // Clear the form
                setTextContent('');
                setImages([]);
                setFontFamily('Arial');
                setFontSize(20);
                setTextColor('#003300');
                setBackgroundColor('#ffffff');
                setTextAlign('center');
                setVerticalAlign('middle');
            } else {
                showToast.error(data.message || "An error occurred. Please try again.");
                setError(data.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            console.error('Error submitting post:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            showToast.error(err.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const addEmoji = (emoji) => {
        setTextContent(prevText => prevText + emoji.native);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

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
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />
                <div className="offset-xl-3 offset-lg-1 offset-md-1 create-post-row">
                    {isLoading ? <PostShimmerLoader /> :
                        <main className="col col-xl-7 col-lg-8 col-md-12 col-sm-12 col-12 main-container main_container" style={{ paddingTop: '65px' }}>
                            <div className="car shadow-s p-4 rounded">
                                {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                                {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

                                <div className="post-creator-container">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="me-3">
                                            <img
                                                src={Default_user_image}
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                value={textContent}
                                                onChange={e => setTextContent(e.target.value)}
                                                placeholder="What's on your mind?"
                                                style={{
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    resize: 'none',
                                                    width: '100%',
                                                    padding: '12px',
                                                    fontSize: '16px',
                                                    minHeight: '100px',
                                                    marginBottom: '10px',
                                                    overflow: 'auto',
                                                    outline: 'none',
                                                    backgroundColor: backgroundColor,
                                                    color: textColor,
                                                    // textAlign: textAlign,
                                                    lineHeight: '1.5',
                                                    fontFamily: fontFamily,
                                                    fontSize: `${fontSize}px`
                                                }}
                                            />
                                            {textContent.length > 0 && <div className="d-flex justify-content-between m-0 p-0 mb-2">
                                                <small className={`text-${textExceedsLimit ? 'danger' : 'muted'}`}>
                                                    {textContent.length}/{maxChars} characters
                                                </small>
                                                {textExceedsLimit && (
                                                    <small className="text-danger">
                                                        Text exceeds limit
                                                    </small>
                                                )}
                                            </div>}
                                        </div>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="image-preview-container mb-3 p-3 bg-light rounded">
                                            <div className="d-flex flex-wrap gap-2">
                                                {images.map((file, index) => (
                                                    <div key={index} className="position-relative">
                                                        <img
                                                            src={file.preview}
                                                            alt={`preview-${index}`}
                                                            style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px'
                                                            }}
                                                        />
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
                                            </div>
                                        </div>
                                    )}

                                    <div className="privacy-settings mb-3">
                                        <div className="d-flex justify-content-left gap-4">
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

                                    <div className="post-footer border-top pt-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex">
                                                <OverlayTrigger
                                                    trigger="click"
                                                    placement="top"
                                                    show={showEmojiPicker}
                                                    onToggle={setShowEmojiPicker}
                                                    overlay={emojiPicker}
                                                    rootClose={false}
                                                >
                                                    <span className="me-4">
                                                        <i className="far fa-smile text-warning me-1"></i>
                                                    </span>
                                                </OverlayTrigger>
                                                <span
                                                    className="me-2"
                                                    onClick={() => document.getElementById('image-upload-input').click()}
                                                >
                                                    <i className="fas fa-image text-primary me-1"></i>
                                                </span>
                                                <input
                                                    {...getInputProps()}
                                                    id="image-upload-input"
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                            <div className="d-flex buttons gap-3">
                                                <button
                                                    className="template_button"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Posting...' : 'Create template'}
                                                </button>
                                                <button
                                                    className="post_button"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting || !textContent.trim()}
                                                >
                                                    {isSubmitting ? 'Posting...' : 'Post'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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