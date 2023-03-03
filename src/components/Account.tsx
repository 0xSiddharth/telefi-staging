// import { useAccount, useEnsName } from 'wagmi'
import { SendTransaction } from '../components/SendTransaction'
import React, { useState, useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
 
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Container,
  SimpleGrid,
  useBreakpointValue,
  IconProps,
  Icon,
} from '@chakra-ui/react';

import truncateEthAddress from 'truncate-eth-address'


export function Account() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  // const { address } = useAccount()
  // const { data: ensName } = useEnsName({ address })
  const Telegram = window.Telegram.WebApp;
  const shortaddress = truncateEthAddress(address)
  
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
              Fi
            </Text>{' '}
            : Web3 Payments
          </Heading>
        </Stack>
      </Container>

    <Center py={6}>
      <Box
        maxW={'320px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}>
        <Avatar
          size={'xl'}
          src={ensAvatar}
          alt={'ENS Avatar'}
          mb={4}
          pos={'relative'}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: 'green.300',
            border: '2px solid white',
            rounded: 'full',
            pos: 'absolute',
            bottom: 0,
            right: 3,
          }}
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
        {ensName ? ensName : shortaddress}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          {`@${address}`}
        </Text>
        <Text
          textAlign={'center'}
          color={useColorModeValue('gray.700', 'gray.400')}
          px={3}>
          User Info Here 
        </Text>

        <Stack mt={8} direction={'row'} spacing={4}>
          <Button
            onClick={handleClick}
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            bg={'green.300'}
            color={'white'}
            boxShadow={
              '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
            }
            _hover={{
              bg: 'green.400',
            }}
            _focus={{
              bg: 'green.400',
            }}>
            Get Paid
          </Button>

          <Button
            onClick={(e) => {disconnect()}}
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            bg={'red.200'}
            >
            Disconnect
          </Button>
        </Stack>
      </Box>
    </Center>
    <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
  </Container> 
    )
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

// should we add window.close(); ? or window.location.href = "tg:resolve"; after get paid button press

  // return (
  //   <div>
  //     <div>
  //       {ensName ?? address}
  //       {ensName ? ` (${address})` : null}
  //     </div>
  //     <div>
  //         <button onClick={handleClick}>Share ${address} wallet to receive payments</button>

  //     </div>
  //   </div>
  // )

//   <div>
//   {/* <img src={ensAvatar} alt="ENS Avatar" /> */}
//   <div>{ensName ? `${ensName} (${address})` : address}</div>
//   <button onClick={handleClick}>Share ${address} wallet to receive payments</button>
//   <button onClick={(e) => {disconnect()}}>Disconnect</button>
// </div>