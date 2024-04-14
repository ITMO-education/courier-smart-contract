import ReactDOM from 'react-dom/client'
import './index.css'

import {TonConnectUIProvider} from '@tonconnect/ui-react';
import App from "./App.tsx";

const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <App/>
    </TonConnectUIProvider>,
)
