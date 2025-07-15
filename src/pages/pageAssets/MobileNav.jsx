import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navStyle.css';
import { useAuth } from '../auth/AuthContext';
import home_icon from '../../assets/nav_icon/Home.svg';
import saved_icon from '../../assets/nav_icon/saved_icon.svg';
import chat_icon from '../../assets/nav_icon/chat_icon.svg';
import template_icon from '../../assets/nav_icon/template_icon.svg';
import default_profilePicture from '../../assets/avater_pix.avif';
function MobileNav() {
    const location = useLocation();
    const currentPath = location.pathname;
    const { user } = useAuth();
        const Default_user_image = user.user_picture || default_profilePicture;
    return (
        <div className="shadow-sm mobile_navbar_container">
            <div className="box rounded list-sideba">
                <ul className="side_bar_na p-0">
                    <Link
                        to="/"
                        className={currentPath === '/' ? 'active' : ''}
                    >
                        <img src={home_icon}  />
                        <span className="mobile_icon_name">Home</span>
                    </Link>

                    <Link
                        to="/explore"
                        className={currentPath === '/explore' ? 'active' : ''}
                    >
                        <img src={saved_icon}  />
                        <span className="mobile_icon_name">Explore</span>
                    </Link>

                    <Link
                        to="/chat"
                        className={currentPath === '/chat' ? 'active' : ''}
                    >
                         <img src={chat_icon}  />
                        <span className="mobile_icon_name">chat</span>
                    </Link>
                     <Link
                        to="/template"
                        className={currentPath === '/template' ? 'active' : ''}
                    >
                         <img src={template_icon}  />
                        <span className="mobile_icon_name">Templete</span>
                    </Link>

                    <Link
                        to={"/"+user.user_id}
                        className={currentPath.startsWith('/'+user.user_id) ? 'active' : ''}  >
                        <img style={{ width: '30px', height: '30px', filter:'none' }} className="img-profile rounded-circle " src={Default_user_image} alt="User Profile" />
                        <span className="mobile_icon_name">Account</span>
                    </Link>
                </ul>
            </div>
        </div>
    );
}

export default MobileNav;
