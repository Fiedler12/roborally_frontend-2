import {createContext} from "react";
import {Board} from "../types/Board";
import {Space} from "../types/Space";
import {Game} from "../types/Game";
import {Player} from "../types/Player";

export type GameContextType = {
    games : Game[],
    selectGame: (game : Game) => Promise<void>,
    unselectGame: () => Promise<void>,
    getGames : () => Promise<void>,
    loaded : boolean,
    board: Board,
    setCurrentPlayerOnSpace: (space: Space) => Promise<void>,
    switchCurrentPlayer: () => Promise<void>,
    createNewGame : (board: Board) => Promise<void>
    player  : Player,
    addPlayer : (boardId : number) => Promise<void>,
    removePlayer : (boardId : number, playerId : number) => Promise<void>,
    removeBoard : (boardID : number) => Promise<void>,
    setSpecificPlayerOnSpace : (boardId : number, playerId : number, space : Space) => Promise<void>,
}
//Define a new context of type GameContextType
//Below we define the "default" values which are set upon initialization of the context

const GameContext = createContext<GameContextType>({
    games : [],
    selectGame: async () => {},
    unselectGame: async () => {},
    getGames : async  () => {},
    addPlayer : async () => {},
    createNewGame : async () => {},
    removePlayer : async () => {},
    removeBoard : async  () => {},
    setSpecificPlayerOnSpace : async () => {},
    loaded : false,
    board: {
        playerDtos: [],
        spaceDtos: [],
        boardId: -1,
        boardName: "",
        currentPlayerDto: undefined,
        height: 0,
        width: 0
    },
    player : {
        boardId : -1,
        playerId : -1,
        playerName : "",
        playerColor: "red",

    },
    setCurrentPlayerOnSpace: async () => {},
    switchCurrentPlayer: async () => {}
});

export default GameContext