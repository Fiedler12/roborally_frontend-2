import {FunctionComponent, useContext, useState} from "react";
import GameContext from "../context/GameContext";
import {Game} from "../types/Game";
import {inspect} from "util";
import styles from "../styling/GameComponent.module.scss";
import {UserInfo} from "os";


export type GameComponentProps = {
    game : Game
}

export const GameComponent: FunctionComponent<GameComponentProps> = ({game}) => {
    const {selectGame, addPlayer, removePlayer, removeBoard} = useContext(GameContext)

    const onClickDeleteGame = async () => {
        removeBoard(game.id)
    }
    const onClickGame = async () => {
        selectGame(game)
    }
    const onClickAddPlayer = async () => {
        addPlayer(game.id)
    }
    const playAsPlayer = async (playerId : number) => {
        removePlayer(game.id, playerId)
    }

    return (
        <div className={styles.backgroundboard}>
            <div>
                <button onClick={onClickDeleteGame}> Delete Board</button>
                <button onClick={onClickAddPlayer}> Add Player</button>

                <h1 onClick={onClickGame} className={styles.textcolor}>{game.name}:</h1>
                <ul className={styles.textcolor}>
                    <p>Select a player</p>
                    {game.users.map((user, index) => <button key={index}
                                                             onClick={() => playAsPlayer(user.playerId)}>
                        {user.playerName}
                        <br/>
                    </button>)}
                    </ul>
            </div>
        </div>
    )
}