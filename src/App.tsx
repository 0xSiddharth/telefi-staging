import { Web3Button } from '@web3modal/react'
// import { useAccount } from 'wagmi'

import { Account } from './components'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SendTransaction } from './components/SendTransaction'
import { Helmet } from 'react-helmet'

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
    Telegram.sendData(JSON.stringify({"hi":"hi"}))
    console.log('Button was clicked!');
  }
 
  return <div>{/* Connect wallet content goes here */}
  <Helmet>
    <script src="https://telegram.org/js/telegram-web-app.js" type="text/javascript"/>
  </Helmet>
  <button onClick={handleClick}>Send Data Back to TG</button>
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
