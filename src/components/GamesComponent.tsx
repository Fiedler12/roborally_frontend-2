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
        await createNewGame (board)
    }
    useEffect(() => {
        getGames().then(r => console.log("spillet hentet"))
    }, [])

        return (
            !loaded ?

                <div className={styles.box1}>
                    <h1 className={styles.header}>Roborally </h1>
                    <button onClick={onClickCreateBoard} className={styles.column}> Create game </button>
                    <div className={styles.dropdown}>
                        <button className={styles.dropbtn}>Player Amount</button>

                        <div className={styles.dropdowncontent}>
                            <a href="#">2</a>
                            <a href="#">3</a>
                            <a href="#">4</a>
                            <a href="#">5</a>
                            <a href="#">6</a>
                        </div>

                    {
                        games.map((game: Game, index: number) =>
                            <GameComponent key={"game" + index} game={game}/>
                        )
                    }
                    </div>
                </div>
                :
                <div/>

        )
}

export default GamesComponent
