import {FunctionComponent, useContext, useState} from "react";
import GameContext from "../context/GameContext";
import {Game} from "../types/Game";
import {inspect} from "util";
import styles from "../styling/GameComponent.module.scss";


export type GameComponentProps = {
    game : Game
}

export const GameComponent: FunctionComponent<GameComponentProps> = ({game}) => {
    const {selectGame, addPlayer} = useContext(GameContext)


    const onClickGame = async () => {
        selectGame(game)
    }
    const onClickAddPlayer =async () => {
        addPlayer(game.id)
    }

    return (
        <div className={styles.backgroundboard}>
            <div>
                <button onClick={onClickAddPlayer}> Add Player</button>
                <h1 onClick={onClickGame}className={styles.textcolor} >{game.id}: {game.name}:</h1>
                <ul className={styles.textcolor}>
                {game.users.map((user, index) => <li key={game.name}> {user.playerId} {user.playerName} </li>)}
            </ul>
        </div>
        </div>

    )
}
