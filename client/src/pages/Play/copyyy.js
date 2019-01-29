import React, { useState, useEffect, useRef } from "react";
import { API } from "aws-amplify";
import { Form, FormGroup, FormControl, ControlLabel, Button, Row, Col } from "react-bootstrap";
import CanvasDraw from "react-canvas-draw";
import Tappable from "react-tappable";
import LoadingButton from "../../components/LoadingButton";
import PlayerModal from "../../components/PlayerModal";
import Timer from "../../components/Timer";
import "./style.css";

export default function Play() {
    const [names, setNames] = useState([]);
    const [users, setUsers] = useState([]);
    let [searchName, setSearchName] = useState("");
    let [nextUser, setNextUser] = useState(null);
    let [isNextUser, setIsNextUser] = useState(false);
    const [showModal, setModal] = useState(false);
    const [modalName, setModalName] = useState("");
    let [numTurns, setNumTurns] = useState(0);
    let [games, setGames] = useState([]);
    let [myGo, setMyGo] = useState([]);
    let [yourGo, setYourGo] = useState([]);
    let [allGames, setAllGames] = useState([]);
    let [saveData, setSaveData] = useState("");
    let [currentGame, setCurrentGame] = useState(null);
    let [showPhoto, setShowPhoto] = useState(false);
    
    const playCanvasRef = useRef();

    function loadUsers() {
        return API.get("lyrebird", "/user");
    }

    function loadGames() {
        return API.get("lyrebird", "/game-user");
    }

    function loadGameData(id) {
        return API.get("lyrebird", "/game/" + id);
    }

    function getUser(id){
        return API.get("lyrebird", "/user/" + id);
    }

    function getGame(id) {
        return API.get("lyrebird", "/game/" + id); 
    }

    function getGameUser(id) {
        return API.get("lyrebird", "/game-user/" + id);
    }

    function createGame(game) {
        return API.post("lyrebird", "/game", {
        body: game
        });
    }

    function createGameUser(gameUser) {
        return API.post("lyrebird", "/game-user", {
            body: gameUser
        });
    }

    function createGameCollaborator(collaborator) {
        return API.post("lyrebird", "/game-user-1", {
            body: collaborator
        });
    }

    function updateGame(game, id) {
        return API.put("lyrebird", "/game/" + id, {
            body: game
        });
    }

    function updateGameUser(gameUser, id) {
        return API.put("lyrebird", "/game-user/" + id, {
            body: gameUser
        });
    }

    function updateGameUser1(gameUser, id) {
        return API.put("lyrebird", "/game-user-1/" + id, {
            body: gameUser
        });
    }

    async function getUsers() {
        const listUsers = await loadUsers();
        setUsers(listUsers);
        const userNames = listUsers.map(user => {
            return user.name;
        });
        setNames(userNames);
    }

    async function getGames() {
        const gamesList = await loadGames();
        setGames(gamesList);
        getGameData(gamesList);
        
    }

    async function getGameData(games) {
        let myTurn = [];
        let yourTurn = [];
        const promises = games.map(async (game) => {
            const result = await loadGameData(game.gameId);
            if (game.isTurn) {
                myTurn.push(result);
            } else {
                yourTurn.push(result);
            }
            return result;
        });
        const results = await Promise.all(promises);
        setAllGames(results);
        setMyGo(myTurn);
        setYourGo(yourTurn);
    }

    function handleChange(event) {
        setSearchName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let requestedName = "Sorry, no user found with the requested name.";
        users.forEach(user => {
            if (user.name === searchName) {
                setNextUser(user);
                requestedName = user.name
            }
        });
        handleModal(requestedName);
    }

    function handleModal(name) {
        setModalName(name);
        setModal(true);
    }

    function startGame() {
        setModal(false);
        setIsNextUser(true);
    }

    async function startSelectedGame(id) {
        console.log("GAME STARTED!");
        // get game data (canvas lines, numTurns)
        const thisGame = await getGame(id);
        // set current game
        setCurrentGame(thisGame);
        // set load data for the canvas
        setSaveData(thisGame.content.saveData);
        // set numTurns
        setNumTurns(thisGame.content.numTurns);
        // get game user data (isTurn, opponent)
        const thisGameUser = await getGameUser(id);
        // set nextUser
        const next = await getUser(thisGameUser.opponent);
        setNextUser(next);
        // set isNextUser
        setShowPhoto(true);
        setIsNextUser(true);
        showGame();
    }

    // use to show what the game looks like before beginning and 
    // also to show game after it is complete
    function showGame() {
        // use "showGame" boolean to show a page with just what the canvas looks like
        setTimeout(() => {
            setShowPhoto(false);
        }, 2000);
        console.log("GAME SHOWN!");
    }

    // 1.	create game in database (set numTurns, send data to table, get back gameId)
    // 2.	create game-user item in database for each player
    // 3.	alert next player
    // 4.	alert current player they have sent the game
    // 5.	reroute to play homepage (reset next user and isNextUser and searchName)
    async function saveGame() {
        let newGame;
        let turnCount = numTurns;
        setNumTurns(numTurns + 1)
        turnCount++;
        if (turnCount === 1) {
            try {
                newGame = await createGame({
                    content: {
                        saveData: playCanvasRef.current.getSaveData(),
                        numTurns: turnCount
                    },
                });
            } catch(error) {
                alert(error);
            }
            try {
                await createGameUser({
                    gameId: newGame.gameId,
                    isTurn: false,
                    opponent: nextUser.userId
                });
            } catch(error) {
                alert(error);
            }
            try {
                await createGameCollaborator({
                    userId: nextUser.userId,
                    gameId: newGame.gameId,
                    isTurn: true
                });
            } catch(error) {
                alert(error);
            }
        }
        if (turnCount > 1) {
            // update game so that the new saveData is from the combination of turns
            let newSaveData;
            let oldData = JSON.parse(saveData);
            console.log(saveData.lines);
            let thisData = JSON.parse(playCanvasRef.current.getSaveData());
            console.dir(oldData);
            console.dir(thisData);
            oldData.lines = oldData.lines.concat(thisData.lines);
            newSaveData = oldData;
            console.dir(newSaveData);
            try {
                await updateGame({
                    content: {
                        saveData: playCanvasRef.current.getSaveData(),
                        numTurns: turnCount
                    },
                }, currentGame.gameId);
            } catch (error) {
                alert(error);
            }
            // update game-user so that it is not the user's turn
            try {
                await updateGameUser({
                    isTurn: false
                }, currentGame.gameId)
            } catch(error) {
                alert(error);
            }
            // update game-user so that it is the opponent's turn
            try {
                await updateGameUser1({
                    userId: nextUser.userId,
                    isTurn: true
                }, currentGame.gameId)
            } catch(error) {
                alert(error);
            }
        }
        if(turnCount === 4) {
            alert("The game is complete!");
        } else {
            alert(`The game has been sent to ${nextUser.name}`);
        }
        setNextUser(null);
        setSearchName("");
        setIsNextUser(false);
        getGames();
    }

    useEffect(() => {
        getUsers();
        getGames();
    }, []);


    const search = (
        <div className="play">
        <h1>Start A New Game</h1>
        <p>Search for users by name and start a drawing game with them.</p>
        <Form inline onSubmit={handleSubmit} >
            <FormGroup controlId="searchName" bsSize="large">
                <ControlLabel>Search for a user by name: </ControlLabel>
                <FormControl
                autoFocus
                type="text"
                value={searchName}
                onChange={handleChange}
                />
            </FormGroup>
            <LoadingButton
                bsSize="large"
                disabled={!searchName}
                type="submit"
                // isLoading={isLoading}
                text="Search"
                loadingText="Searching…"
            />
        </Form>
        <h1>Your Games in Progress</h1>
        <Row className="game-container">
        <Col xs={12} md={6}>
        <h3>Your Turn:</h3>
        <div className="game-sub">
        {myGo.length ? (
            myGo.map(game =>{
                return(
                    game.content.numTurns < 4 &&
                    <div className="games">
                        <Tappable onTap={() => startSelectedGame(game.gameId)} >
                                <CanvasDraw canvasHeight={170} canvasWidth={170} disabled={true} saveData={game.content.saveData} immediateLoading={true} />
                        </Tappable>
                    </div>
                )
            })
        ) : (
            <p>No games to show :(</p>
        )
        }
        </div>
        </Col>
        <Col xs={12} md={6}>
        <h3>Their turn:</h3>
        <div className="game-sub">
        {yourGo.length ? (
            yourGo.map(game => {
                return(
                    game.content.numTurns < 4 &&
                    <div className="their-turn">
                        <CanvasDraw canvasHeight={170} canvasWidth={170} disabled={true} saveData={game.content.saveData} immediateLoading={true} />
                    </div>
                )
            })
        ) : (
            <p>No games to show :(</p>
        )
        }
        </div>
        </Col>
        </Row>
        <h1>Your Completed Games</h1>
        <Col xs={12}>
        <div className="game-sub">
        {allGames.length ? (
            allGames.map(game => {
                return(
                    game.content.numTurns === 4 && 
                    <div className="games">
                        <Tappable onTap={() => showGame(game.content.saveData)} >
                                <CanvasDraw canvasHeight={170} canvasWidth={170} disabled={true} saveData={game.content.saveData} immediateLoading={true} />
                        </Tappable>
                </div>
                )
            })
        ) : (
            <p>No games to show :(</p>
        )
        }
        </div>
        </Col>
        <PlayerModal 
                show={showModal} 
                onHide={() => setModal(false)} 
                searchName={searchName}
                setNextUser={setNextUser}
                modalName={modalName}
                startGame={startGame}
            />  
        </div>
    );

    const play = (
        <div>
            {showPhoto ? (
                <div>
                    <p>Here's what you've created so far:</p>
                    <div id="photo-canvas">
                        <CanvasDraw 
                        canvasWidth={600} 
                        canvasHeight={800} 
                        lazyRadius={1}
                        saveData={saveData}
                        />
                    </div>
                </div>
            ) : (
                <Row className="play">
                    <Col xs={12} md={4}>
                    <h1>PLAY</h1>
                    <p>You've got three minutes to draw something!</p>
                    <p>If you want to send early just click "Send Game"</p>
                    <Button onClick={() => saveGame()}>Send Game</Button>
                    <div id="timer">
                    <Timer saveGame={saveGame}/>
                    </div>
                    </Col>
                    <Col xs={12} md={8}>
                    <div id="play-canvas">
                        <CanvasDraw 
                        ref={playCanvasRef}
                        canvasWidth={600} 
                        canvasHeight={800} 
                        lazyRadius={1}
                        />
                    </div>

                    </Col>  
                </Row>
            )}
        </div>
    );  
    return(
        isNextUser ? play : search
    )
}