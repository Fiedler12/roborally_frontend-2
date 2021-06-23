import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react"
import GameContext from "./GameContext"
import {Player} from "../types/Player";
import {Board} from "../types/Board";
import {Space} from "../types/Space";
import GameApi from "../api/GameApi";
import {Game} from "../types/Game";
import BoardComponent from "../components/BoardComponent";

type GameContextProviderPropsType = {
    children: ReactNode
}


const GameContextProvider = ({children}: GameContextProviderPropsType) => {
    const [game] = useState<Game[]>([])
    const [games, setGames] = useState<Game[]>([])
    const [loaded, setLoaded] = useState<boolean>(false)
    const [players, setPlayers] = useState<Player[]>([])
    const playerCount = useMemo(() => players.length, [players])
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
    const [currentPlayer, setCurrentPlayer] = useState<Player>({playerId : -1,playerColor:"red",boardId : -1,playerName : ""})
    const [spaces, setSpaces] = useState<Space[][]>([])
    const [width, setWidth] = useState<number>(8)
    const [height, setHeight] = useState<number>(8)
    const [gameId, setGameId] = useState<number>(0)
    const [gameName, setGameName] = useState<string>("Hi")

    //Define a function used to set a player ona  specific space
    const setPlayerOnSpace = useCallback(async (space: Space) => {
        //Check if space already has a player standing on it
        if (!space.playerId) {
            await GameApi.moveCurrentPlayer(gameId, {...space, playerId: currentPlayer.playerId}).then(() => {
                let tempSpaces = [...spaces] //Use spread operator to copy spaces array, needed for making immutable changes
                //See https://bit.ly/2My8Bfz, until the section about Immutable.js
                tempSpaces[space.x][space.y].playerId = currentPlayer.playerId //Set the player on the new space they clicked on

                if (currentPlayer.x !== undefined && currentPlayer.y !== undefined) { //If the player was standing on a space previously, remove them from that space
                    tempSpaces[currentPlayer.x][currentPlayer.y].playerId = undefined
                }
                setSpaces(tempSpaces)
                let tempPlayers = [...players]
                tempPlayers[currentPlayerIndex].x = space.x; //Update the players array to reflect the changes
                tempPlayers[currentPlayerIndex].y = space.y; //Update the players array to reflect the changes
                setPlayers(tempPlayers)
                setCurrentPlayer({...currentPlayer, x: space.x, y: space.y}) //Update current player

            }).catch(() => {
                console.error("Error while moving player")
            })

        }
    }, [currentPlayer, currentPlayerIndex, gameId, players, spaces])

    const getGames = useCallback(async () => {
        await GameApi.getGames().then((value)=>{
            setGames(value)
        }).catch(()=>console.error("Error while switching player"))

    }, [currentPlayerIndex, gameId, playerCount, players])

    const switchToNextPlayer = useCallback(async () => {
        await GameApi.switchPlayer(gameId).then(()=>{
            const newPlayerIndex = (currentPlayerIndex + 1) % playerCount
            console.log("old player index", currentPlayerIndex, "new player index", newPlayerIndex)
            setCurrentPlayer(players[newPlayerIndex])
            setCurrentPlayerIndex(newPlayerIndex)
        }).catch(()=>console.error("Error while switching player"))
        
    }, [currentPlayerIndex, gameId, playerCount, players])

    const board = useMemo<Board>(() => {
        return ({
            spaceDtos: spaces,
            playerDtos: players,
            currentPlayerDto: currentPlayer,
            currentPlayerIndex: currentPlayerIndex,
            width: width,
            height: height,
            boardName: gameName,
            boardId: gameId
        })
    }, [currentPlayer, currentPlayerIndex, gameId, gameName, height, players, spaces, width])

    const unselectGame = useCallback(async () => {
        setGameId(-1);
        setLoaded(false)
    }, [])

    const selectPlayerOnSpace = useCallback(async (space : Space) => {
    if (!space.playerId) {
    await GameApi.moveCurrentPlayer(gameId, {...space, playerId: currentPlayer.playerId}).then(() => {
        let tempSpaces = [...spaces]
        tempSpaces[space.x][space.y].playerId = currentPlayer.playerId
        if (currentPlayer.x !== undefined && currentPlayer.y !== undefined) {
            tempSpaces[currentPlayer.x][currentPlayer.y].playerId = undefined
        }
        setSpaces(tempSpaces)
        let tempPlayers = [...players]
        tempPlayers[currentPlayerIndex].x = space.x;
        tempPlayers[currentPlayerIndex].y = space.y;
        setPlayers(tempPlayers)
        setCurrentPlayer({...currentPlayer, x: space.x, y: space.y})

    }).catch((e) => {
        console.error("error" + e)
    })
    }
    }, [currentPlayer, currentPlayerIndex, gameId, players, spaces])


    const selectGame = useCallback(async (game: Game) => {
            GameApi.getBoard(game.id).then(board => {
                if (board.playerDtos.length > 0) {
                        setSpaces(board.spaceDtos)
                        setSpaces(board.spaceDtos)
                        setPlayers(board.playerDtos)
                        setWidth(board.width)
                        setHeight(board.height)
                        setGameId(board.boardId)
                        setGameName(board.boardName)
                        if (board.currentPlayerDto) {
                            setCurrentPlayer(board.currentPlayerDto)
                            board.playerDtos.forEach((player, index) => {
                                if(player.playerId === board.currentPlayerDto?.playerId) {
                                    setCurrentPlayerIndex(index)
                                }
                            })
                        }
                setLoaded(true)
                    }
            }).catch(() => {
            console.error("Error while fetching board from backend")
            })
    }, [])

    useEffect(() => {
        const interval = setInterval( async () => {
            if (loaded && gameId >= 0) {
                GameApi.getBoard(gameId).then(board => {
                    if (gameId === board.boardId) {
                        setSpaces(board.spaceDtos)
                        setPlayers(board.playerDtos)
                        setWidth(board.width)
                        setHeight(board.height)
                        setGameId(board.boardId)
                        setGameName(board.boardName)
                        if (board.currentPlayerDto) {
                            setCurrentPlayer(board.currentPlayerDto)
                            board.playerDtos.forEach((player, index) => {
                                if (player.playerId === board.currentPlayerDto?.playerId) {
                                    setCurrentPlayerIndex(index)
                                }
                            })
                        } else {
                            console.error("load outdated")
                        }
                    }
                }).catch(() => {
                    console.error("board could not be loaded")
                })
            } else {
                GameApi.getGames().then(games => {
                    setGames(games)
                }).catch(() => {
                    console.error("games could not be loaded")
                });
            }
        }, 5000)

            return () => clearInterval(interval)
    }, [loaded, gameId])

    //standard construction for player
const player= useMemo<Player>(()=>{
    return({
        boardId : -1,
        playerId : -1,
        playerName :"",
        playerColor : "red"
    })
},[])

    // funktion til at sende en player til backend.
    const addPlayer =useCallback(async (boardId : number) => {
        await GameApi.addPlayer(boardId).then(()=>{
            GameApi.getGames()
        }).catch(()=> console.error("error to create player"))
    },[])

    const createNewGame =useCallback(async (board : Board) => {
        await GameApi.createNewGame(board).then(()=>{
            GameApi.getGames()
        }).catch(() => console.error(("errer create new Game")))
    },[])

    const removePlayer =useCallback(async (boardId : number, playerId : number) => {
        await GameApi.removePlayer(boardId, playerId).then(() => {
            GameApi.getGames()
        }).catch(() => console.error(("Error deleting")))
    }, [])

    const removeBoard =useCallback(async (boardId : number) => {
        await GameApi.removeBoard(boardId).then(() => {
            GameApi.getGames()
        }).catch(() => console.error(("Error deleting")))
    }, [])

    return (
        <GameContext.Provider
            value={
                {
                    games : games,
                    loaded : loaded,
                    selectGame : selectGame,
                    board : board,
                    setCurrentPlayerOnSpace: setPlayerOnSpace,
                    switchCurrentPlayer : switchToNextPlayer,
                    getGames: getGames,
                    unselectGame: unselectGame,
                    player: player,
                    addPlayer : addPlayer,
                    createNewGame : createNewGame,
                    removePlayer : removePlayer,
                    removeBoard : removeBoard,
                }
            }>
            {children} {/*See: https://reactjs.org/docs/composition-vs-inheritance.html*/}
        </GameContext.Provider>
    )




}

export default GameContextProvider