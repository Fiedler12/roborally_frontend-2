import {FunctionComponent, useContext, useState} from "react";
import GameContext from "../context/GameContext";
import {Game} from "../types/Game";


export type GameComponentProps = {
    game : Game
}

export const GameComponent: FunctionComponent<GameComponentProps> = ({game}) => {
    const {selectGame} = useContext(GameContext)

    const onClickGame = async () => {
        selectGame(game)
    }

    return (
        <div onClick={onClickGame}>
            <h1>{game.id}: {game.name}:</h1>
            <ul>
                {game.players.map((user, index) => <li key={game.name}> {user.playerId} {user.playerName} </li>)}
            </ul>
        </div>
    )
}
