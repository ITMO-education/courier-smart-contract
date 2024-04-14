import cls from './App.module.css'
import {TonConnectButton, useTonAddress} from "@tonconnect/ui-react";
import {RouterProvider} from "react-router-dom";
import {router} from "./router/Routing.tsx";

function App() {
    const tonAddress = useTonAddress()

    if (tonAddress === "") {
        return (<TonConnectButton/>);
    }

    return (
        <div className={cls.App}>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App
