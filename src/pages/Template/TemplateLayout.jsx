import { Outlet } from "react-router-dom";

function TemplateLayout() {
    return ( <div>
        
        <Outlet/>
    </div> );
}

export default TemplateLayout;