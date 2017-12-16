:- use_module(library(random)).
:- dynamic(validCoord/1).

% Defense factor in AI evaluation function
defenseFactor(Value, NewValue):-
	NewValue is (Value * 1).

%Destroy the board facts generated for every game
destroyRowColFacts:-
	retractall(validCoord(_)). 

% Possible values for Row and Col positions
genRowColFacts:-
	boardSize(N),
	genRowColFactsAux(0, N), !.

genRowColFactsAux(Current, Current).
genRowColFactsAux(Current, BoardSize) :-
	asserta(validCoord(Current)),
	NewValue is (Current + 1),
	genRowColFactsAux(NewValue, BoardSize).

% Used to backtrace over the possible positions
validCoordinates(RowChange, ColChange) :-
        validCoord(RowChange),
        validCoord(ColChange).

% returns a List containing all the possible Boards by moving the workers
getAllWorkerPermutations(Board, PossibleBoards) :-
	findBothWorkers(Board, Row1, Col1, Row2, Col2),
	getWorkerBoards(Board, Row1, Col1, PossibleBoards1),
	getWorkerBoards(Board, Row2, Col2, PossibleBoards2),
	union(PossibleBoards1, PossibleBoards2, PossibleBoards). % No duplicates

% All the boards obtained by moving a worker through a Board
getWorkerBoards(Board, Row, Col, ListOfBoards) :-
	findall(PossibleBoard, (validCoordinates(NewRow, NewCol), moveWorker(Board, Row, Col, NewRow, NewCol, PossibleBoard)), ListOfBoards), !.

% Get all the boards where a piece can go, given a List of Boards with different worker positions
getPieceBoards(Side, WorkerBoards, PossibleBoards) :-
	getPieceBoardsAux(Side, WorkerBoards, [], PossibleBoards).

getPieceBoardsAux(_, [], PossibleBoards, PossibleBoards) :- !.
getPieceBoardsAux(Side, [WorkerBoard | OtherBoards], SoFarBoards, PossibleBoards) :-
	findBothWorkers(WorkerBoard, Row1, Col1, Row2, Col2),
	getIntersections(WorkerBoard, Row1, Col1, Row2, Col2, IntersectionsList),
	genNewBoards(Side, WorkerBoard, IntersectionsList, [], NewBoards),
	append(NewBoards, SoFarBoards, UpdatedBoards), !,
	getPieceBoardsAux(Side, OtherBoards, UpdatedBoards, PossibleBoards).

% Generates all the boards associated to a certain board with fix workers.
% Boards with all the different places where the piece can be played
genNewBoards(_, _, [], AllBoards, AllBoards) :- !.
genNewBoards(Side, Board, [Intersec | OtherIntersec], FoundBoards, AllBoards) :-
	Intersec = [Row, Col],
	setPiece(Side, Row, Col, Board, TempBoard),
	append([TempBoard], FoundBoards, UpdatedBoards), !,
	genNewBoards(Side, Board, OtherIntersec, UpdatedBoards, AllBoards).

% Returns all the possible resulting boards, taking into account the move worker play and the set piece play
getPossibleBoards(Side, Board, PossibleBoards) :-
	getAllWorkerPermutations(Board, WorkerBoards), !,
	getPieceBoards(Side, WorkerBoards, PossibleBoards),
	length(PossibleBoards, Size),
	Size > 0. %If no board is created, game is Over


% Evaluates a board and returns the correspondent Value
evaluateBoard(Side, Board, BoardValue) :-
	horizontalEvaluation(Side, Board, HorizontalValue),
	verticalEvaluation(Side, Board, VerticalValue),
	diagonalEvaluation(Side, Board, DiagonalValue),
	defensiveEvaluation(Side, Board, DefensiveValue),
	BoardValue is (HorizontalValue + VerticalValue + DiagonalValue + DefensiveValue).

% Makes an Horizontal Evaluation of the given board
horizontalEvaluation(Side, Board, Value) :-
	horizontalEvaluationAux(Side, Board, 0 , Value), !.
