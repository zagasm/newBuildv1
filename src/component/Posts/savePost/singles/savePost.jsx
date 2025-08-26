import React from 'react';
import logo from '../../../../assets/zagasm_logo.png'; // Adjust path based on actual file location
import default_profilePicture from '../../../../assets/avater_pix.avif';
import memeDemoPicture from '../../../../assets/high-angle-woman-holding-smartphone.jpg';
import { Link } from 'react-router-dom';
import SavePostViewPostTemplate from './savePostViewPostTemplate';
function SavePostComponent() {
    return (
       <div className='mb-5'>
         <SavePostViewPostTemplate />
       </div>
    );
}
export default SavePostComponent;
