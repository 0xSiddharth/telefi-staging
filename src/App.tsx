import { Web3Button } from '@web3modal/react'
// import { useAccount } from 'wagmi'
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  SimpleGrid,
  useBreakpointValue,
  IconProps,
  Icon,
} from '@chakra-ui/react';


import { Account } from './components'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SendTransaction } from './components/SendTransaction'
import { Helmet } from 'react-helmet'
// import { useLocation, Router } from 'react-router-dom';
// import {
//   Switch,
//   Route,
//   BrowserRouter as Router,
//   // Redirect,
// } from 'react-router-dom'

declare global {
  interface Window {
    Telegram: any;
  }
}

// function MyComponent() {
//   const location = useLocation();
//   const pathname = location.pathname;

//   // rest of the component code
// }
// check to see if the requester wallet is provided 

export function App() {
  
  const { isConnected } = useAccount()
  const Telegram = window.Telegram.WebApp;
  
  const url = window.location.href;
  console.log(url)

  let RequestWallet = true;
  if (url.includes('send')) {
    const RequestWallet = false
    console.log('SENDING true')
  }

   
  // show either page for fullfilling a payment or sending a message request 
  if (isConnected && RequestWallet) {
    return (
      <div>
          <Helmet>
            <script src="https://telegram.org/js/telegram-web-app.js" type="text/javascript"/>
           </Helmet>
        {/* Transaction content goes here */}
        <SendTransaction />
      </div>
    )
  } else if (isConnected) {
    return (
      <div>
          <Helmet>
           <script src="https://telegram.org/js/telegram-web-app.js" type="text/javascript"/>
          </Helmet>
        {/* Account content goes here */}
        <Account />
      </div>
    )
  }
 
  return <div>{/* Connect wallet content goes here */}
  <Helmet>
    <script src="https://telegram.org/js/telegram-web-app.js" type="text/javascript"/>
  </Helmet>

  <Box position={'relative'}>
      <Container
        as={SimpleGrid}
        maxW={'7xl'}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}>
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
            Tele{''}
            <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text">
              Pay
            </Text>{' '}
            : Web3 Payments
          </Heading>
        </Stack>
        <Stack
          bg={'gray.50'}
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: 'lg' }}>
          <Stack spacing={4}>
            <Heading
              color={'gray.800'}
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
              Let's Connect Your Wallet 
              <Text
                as={'span'}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text">
                !
              </Text>
            </Heading>
          </Stack>
          <Box as={'form'} mt={10} >
            <Stack spacing={4} align={'center'}>
              <Web3Button />
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
    </Box>
  </div>
}

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};



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