horizontalEvaluationAux(_, [], FinalValue, FinalValue) :- !.
horizontalEvaluationAux(Side, [FirstRow | RestOfBoard], CurrentValue, FinalValue) :-
	horizontalRowEvaluation(Side, FirstRow, 0, 0, CurrentValue, LineFValue),
	horizontalEvaluationAux(Side, RestOfBoard, LineFValue, FinalValue).

horizontalRowEvaluation(_, [], _, _, LineFValue, LineFValue) :- !.
% Succession of Side Pieces
horizontalRowEvaluation(Side, [Side | OtherCols], Streak, _EnemyStreak, CurrentValue, LineFValue) :-
	NewStreak is (Streak + 1),
	NewValue is (CurrentValue + (NewStreak * NewStreak * NewStreak)),
	% neighborEnemyStreaks
	horizontalRowEvaluation(Side, OtherCols, NewStreak, 0, NewValue, LineFValue).
% Succession of Enemy Pieces
horizontalRowEvaluation(Side, [Col | OtherCols], _Streak, EnemyStreak, CurrentValue, LineFValue) :-
	changePlayer(Side, Enemy),
	Col = Enemy,
	NewEnemyStreak is (EnemyStreak + 1),
	NewValue is (CurrentValue - (NewEnemyStreak * NewEnemyStreak * NewEnemyStreak)),
	horizontalRowEvaluation(Side, OtherCols, 0, NewEnemyStreak, NewValue, LineFValue).
% When nor white nor black
horizontalRowEvaluation(Side, [_Col | OtherCols], _, _, CurrentValue, Value) :-
	horizontalRowEvaluation(Side, OtherCols, 0, 0, CurrentValue, Value).

% Makes a vertical Evaluation of the given board
verticalEvaluation(Side, Board, Value) :-
	transpose(Board, TransposedBoard),
	horizontalRowEvaluation(Side, TransposedBoard, 0, 0, 0, Value).

% Makes a diagonal Evaluation of the given board
diagonalEvaluation(Side, Board, Value) :-
	boardSize(BoardSize),
	diagonalEvaluationAux(Side, Board, 0, BoardSize, 0, Value).
diagonalEvaluationAux(_Side, _Board, BoardSize, BoardSize, FinalValue, FinalValue) :- !.
diagonalEvaluationAux(Side, Board, Col, BoardSize, CurrentValue, Value) :-
	BottomRow is (BoardSize - 1),
	ColWithoutMainDiag is (Col - 1),
	% One quarter of the diagonal lines: left-right, top-down
	diagonalLine(Side, Board, 0, Col, 1, 1, 0, 0, CurrentValue, DiagLine1Value),
	% One quarter of the diagonal lines: right-left, top-down
	diagonalLine(Side, Board, 0, ColWithoutMainDiag, 1, -1, 0, 0, DiagLine1Value, DiagLine2Value),
	% One quarter of the diagonal lines: left-right, down-top
	diagonalLine(Side, Board, BottomRow, Col, -1, 1, 0, 0, DiagLine2Value, DiagLine3Value),
	% One quarter of the diagonal lines: right-left, down-top
	diagonalLine(Side, Board, BottomRow, ColWithoutMainDiag, -1, -1, 0, 0, DiagLine3Value, DiagLine4Value),
	NewCol is (Col + 1),
	diagonalEvaluationAux(Side, Board, NewCol, BoardSize, DiagLine4Value, Value).

% Iterates thorugh the diagonal line, starting at [Row, Col] with the direction Vector [RowInc, ColInc], updating the line value
% Succession of Side Pieces
diagonalLine(Side, Board, Row, Col, RowInc, ColInc, Streak, _EnemyStreak, CurrentValue, FinalValue) :-
	getElement(Board, Row, Col, Side),
	NewRow is (Row + RowInc), NewCol is (Col + ColInc),
	NewStreak is (Streak + 1),
	NewValue is (CurrentValue + (NewStreak * NewStreak * NewStreak)),
	diagonalLine(Side, Board, NewRow, NewCol, RowInc, ColInc, NewStreak, 0, NewValue, FinalValue).
