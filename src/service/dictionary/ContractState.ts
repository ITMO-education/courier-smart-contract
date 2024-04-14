
const m = new Map<bigint, string>()

m.set(1n, "Created")
m.set(2n, "Payed")
m.set(3n, "FoundCourier")
m.set(4n, "PickedUp")
m.set(5n, "Delivered")
m.set(6n, "CanceledByOwner")
m.set(7n, "CanceledByCourier")


export function GetStateName(state: bigint) :string {
    let stateName = m.get(state)
    stateName ??= "Unknown state"

    return stateName
}
