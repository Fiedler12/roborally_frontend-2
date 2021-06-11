import {FunctionComponent, useContext, useEffect, useState} from "react";
import GameContext from "../context/GameContext";
import {GameComponent} from "./Gamecomponent";
import {Game} from "../types/Game";


type GameComponentProps = {}

const GamesComponent: FunctionComponent<GameComponentProps> = () => {
    const {games, loaded, getGames} = useContext(GameContext)
    useEffect(() => {
        getGames().then(r => console.log("spillet hentet"))
    }, [])

    return(
        !loaded ?
            <div>
                {
                games.map((game:Game, index : number) =>
                <GameComponent key ={"game" + index} game={game}/>
                )
                }
            </div>
            :
            <div/>

    )
}

export default GamesComponent