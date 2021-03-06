import axios from "axios";
import {Board} from "../types/Board";
import {Space} from "../types/Space";
import {Game} from "../types/Game";
import {Player} from "../types/Player";

class GameApi{
    private static instance : GameApi;
    private readonly BACKEND_URL = "http://localhost:8080"
    private constructor() {}

    public static getInstance():GameApi{
        if(!GameApi.instance){
            GameApi.instance = new GameApi();
        }
        return GameApi.instance;
    }

    public getBoard(boardId : number){
        return axios.get<Board>(`${this.BACKEND_URL}/board/${boardId}`).then(value =>value.data)
    }

    public moveCurrentPlayer(boardId : number, space : Space){
        return axios.put(`${this.BACKEND_URL}/board/${boardId}/move`,space)
    }

    public switchPlayer(boardId : number){
        return axios.put(`${this.BACKEND_URL}/board/${boardId}/switchplayer`)
    }
    public getGames(){
        return axios.get<Game[]>(`${this.BACKEND_URL}/games`).then(value => value.data)
    }

// her har vi en callback til backend med player som objeckt
    public addPlayer (boardId : number){
        return axios.post(`${this.BACKEND_URL}/board/${boardId}/player`)
    }
    public createNewGame (board : Board){
        return axios.post(`${this.BACKEND_URL}/board`, board)
    }

    public removeBoard (boardId : number) {
        return axios.put(`${this.BACKEND_URL}/deleteboard/${boardId}`)
    }

    public removePlayer (boardId : number, playerId : number) {
        return axios.put(`${this.BACKEND_URL}/deleteplayer/${boardId}/${playerId}`)
    }
}

export default GameApi.getInstance()