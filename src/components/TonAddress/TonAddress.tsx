import cls from './StratchableAddress.module.css'
interface TonAddressProps {
    address: string
}
export function TonAddress({address}: TonAddressProps) {
    return (
        <div className={cls.AddressText}>
            {address}
        </div>
    )
}
