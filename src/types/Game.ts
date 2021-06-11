import {user} from "./user";

export type Game = {
    id : number
    players : user[]
    started : boolean
}