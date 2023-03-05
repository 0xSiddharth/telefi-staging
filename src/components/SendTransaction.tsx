import React, { useState } from 'react';
import { useDebounce } from 'use-debounce'
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  useDisconnect,
  useAccount,
} from 'wagmi'
import { utils } from 'ethers'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  Container,
  SimpleGrid,
  useBreakpointValue,
  IconProps,
  Icon,
  Link,
} from '@chakra-ui/react';



export const SendTransaction = () => {
  const url = new URL(window.location.href);
  console.log(url)

  const params = new URLSearchParams(url.search);

  const { address } = useAccount()

  let recipientAddress = params.get('toaddr');
  if (typeof recipientAddress !== 'string'){
    recipientAddress = ''
  }

  let sendValue = params.get('amount')
  if (typeof sendValue !== 'string'){
    sendValue = '1'
  }

  let sendValueFloat = parseFloat(sendValue.replace(/-/g, '.'));
  // console.log(num); // Output: 10.2030

  let senderAddress = address

  console.log(recipientAddress, sendValueFloat);

  let currency = 'ETH'
  
  let [debouncedTo] = useDebounce(recipientAddress, 500)
  const [debouncedAmount] = useDebounce(sendValue, 500)

  if (typeof debouncedTo !== "string"){
    debouncedTo = ''
  }

 
  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: sendValueFloat
      // value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  })
  const { data, sendTransaction } = useSendTransaction(config)

  const [loading, setLoading] = useState(false);

  const {isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      setLoading(false)
      console.log('Success', data)
    },
  })

  const { disconnect } = useDisconnect()


  return (
    
    <Container>
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
      </Container>

    <Flex
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Send Payment
        </Heading>
        <InputGroup>
          <InputLeftAddon children='To'/>
          <Input
            placeholder= {senderAddress}
            readOnly={true} />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children='Amount' />
          <Input
            placeholder= {sendValue}
            readOnly={true} />
             <InputRightAddon children={currency} />
        </InputGroup>
         <InputGroup>
          <InputLeftAddon children='From' />
          <Input
            placeholder= {recipientAddress}
            readOnly={true} />
        </InputGroup>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            onClick={(e) => {disconnect()}}
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Disconnect
          </Button>
          <Button
          onClick={(e) => {
            e.preventDefault()
            sendTransaction?.()
            setLoading(true);
          }}
            isLoading={loading}
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}>
            Submit
          </Button>
          {isSuccess && (
            <div>
              Successfully sent {sendValue} ether to {senderAddress}
              <div>
                <Link color='teal.500' href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</Link>
              </div>
            </div>
          )}
          {isError && (
            <div>
              ERROR sending ether to {senderAddress}
            </div>
          )}
        </Stack>
      </Stack>
    </Flex>
    <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
  </Container> 
  );
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

// export function SendTransaction() {
//   const [to, setTo] = React.useState('')
//   const [debouncedTo] = useDebounce(to, 500)
 
//   const [amount, setAmount] = React.useState('')
//   const [debouncedAmount] = useDebounce(amount, 500)
 
//   const { config } = usePrepareSendTransaction({
//     request: {
//       to: debouncedTo,
//       value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
//     },
//   })
//   const { data, sendTransaction } = useSendTransaction(config)
 
//   const { isLoading, isSuccess } = useWaitForTransaction({
//     hash: data?.hash,
//   })

//   const { disconnect } = useDisconnect()
 
//   return (
//   <div>
//     <form
//       onSubmit={(e) => {
//         e.preventDefault()
//         sendTransaction?.()
//       }}
//     >
//       <input
//         aria-label="Recipient"
//         onChange={(e) => setTo(e.target.value)}
//         placeholder="0xA0Cf…251e"
//         value={to}
//       />
//       <input
//         aria-label="Amount (ether)"
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="0.05"
//         value={amount}
//       />
//       <button disabled={isLoading || !sendTransaction || !to || !amount}>
//         {isLoading ? 'Sending...' : 'Send'}
//       </button>
//       {isSuccess && (
//         <div>
//           Successfully sent {amount} ether to {to}
//           <div>
//             <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
//           </div>
//         </div>
//       )}
//     </form>
    
//     <div>
//     <button onClick={(e) => {disconnect()}}>Disconnect</button>
//     </div>
    
//   </div>
//   )
// }





 
// export function SendTransaction() {
//   const [to, setTo] = React.useState('')
//   const [debouncedTo] = useDebounce(to, 500)
 
//   const [amount, setAmount] = React.useState('')
//   const [debouncedAmount] = useDebounce(amount, 500)
 
//   const { config } = usePrepareSendTransaction({
//     request: {
//       to: debouncedTo,
//       value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
//     },
//   })
//   const { data, sendTransaction } = useSendTransaction(config)
 
//   const { isLoading, isSuccess } = useWaitForTransaction({
//     hash: data?.hash,
//   })

//   const { disconnect } = useDisconnect()
 
//   return (
//   <div>
//     <form
//       onSubmit={(e) => {
//         e.preventDefault()
//         sendTransaction?.()
//       }}
//     >
//       <input
//         aria-label="Recipient"
//         onChange={(e) => setTo(e.target.value)}
//         placeholder="0xA0Cf…251e"
//         value={to}
//       />
//       <input
//         aria-label="Amount (ether)"
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="0.05"
//         value={amount}
//       />
//       <button disabled={isLoading || !sendTransaction || !to || !amount}>
//         {isLoading ? 'Sending...' : 'Send'}
//       </button>
//       {isSuccess && (
//         <div>
//           Successfully sent {amount} ether to {to}
//           <div>
//             <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
//           </div>
//         </div>
//       )}
//     </form>
    
//     <div>
//     <button onClick={(e) => {disconnect()}}>Disconnect</button>
//     </div>
    
//   </div>
//   )
// }