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
     * @return {Number} - The starting player
     */
    chooseFirstPlayer() {
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
                this.game.currentPlayer = this.game.player1;
                swal(
                    'Player 1 starts playing', '',
                    'success'
                )
            } else if (result.dismiss === 'cancel') {
                this.game.currentPlayer = this.game.player2;
                swal(
                    'Player 2 starts playing', '',
                    'success'
                )
            }
        })
    }

}