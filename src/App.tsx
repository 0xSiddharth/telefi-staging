import { Web3Button } from '@web3modal/react'
// import { useAccount } from 'wagmi'

import { Account } from './components'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SendTransaction } from './components/SendTransaction'
import { Helmet } from 'react-helmet'
declare global {
  interface Window {
    Telegram: any;
  }
}
export function App() {
  const { isConnected } = useAccount()
  const Telegram = window.Telegram.WebApp;
 
  if (isConnected) {
    return (
      <div>
        {/* Account content goes here */}
        <Account />
        <SendTransaction />
      </div>
    )
  }

  function handleClick(){
    Telegram.sendData(JSON.stringify({"hi":"0xe83fa30A48CC2E00BD1F7b6a9a6C34741F1dF688"}))
    console.log('Button was clicked!');
  }
 
  return <div>{/* Connect wallet content goes here */}
  <Helmet>
    <script src="https://telegram.org/js/telegram-web-app.js" type="text/javascript"/>
  </Helmet>
  <button onClick={handleClick}>Send this address 0xe83fa30A48CC2E00BD1F7b6a9a6C34741F1dF688 Back to TG</button>
  <h1>wagmi + Web3Modal + Vite</h1>

  <Web3Button />
  
  </div>
}




// export function App() {
//   const { isConnected } = useAccount()

//   return (
//     <>
//       <h1>wagmi + Web3Modal + Vite</h1>

//       <Web3Button />

//       {isConnected && <Account />}
//     </>
//   )
// }
