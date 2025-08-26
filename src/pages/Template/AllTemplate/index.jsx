import React, { useState, useEffect, useRef, useCallback } from 'react';
import SingleTemplateComponent from '../../../component/Template/singleTemplate';
import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../pageAssets/rightNav';
import SuggestedFriends from '../../../component/Friends/suggestedFriends';
import './templateSTyle.css';
import CreatePost from '../../post/createPost';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

export default function Templates() {
    const [CreatePostComponent, setCreatePostComponent] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();
    const postsPerPage = 8;
    const [externalData, SetexternalData] = useState([]);
    const [createType, SetcreateType] = useState(false);
    const scrollTimeoutRef = useRef(null); // throttle reference\\

    const [cursor, setCursor] = useState(null);
    useEffect(() => {
        if (!token) return;
        loadPosts(cursor);
    }, [token, cursor]);

    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => window.removeEventListener('scroll', throttledScroll);
    }, []);

    const fetchTemplates = async (cursor = null) => {
        if (!token) {
            // Try cache first
            const cachedData = localStorage.getItem('template_cache');
            if (cachedData) {
                console.warn('No token yet, loading templates from localStorage.');
                return JSON.parse(cachedData);
            }
            return null; // don't throw, just stop
        }
        try {
            if (!token) throw new Error('No authentication token available');
            setLoading(true);
            setError(null);
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            const params = {
                per_page: postsPerPage,
                ...(cursor && { cursor })
            };
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/template`,
                { params, ...config }
            );
            console.log('Templates fetched:', response);
            // Store data in localStorage cache
            localStorage.setItem('template_cache', JSON.stringify(response.data.data));
            return response.data.data;
        } catch (error) {
            console.error('Error fetching templates:', error);
            // Try loading from localStorage cache if available
            const cachedData = localStorage.getItem('template_cache');
            if (cachedData) {
                console.warn('Loading templates from localStorage cache due to error.');
                return JSON.parse(cachedData);
            }
            if (error.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
            } else {
                setError(error.response?.data?.message || 'Failed to load templates. Please try again.');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async (currentCursor) => {
        if (loading || !hasMore) return;
        try {
            const templatesData = await fetchTemplates(currentCursor);
            if (templatesData) {
                const newPosts = templatesData.data.map(template => ({
                    id: template.id,
                    image: template.media_path[0],
                    title: template.title,
                    background_color: template.background_color,
                    description: template.description,
                    authorName: `${template.user.first_name} ${template.user.last_name}`,
                    authorAvatar: template.user.meta_data.profile_picture || 'https://randomuser.me/api/portraits/men/32.jpg',
                    user_id: template.user.meta_data.user_id 
                }));

                setVisiblePosts(prev => [...prev, ...newPosts]);
                setHasMore(!!templatesData.next_page_url);
                setCursor(templatesData.next_cursor || null);
            }
        } catch { }
    };

    // Scroll check
    const throttledScroll = () => {
        if (scrollTimeoutRef.current) return;
        scrollTimeoutRef.current = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && hasMore) {
                setCursor(prev => prev); // triggers useEffect with same cursor -> load next
            }
            scrollTimeoutRef.current = null;
        }, 300);
    };

    function handleCreatePostComponent(status, data) {
        SetcreateType(status);
        SetexternalData(data);
        setCreatePostComponent(true);
    }
  
    function getNewTemplateData(newTemplate) {
        if (!newTemplate) return;

        const formattedTemplate = {
            id: newTemplate.id,
            image: `${newTemplate.media_path[0]}`,
            title: newTemplate.title,
            background_color: newTemplate.background_color,
            description: newTemplate.description,
            authorName: `${newTemplate.user.first_name} ${newTemplate.user.last_name}`,
            user_id: newTemplate.user.meta_data.user_id,
            authorAvatar: newTemplate.user?.meta_data?.profile_picture
                || 'https://randomuser.me/api/portraits/men/32.jpg',
            next_cursor: null, // because it’s just a new item
            hasMore: hasMore
        };

        // Add it to the top of the list
        setVisiblePosts(prev => [formattedTemplate, ...prev]);

        // Close the CreatePost component after saving
        setCreatePostComponent(false);
    }

    if (CreatePostComponent) {
        return <CreatePost reload={getNewTemplateData} createType={createType} externalData={externalData} viewTemplate={setCreatePostComponent} />

    }

    return (
        <div className="py-4">
            <div className="container-fluid p-0 template-card">
                <SideBarNav />
                <div className="ro offset-xl-2 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-11 col-lg-11 col-md-12 col-sm-12 col-12 main_container m-1 pt-5">
                        <div className="template-headSection pt-2 mb-5">
                            <div className='page_title'><h1>Template</h1></div>
                            <div>
                                <button
                                    onClick={() => handleCreatePostComponent('CreateTemplate', [])}
                                    style={{ background: 'rgba(238, 218, 251, 1)', fontWeight: '600' }}
                                >
                                    + Create a Template
                                </button>
                            </div>
                        </div>
                        <div className='row'>
                            <SingleTemplateComponent
                                handleCreatePostComponent={handleCreatePostComponent}
                                error={error}
                                visiblePosts={visiblePosts}
                                loading={loading}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
