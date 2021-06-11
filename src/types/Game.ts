import {user} from "./user";

export type Game = {
    id : number
    name : string
    players : user[]
    started : boolean
}