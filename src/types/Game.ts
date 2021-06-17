import {user} from "./user";

export type Game = {
    name : string
    id : number
    players : user[]
    started : boolean
}