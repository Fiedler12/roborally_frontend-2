import {FunctionComponent, useContext, useEffect, useState} from "react";
import GameContext from "../context/GameContext";
import {GameComponent} from "./Gamecomponent";
import {Game} from "../types/Game";
import GameApi from "../api/GameApi";
import styles from "../styling/GamesComponent.module.scss";


type GameComponentProps = {}

const GamesComponent: FunctionComponent<GameComponentProps> = () => {

    const {games, loaded, getGames, board, createNewGame} = useContext(GameContext)

    const onClickCreateBoard =async ()=> {
        board.boardId =-1
        let text = (document.getElementById("boardName") as HTMLInputElement).value;
        if (text != null) {
            board.boardName = text
            await createNewGame(board)
        }
    }
    useEffect(() => {
        getGames().then(r => console.log("spillet hentet"))
    }, [])

        return (
            !loaded ?

                <div className={styles.box1}>
                    <h1 className={styles.header}>Roborally </h1>
                    <input className={styles.color} placeholder={"Enter Board Name"} id={"boardName"}/>
                    <br/>
                    <br/>
                    <button onClick={onClickCreateBoard} className={styles.column}> Create game </button>
                    {
                        games.map((game: Game, index: number) =>
                            <GameComponent key={"game" + index} game={game}/>
                        )

                    }
                </div>
                :
                <div/>

        )
}

export default GamesComponent
