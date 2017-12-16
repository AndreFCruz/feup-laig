%% CONSTANTS

boardSize(9) :- !.
%boardSize(11) :- !.

winningStreakN(5).

changePlayer(black, white).
changePlayer(white, black).

%Gets the next Position in a board
getNextPosition(Row, Col, Row, NCol):-
	NCol is (Col + 1),
	boardSize(Size),
	NCol < Size.

getNextPosition(Row, _Col, NRow, 0):-
	NRow is (Row + 1).

%Returns the sum of all elements of a List of Values
sum_list(List, Sum):-
	sum_listAux(List, 0, Sum).
sum_listAux([Head | ResList], ItSum, Sum):-
	NewSum is (ItSum + Head),
	sum_listAux(ResList, NewSum, Sum).
sum_listAux([], Sum, Sum).

%Prints all boards in an array of boards
printAllBoards([]).
printAllBoards([Board | NextBoards]):-
	boardSize(Size),
	printBoard(Board, Size),
	printAllBoards(NextBoards).

%Concatenates a list of of integers into an integer
concat_numbers(IntList, Int):-
	reverse(IntList, RevList),
	concat_numbersAux(RevList, 1, Int), !.
concat_numbersAux([], _, 0).
concat_numbersAux([FirstInt | OtherInts], TenMulti, Int):-
	NewTenM is (TenMulti * 10),
	concat_numbersAux(OtherInts, NewTenM, TmpInt),
	Int is (TenMulti * FirstInt + TmpInt).


clearConsole:-
	clearConsole(60).
clearConsole(0).
clearConsole(N) :-
	nl, 
	N1 is N-1, 
	clearConsole(N1).

printBoardEval([Val, Board]) :-
	printBoard(Board), nl,
	write('Value: '), write(Val), nl.

