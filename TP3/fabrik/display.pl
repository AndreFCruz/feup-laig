% Dictionary for Board Elements
translate(none, 32). %Empty Cell
translate(black, 79). %Dark Pieces
translate(white, 88). %White Pieces
translate(worker, 9608). %Red Workers

currentSideDisplay(Side):-
        write('   *** '), write(Side), write(' turn! ***'), nl, nl.

% General PrintBoard
printBoard(Board):-
        boardSize(N),
        printBoard(Board, N), !.

% Board Printing - arguments: Board and Board size
printBoard(Board, N):-
        clearConsole,
        write('  '), printHorizontalLabel(N, N),
        printBoard(Board, N, 1), !.

printBoard([], N, _):-
        printRowDivider(N), nl.

printBoard([Line | Board], N, CurrentL):-
        printRowDivider(N),
        printDesignRow(N),
        printVerticalLabel(CurrentL),
        put_code(9474),
        printLine(Line),
        printDesignRow(N),
        NewL is (CurrentL + 1),
        printBoard(Board, N, NewL).

printLine([]):- nl.
printLine([Head | Tail]) :-
        translate(Head, Code),
        write('   '),
        put_code(Code),
        write('   '), put_code(9474),
        printLine(Tail).

%  AESTHETICS

printRowDivider(N):-
        write('  '),
        put_code(9532),
        printRowDividerRec(N).

printRowDividerRec(0) :- nl.
printRowDividerRec(N) :-
        put_code(9472), put_code(9472), put_code(9472), put_code(9472),
        put_code(9472), put_code(9472), put_code(9472), put_code(9532),
        N1 is (N-1),
        printRowDividerRec(N1).

printDesignRow(N):-
        write('  '),
        put_code(9474),
        printDesignRowRec(N).

printDesignRowRec(0) :- nl.
printDesignRowRec(N) :-
        write('       '), put_code(9474),
        N1 is (N-1),
        printDesignRowRec(N1).

%Dictionary for Labels
getLabel( 0, 'A').
getLabel( 1, 'B').
getLabel( 2, 'C').
getLabel( 3, 'D').
getLabel( 4, 'E').
getLabel( 5, 'F').
getLabel( 6, 'G').
getLabel( 7, 'H').
getLabel( 8, 'I').
getLabel( 9, 'J').
getLabel(10, 'K').
getLabel(11, 'L').
getLabel(_,_):-
        write('Error: Unrecognized Label.'), nl,
        fail.

printHorizontalLabel(0, _):- nl.
printHorizontalLabel(N, Total):-
        Pos is (Total-N),
        getLabel(Pos, L),
        write('    '), write(L), write('   '),
        N1 is (N-1),
        printHorizontalLabel(N1, Total).        

printVerticalLabel(CurrentL):-
        CurrentL < 10,
        write(CurrentL),
        write(' ').

printVerticalLabel(CurrentL):-
        write(CurrentL).


printFabrikTitle:-
        clearConsole,
        write('   *********************************'), nl,
        write('   *    __  __   __   __           *'), nl,
        write('   *   |_  |__| |__) |__| | |__/   *'), nl,
        write('   *   |   |  | |__) | \\  | |  \\   *'), nl,
        write('   *                               *'), nl,
        write('   *********************************'), nl, nl.

wonMsg(Side):-
        wonArtMsg(Side).

wonArtMsg(white):-
        write('   *****************************************************'), nl,
        write('   *                    ___   __                       *'), nl,
        write('   *   \\    /  |__|  |   |   |_     \\    /  |   |\\ |   *'), nl,
        write('   *    \\/\\/   |  |  |   |   |__     \\/\\/   |   | \\|   *'), nl,
        write('   *                                                   *'), nl,
        write('   *****************************************************'), nl, nl.

wonArtMsg(black):-
        write('   *****************************************************'), nl,
        write('   *   __         __    __                             *'), nl,
        write('   *  |__)  |    |__|  /    |__/     \\    /  |   |\\ |  *'), nl,
        write('   *  |__)  |__  |  |  \\__  |  \\      \\/\\/   |   | \\|  *'), nl,
        write('   *                                                   *'), nl,
        write('   *****************************************************'), nl, nl.