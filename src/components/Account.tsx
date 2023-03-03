import { useAccount, useEnsName } from 'wagmi'
import { SendTransaction } from '../components/SendTransaction'
import React, { useState, useEffect } from 'react'


export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const Telegram = window.Telegram.WebApp;
  
  useEffect(() => {
      if (address !== undefined){
          Telegram.sendData(JSON.stringify({"hi":address}))
          console.log('Send Addy')
      }
  }, [address]);



  return (
    <div>
      {ensName ?? address}
      {ensName ? ` (${address})` : null}
    </div>
  )
}
