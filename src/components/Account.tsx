import { useAccount, useEnsName } from 'wagmi'
import { SendTransaction } from '../components/SendTransaction'
import React, { useState, useEffect } from 'react'


export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const Telegram = window.Telegram.WebApp;
  
  // useEffect(() => {
  //     if (address !== undefined){
  //         console.log('Send Addy')
  //     }
  // }, [address]);

  function handleClick(){
    if (address !== undefined){
      console.log('Send Addy')
      Telegram.sendData(JSON.stringify({"hi":address}))
      console.log('Button was clicked!');
    }
  }

  return (
    <div>
      <div>
        {ensName ?? address}
        {ensName ? ` (${address})` : null}
      </div>
      <div>
          <button onClick={handleClick}>Share ${address} wallet to receive payments</button>

      </div>
    </div>
  )
}