% Sucession of Enemy Pieces
diagonalLine(Side, Board, Row, Col, RowInc, ColInc, _Streak, EnemyStreak, CurrentValue, FinalValue) :-
	changePlayer(Side, Enemy),
	getElement(Board, Row, Col, Enemy),
	NewRow is (Row + RowInc), NewCol is (Col + ColInc),
	NewEStreak is (EnemyStreak + 1),
	NewValue is (CurrentValue - (NewEStreak * NewEStreak * NewEStreak)),
	diagonalLine(Side, Board, NewRow, NewCol, RowInc, ColInc, 0, NewEStreak, NewValue, FinalValue).
% When nor white nor black
diagonalLine(Side, Board, Row, Col, RowInc, ColInc, _Streak, _EnemyStreak, CurrentValue, FinalValue) :-
	getElement(Board, Row, Col, _),
	NewRow is (Row + RowInc), NewCol is (Col + ColInc),
	diagonalLine(Side, Board, NewRow, NewCol, RowInc, ColInc, 0, 0, CurrentValue, FinalValue).
% It only fails again if [Row, Col] out of board
diagonalLine(_Side, _Board, _Row, _Col, _RowInc, _ColInc, _Streak, _EnemyStreak, FinalValue, FinalValue) :- !.


defensiveEvaluation(Side, Board, Value) :-
	defensiveEvaluationRec(Side, Board, 0, 0, 0, Value).
% Piece is of type Side
defensiveEvaluationRec(Side, Board, Row, Col, CurrentValue, Value) :-
	getElement(Board, Row, Col, Side),
	updateDefenseValue(Side, Board, Row, Col, CurrentValue, UpdatedValue),
	getNextPosition(Row, Col, NewRow, NewCol),
	defensiveEvaluationRec(Side, Board, NewRow, NewCol, UpdatedValue, Value).
% Piece is not of type Side
defensiveEvaluationRec(Side, Board, Row, Col, CurrentValue, Value) :-
	getElement(Board, Row, Col, _),
	getNextPosition(Row, Col, NewRow, NewCol),
	defensiveEvaluationRec(Side, Board, NewRow, NewCol, CurrentValue, Value).
% Finished, accessed non-existent element - Finished Board
defensiveEvaluationRec(_, _, _, _, FinalValue, FinalValue) :- !.

% Evaluates Enemy Streaks near the given position
updateDefenseValue(Side, Board, Row, Col, CurrentValue, UpdatedValue) :-
	findall(LineValue, (validCoordinates(RChange,CChange), lineDefenseValue(Side, Board, Row, Col, RChange, CChange, 0, LineValue)), ListOfValues),
	append(ListOfValues, ListValues),
	sum_list(ListValues, Sum),
	UpdatedValue is (CurrentValue + Sum).

lineDefenseValue(Side, Board, Row, Col, RowChange, ColChange, Streak, Value) :-
	NewRow is Row + RowChange, NewCol is Col + ColChange,
	changePlayer(Side, Enemy),
        getElement(Board, NewRow, NewCol, Enemy), !,
        NewStreak is (Streak + 1),
        lineDefenseValue(Side, Board, NewRow, NewCol, RowChange, ColChange, NewStreak, OtherValues),
        TmpValue is (NewStreak * NewStreak * NewStreak),
        defenseFactor(TmpValue, PosValue),
        append([PosValue], OtherValues, Value).
lineDefenseValue(_Side, _Board, _Row, _Col, _RowChange, _ColChange, _Streak, _Value) :- !. % Needed?

% For-each function, TODO substitute if similar standard function is found
evaluateAllBoards(Side, [FirstBoard | OtherBoards], Result) :-
	evaluateBoard(Side, FirstBoard, FirstResult),
	evaluateAllBoards(Side, OtherBoards, TmpResult),
	append([FirstResult-FirstBoard], TmpResult, Result).
evaluateAllBoards(_, [], []).

getGreedyPlay(Side, CurrentBoard, Play) :-
	getPossibleBoards(Side, CurrentBoard, PossibleBoards),
	evaluateAllBoards(Side, PossibleBoards, GradedBoards),
	max_member(_Grade-Play, GradedBoards).

getRandomPlay(Side, CurrentBoard, Play) :-
	getPossibleBoards(Side, CurrentBoard, PossibleBoards),
	length(PossibleBoards, Len),
	Len1 is Len - 1,
	random(0, Len1, Idx),
	nth0(Idx, PossibleBoards, Play).
	
