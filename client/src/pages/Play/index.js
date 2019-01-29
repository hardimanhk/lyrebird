import React, { useState, useEffect, useRef } from "react";
import { API } from "aws-amplify";
import { Form, FormGroup, FormControl, ControlLabel, Button, Row, Col, Panel, Glyphicon } from "react-bootstrap";
import { Alert } from 'reactstrap';
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
    let [isLoading, setIsLoading] = useState(false);
    let [visible, setVisible] = useState(false);
    let [showAlert2, setShowAlert2] = useState(false);

    
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

    async function getUserName(id) {
        const userName = await getUser(id);
        return userName.name;
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
        setIsLoading(true);
        const listUsers = await loadUsers();
        setUsers(listUsers);
        console.log(listUsers);
        const userNames = listUsers.map(user => {
            return user.name;
        });
        setNames(userNames);
        setIsLoading(false);
    }

    async function getGames() {
        setIsLoading(true);
        const gamesList = await loadGames();
        setGames(gamesList);
        getGameData(gamesList);
        setIsLoading(false);
    }

    async function getGameData(games) {
        let myTurn = [];
        let yourTurn = [];
        const promises = games.map(async (game) => {
            const result = await loadGameData(game.gameId);
            const name = await getUserName(game.opponent);
            if (game.isTurn) {
                myTurn.push({
                    game: result,
                    name: name
                });
            } else {
                yourTurn.push({
                    game: result,
                    name: name
                });
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
        setIsLoading(true);
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
        setIsNextUser(true);
        showGame();
        setIsLoading(false);
    }

    // use to show what the game looks like before beginning and 
    // also to show game after it is complete
    function showGame() {
        setShowPhoto(true);
        // use "showGame" boolean to show a page with just what the canvas looks like
        setTimeout(() => {
            setShowPhoto(false);
        }, 4000);
        console.log("GAME SHOWN!");
    }

    // 1.	create game in database (set numTurns, send data to table, get back gameId)
    // 2.	create game-user item in database for each player
    // 3.	alert next player
    // 4.	alert current player they have sent the game
    // 5.	reroute to play homepage (reset next user and isNextUser and searchName)
    async function saveGame() {
        let thisData = JSON.parse(playCanvasRef.current.getSaveData());
        setIsLoading(true);
        let newGame;
        let turnCount = numTurns;
        setNumTurns(numTurns + 1)
        turnCount++;
        // const playDataToSave = JSON.parse(playCanvasRef.current.getSaveData());
        // console.log(playDataToSave.lines);
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
            console.dir(oldData.lines);
            console.dir(thisData.lines);
            oldData.lines = oldData.lines.concat(thisData.lines);
            newSaveData = JSON.stringify(oldData);
            console.dir(newSaveData);
            try {
                await updateGame({
                    content: {
                        saveData: newSaveData,
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
            setVisible(true);
            // alert("Something");
        } else {
            setShowAlert2(true);
            // alert("Something");
        }
        setNextUser(null);
        setSearchName("");
        setIsNextUser(false);
        getGames();
        setIsLoading(false);
    }

    function onDismiss() {
        setVisible(false);
        setShowAlert2(false);
    }

    function getTimeDif(createdAt) {
        let diff = Math.abs(new Date() - new Date(createdAt));
        let minutes = Math.floor((diff/1000)/60);
        return minutes;
    }

    useEffect(() => {
        getUsers();
        getGames();
    }, []);


    const search = (
        <div>
            {isLoading ? (
            <div className="loading"><Glyphicon glyph="refresh" className="spinning" /></div>
            ) : (
<div className="play">
        <Alert className="alert" color="info" isOpen={visible} toggle={onDismiss}>
            The game is complete!
        </Alert>
        <Alert className="alert" color="info" isOpen={showAlert2} toggle={onDismiss}>
            The game has been sent to your opponent!
        </Alert>
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
                    game.game.content.numTurns < 4 &&
                    <div className="my-turn">
                        <Tappable onTap={() => startSelectedGame(game.game.gameId)} >
                            <Panel bsStyle="success">
                                <Panel.Heading>
                                <Panel.Title componentClass="h3">Game with {game.name}</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>Started: {getTimeDif(game.game.createdAt)} minutes ago</Panel.Body>
                            </Panel>
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
                    game.game.content.numTurns < 4 &&
                    <div className="their-turn">
                        <Panel bsStyle="warning">
                            <Panel.Heading>
                            <Panel.Title componentClass="h3">Game with {game.name}</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>Started: {getTimeDif(game.game.createdAt)} minutes ago</Panel.Body>
                        </Panel>
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
        )}   
        </div>
    );

    const play = (
        <div>
            {isLoading ? (
                <div className="loading"><Glyphicon glyph="refresh" className="spinning" /></div>
            ) : (
                showPhoto ? (
                    <div className="show-photo">
                        <p>Here's what you've created so far:</p>
                        <div id="photo-canvas">
                            <CanvasDraw 
                            canvasWidth={600} 
                            canvasHeight={800} 
                            lazyRadius={1}
                            saveData={saveData}
                            immediateLoading={true} 
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
                        <Timer saveGame={saveGame} isNextUser={isNextUser}/>
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
                )
            )}
        </div>
    );  
    return(
        <div>
        {isNextUser ? play : search}
        </div>
    )
}