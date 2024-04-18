import {Point} from "@itmo-education/courier-smart-contract";
import {fromNano, toNano} from "@ton/core";


export interface TonPoint {
    lat: number
    lon: number
}

export function fromTonPoint({lat, lon}: Point): TonPoint{
    return {
        lat: Number(fromNano(lat)),
        lon: Number(fromNano(lon)),
    }
}

export function toTonPoint({lat, lon}: TonPoint): Point{
    return {
        $$type: 'Point',
        lat: toNano(lat),
        lon: toNano(lon),
    }
}
