import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  return (
    <div>
      <p>
      {ensName ?? address}
      {ensName ? ` (${address})` : null}
       is now Connected 🟢.  Please return to Telegram!
      </p>
    </div>
  )
}
