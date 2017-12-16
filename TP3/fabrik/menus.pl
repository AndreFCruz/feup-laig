% Main Menu

mainMenu:-
	printFabrikTitle,
	write('\t 1. Play'), nl,
	write('\t 2. Rules'), nl,
	write('\t 3. Exit'), nl, nl,
	write('Choose an option:'), nl.

playMenu:-
	printFabrikTitle,
	write('\t 1. MultiPlayer'), nl,
	write('\t 2. SinglePlayer'), nl,
	write('\t 3. AI VS AI'), nl,
	write('\t 4. Back'), nl, nl,
	write('Choose an option:'), nl.

aiMenu:-
	printFabrikTitle,
        write('Choose the AI difficulty:'), nl,
        write('\t1. Easy AI'), nl,
        write('\t2. Smart AI'), nl, nl,
        write('Choose an option: '), nl.

rules:-
	printFabrikTitle,
	write('RULES: '), nl,
	write('    Beggining:'), nl,
	write('\tBlack starts by placing one of the workers on any space. Then White places the'), nl, 
	write('\tother worker on an arbitrary empty space. '), nl,
	write('\tBlack decides on who goes first. This player must place a stone of his color'), nl, 
	write('\taccording to the rules described below.'), nl, nl,
	write('    Objective:'), nl,
	write('\tPlayers win by creating a line of (at least) 5 stones in their color, orthogonally'), nl,
	write('\tor diagonally. Players lose the game immediately if they cannot place neither of'), nl,
	write('\tthe two workers in such a way that a new stone can be entered.'), nl, nl,
	write('    Play:'), nl,
	write('\tEach turn players may take - this is optional - one of the worker figures and'), nl,
	write('\tplace it on another empty space. After that, they must enter one of their stones'), nl,
	write('\ton an intersection point of the two workers\' lines of sight. These lines radiate'), nl,
	write('\tfrom a worker\'s position in orthogonal and diagonal directions arbitrarily far'), nl,
	write('\tover empty spaces.'), nl,
	write('\tNote: In the special case where the two workers are located on the same orthogonal'), nl,
	write('\tor diagonal line, all empty spaces between them are considered intersection points'), nl, nl,
	write('\t\t\t\t   Source: https://spielstein.com/games/fabrik/rules'), nl, nl,
	getEnter.

%User choose between Playing, Exiting or checking the rules
mainMenuHandler:-
	mainMenu,
	getInt(Choice),
	mainMenuChoice(Choice), !.
mainMenuChoice(1):-
	playMenuHandler, !.
mainMenuChoice(2):-
	rules,
	mainMenuHandler, !.
mainMenuChoice(3).
mainMenuChoice(_):-
	unknownInput,
	mainMenuHandler, !.

%User chooses between PvP, PvAI, AIvAI
playMenuHandler:-
	playMenu,
	getInt(Choice),
	playMenuChoice(Choice), !.
playMenuChoice(1):-
	initGame(humanPlay, humanPlay), !,
	mainMenuHandler, !.
playMenuChoice(2):-
	aiMenuHandler(AI),
        initGame(humanPlay, AI), !,
        mainMenuHandler, !.
playMenuChoice(3):-
	aiMenuHandler(AI1),
	aiMenuHandler(AI2),
        initGame(AI1, AI2), !,
        mainMenuHandler, !.
playMenuChoice(4):-
	mainMenuHandler, !.
playMenuChoice(_):-
	unknownInput,
	playMenuHandler, !.

%User chooses the AI Difficulty
aiMenuHandler(AI):-
        aiMenu,
        getInt(Choice),
        aiMenuChoice(Choice, AI), !.
aiMenuChoice(1, 'getRandomPlay').
aiMenuChoice(2, 'getGreedyPlay').
aiMenuChoice(_, AI):-
	unknownInput,
	aiMenuHandler(AI), !.