import {user} from "./user";

export type Game = {
    name : string
    id : number
    users : user[]
    started : boolean
}