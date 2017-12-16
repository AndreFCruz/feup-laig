:- include('board.pl').
:- include('display.pl').
:- include('utils.pl').
:- include('menus.pl').
:- include('input.pl').
:- include('ai.pl').
:- include('test.pl').
:- use_module(library(random)).


fabrik:-
	mainMenuHandler.

%Game Initialization - set Workers and choose who starts
initGame(Player1, Player2) :-
	genRowColFacts,
	boardSize(N), !,
	createBoard(B0, N), printBoard(B0),
	setFirstWorker(Player1, black, B0, B1), printBoard(B1),
	setFirstWorker(Player2, black, B1, B2), printBoard(B2),
	chooseStartingPlayer(Player1, Side), printBoard(B2), !,
	gameLoop(Player1, Player2, Side, B2).
%If somehting failed on initGame, return to Play Menu
initGame(_, _):-
	playMenuHandler.

%game Loop for Player 1
gameLoop(Player1Function, Player2Function, black, Board) :-
	boardIsNotFull(Board),
	call(Player1Function, black, Board, NewBoard), printBoard(NewBoard),
	decideNextStep(Player1Function, Player2Function, black, NewBoard), !.
%Player 1 could not place a piece, so he lost
gameLoop(_Player1Function, _Player2Function, black, _Board) :- victory(white), !.

%game Loop for Player 2
gameLoop(Player1Function, Player2Function, white, Board) :-
	boardIsNotFull(Board),
	call(Player2Function, white, Board, NewBoard), printBoard(NewBoard),
	decideNextStep(Player1Function, Player2Function, white, NewBoard), !.
%Player 2 could not place a piece, so he lost
gameLoop(_Player1Function, _Player2Function, white, _Board) :- victory(black), !.


%Decide If someone has won with N in a row, or if the game should progress
decideNextStep(_Player1Function, _Player2Function, Side, Board) :-
	gameIsWon(Side, Board), !,
	victory(Side).
decideNextStep(Player1Function, Player2Function, Side, Board) :-
	changePlayer(Side, NewSide), !,
	gameLoop(Player1Function, Player2Function, NewSide, Board).

%End game with victory of Side
victory(Side):-
	destroyRowColFacts, !,
	wonMsg(Side),
	getEnter, !.

%Executes a human Play, getting worker input and piece input
humanPlay(Side, Board, NewBoard) :-
	workerUpdate(Side, Board, TempBoard),
	printBoard(TempBoard),
	isPiecePlayPossible(TempBoard), !,
	pieceInput(Side, Side, TempBoard, NewBoard), !.

%Setting the First Workers on the Board - Game beggining
setFirstWorker('humanPlay', Side, Board, NewBoard) :-
	pieceInput(worker, Side, Board, NewBoard).
%For AI Functions
setFirstWorker(_, _Side, Board, NewBoard) :-
        boardSize(Size),
        random(0, Size, Row), random(0, Size, Col),
        setPiece(worker, Row, Col, Board, NewBoard).

%Choose the Player that starts putting pieces on the board
chooseStartingPlayer('humanPlay', Side) :-
        getFirstPlayer(Side), !.
chooseStartingPlayer(_, white). % always white - For AI functions 