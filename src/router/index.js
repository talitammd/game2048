import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Box from "@/Box";
import Fail from "@/Fail";
import Success from "@/Success";
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
    },{
        path: '/success',
        element: <Success />
    }])
export default router;