import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Box from "@/Box";
import Fail from "@/Fail";
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    }, {
        path: '/2048',
        element: <Box />,
        errorElement:<Fail />
    },{
        path: '/fail',
        element: <Fail />
    }])
export default router;