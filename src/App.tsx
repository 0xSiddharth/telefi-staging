import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'

import { Account } from './components'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <h1 style={{textAlign: "center"}}>Telfi Payments</h1>
      
      <div> 
      <Web3Button />
      </div>

      {isConnected && <Account />}
    </>
  )
}
