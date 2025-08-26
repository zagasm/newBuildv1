import { useEffect, useState } from 'react';
import { FiSettings, FiMoreHorizontal } from 'react-icons/fi';
import default_profilePicture from '../../../../assets/avater_pix.webp';
import call from '../../../../assets/nav_icon/call.png';
import video from '../../../../assets/nav_icon/video.png';
import '../chatAreaStyling.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../pages/auth/AuthContext';
// import { useAuth } from '../../../auth/AuthContext';

function TopSection({ recipient_id }) {
    const { token,user } = useAuth();
    const [recipient, setRecipient] = useState(null);
    // console.log("Recipient ID:", recipient_id);
    useEffect(() => {
        if (!recipient_id || !token) return;

        const fetchRecipient = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/users/profile/${recipient_id}/${user.meta_data.user_id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );
                const data = await res.json();
                //    console.log("Response from recipient fetch:", res);
                if (res.status === 200 ) {
                    setRecipient(data.user);
                } else {
                    console.error('Unexpected API response', res.data);
                }
            } catch (error) {
                console.error('Error fetching recipient details:', error);
            }
        };

        fetchRecipient();
    }, [recipient_id, token]);

    return (
        <>
           {recipient && <div className="userDetails">
                <Link to={'/chat'} className="fa fa-angle-left mr-3"></Link>
                <img
                    className="userAvatar"
                    src={recipient?.meta_data?.profile_picture || default_profilePicture}
                    alt={recipient?.first_name || 'User'}
                />
                <div className="userText">
                    <div className="username">
                        {recipient
                            ? `${recipient.first_name} ${recipient.last_name}`
                            : 'Full Name'}
                    </div>
                    <div className="handle">
                        {recipient?.username
                            ? `@${recipient.username}`
                            : '@username'}
                    </div>
                </div>
            </div>}
        </>
    );
}

export default TopSection;
