
function Game(period) {
    let PERIOD = period; // Number of intervals a payment is split across
    let intervals = {}; // Interval data
    let players = {}; // Player data
    let otherData = {}; // Whatever you want!
    let currentInterval = 1;

    const completeInterval = () => {
        currentInterval++;
    };

    const getCurrentInterval = () => {
        return currentInterval;
    };

    const play = (name, amount) => {
        // Fill this in
    };

    // Returns the number of points among all active players
    // back during the time of the interval.
    const getIntervalPoints = (intervalIndex) => {
        if (
            intervalIndex >= currentInterval ||
            intervalIndex < currentInterval - PERIOD ||
            intervalIndex < 1
        ) {
            throw new Error('out of bounds');
        }
        // Fill this in
    };

    return {
        completeInterval,
        getCurrentInterval,
        play,
        getIntervalPoints
    }
}

// Simulation using the example from the challenge document:
const game = Game(4);
game.reset();
game.play('alice', 1);
game.completeInterval(); // End interval 1, start 2
game.play('bob', 2);
game.getIntervalPoints(getCurrentInterval() - 1); // returns: 1
game.completeInterval(); // End interval 2, start 3
game.getIntervalPoints(getCurrentInterval() - 1); // returns: 2
game.completeInterval(); // End interval 3, start 4
game.play('alice', 1);
game.completeInterval(); // End interval 4, start 5
game.completeInterval(); // End interval 5, start 6
game.completeInterval(); // End interval 6, start 7
game.getIntervalPoints(getCurrentInterval() - 1); // returns: 3.5
game.getIntervalPoints(getCurrentInterval() - 4); // returns: 3
