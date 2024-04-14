export interface Point{
    lon: bigint
    lat: bigint
}


interface TonPoint {
    lat: bigint
    lon: bigint
}
export function fromTonPoint({lat, lon}: TonPoint): Point{
    return {
        lat: lat,
        lon: lon,
    }
}
