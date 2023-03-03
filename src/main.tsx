import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { App } from './App'
import { chains, client, walletConnectProjectId } from './wagmi'

import { ChakraProvider } from '@chakra-ui/react'

const ethereumClient = new EthereumClient(client, chains)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig client={client}>
        <App />
        <Web3Modal
          projectId={walletConnectProjectId}
          ethereumClient={ethereumClient}
        />
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>,
)
