import { Outlet } from 'react-router-dom';
import ProfileHeader from './Header/';
function ProfileOutlet() {
    return (
        <>   
            <ProfileHeader />
            <Outlet />
        </>
    );
}
export default ProfileOutlet;