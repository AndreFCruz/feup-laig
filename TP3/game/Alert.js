/**
 * A class responsible for showing user game related messages, usign sweetalert2
 */
class Alert {
    
    /**
     * Constructor for the alerts class
     *
     * @param {Object} game - The alerts the game are going to be used in
     * @constructor
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Show a sweetalert to choose the player initiating
     * 
     * @param {Number} playerState1 - The next state, case player 1 is chosen
     * @param {Number} playerState2 - The next state, case player 2 is chosen
     * @return {Number} - The starting player
     */
    chooseFirstPlayer(playerState1, playerState2) {
        swal({
            title: 'Who starts playing?',
            type: 'question',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: '#248f24',
            confirmButtonText: 'Player 1',
            cancelButtonColor: '#248f24',
            cancelButtonText: 'Player 2',
        }).then((result) => {
            if (result.value || result.dismiss === 'overlay') {
                this.game.currentPlayer = 1;
                this.game.setCurrentState(playerState1);
                swal(
                    'Player 1 starts playing', '',
                    'success'
                );
            } else if (result.dismiss === 'cancel') {
                this.game.currentPlayer = 2;
                this.game.setCurrentState(playerState2);
                swal(
                    'Player 2 starts playing', '',
                    'success'
                );
            }
            // For forcing board dependent States
            this.game.forceStates();
        });
    }

    /**
     * Show a sweetalert to show who won the game
     * 
     * @param {String} str - string in format 'victory Side', sent from PLOG
     * @return {null}
     */
    showWinner(str) {
        let msg = str.split(" ");
        if (msg[0] == 'victory') {
            let winner = (msg[1] == PLAYER1_SIDE ? 1 : 2);
            swal( 
                'Player ' + winner + ' wins!',
                'Congratulations!',
                'success'
            ).then((result) => {
                if (result.value || result.dismiss === 'overlay') {
                    swal({
                        title: 'What to do now?',
                        type: 'question',
                        showCancelButton: true,
                        focusConfirm: false,
                        confirmButtonColor: '#248f24',
                        confirmButtonText: 'Watch Game Movie',
                        cancelButtonColor: '#BC1510',
                        cancelButtonText: 'Reset Game',
                    }).then((result) => {
                        if (result.value) {
                            this.game.playGameFilm(this.showWinner.bind(this, str));
                        } else if(result.dismiss === 'overlay' ||
                                  result.dismiss === 'cancel') {
                            this.game.boardHistory.reset();
                            this.game.gameElements.reset();
                        }
                    });
                }
            });
            this.game.scoreboard.playerWin(winner);
        } else {
            swal( 
                'TIE',
                str,
                'info'
            );
        }
    }

    /**
     * Show a sweetalert to inform that the game initialized with the given type of players
     * 
     * @param {String} playerType1 - Player 1 type
     * @param {String} playerType2 - Player 2 type
     * @return {null}
     */
    showGameStart(playerType1, playerType2) {

        let playerText1 = playerType1.toUpperCase() + (playerType1 != 'human'? ' AI' : '');
        let playerText2 = playerType2.toUpperCase() + (playerType2 != 'human'? ' AI' : '');

        swal (
            'And the game begins...',
            playerText1 + '  vs  ' + playerText2,
            'success'
        )
    }

    /**
     * Show a sweetalert to inform the user that a game is already running, and can't start other
     * 
     * @return {null}
     */
    gameRunning() {
        swal (
            'Sorry',
            'There is a game in progress...',
            'error'
        )
    }

}