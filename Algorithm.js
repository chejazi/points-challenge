class Interval {
    constructor(index, operations, previousPoints) {
        this.index = index; // incremental index: 1, 2, 3, 4....
        this.operations = operations; //array with every entry structured as {player: playerObj, amount: numeric, paymentInterval: numeric}
        this.previousIntervalPoints = previousPoints; //array with every entry structured as {player: playerObj, totalSpent: numeric, totalPoints: numeric}

        // previousIntervalPoints is data from the inmediatly previous interval
        // For example if this interval has index 10, then data in previousIntervalPoints corresponds to interval with index 9
    }

    //gets the total current payment, to be used when completing interval
    getTotalPayment() {
        let total = 0;
        this.operations.forEach(op => {
            total += op.amount;
        });
        return total;
    }

    //this method gives us the total a player is paying in current interval
    getTotalPlayerPayment(playerName) {
        let total = 0;
        //we get the player operations only and add each amount to total
        const playerOperations = this.operations.filter(op => op.player.name === playerName);
        playerOperations.forEach(operation => {
            total += operation.amount;
        });
        return total;
    }

    //get total points for a player in previous interval
    getPlayerPreviousIntervalPoints(playerName) {
        const playerPoints = this.previousIntervalPoints.find(element => element.player.name === playerName);
        return playerPoints ? playerPoints.totalPoints : 0;
    }

    //get total points from previous interval
    getPreviousIntervalTotalPoints() {
        let totalPoints = 0;
        this.previousIntervalPoints.forEach(element => {
            totalPoints += element.totalPoints;
        });
        return totalPoints;
    }

    //get total spent from previous interval
    getPreviousIntervalTotalSpent() {
        let totalSpent = 0;
        this.previousIntervalPoints.forEach(element => {
            totalPoints += element.totalSpent;
        });
        return totalSpent;
    }
}

function Game(period) {
    const PERIOD = period; // Number of intervals a payment is split across
    const players = []; // Player data [{name, initialInterval, totalSpent},...]
    let initialPeriodInterval = undefined; // this is the oldest interval that can be asked its points (index being currentInterval.index - PERIOD )
    let currentInterval = new Interval(1, [], []);

    const getCurrentInterval = () => {
        return currentInterval.index;
    };

    const completeInterval = () => {
        const nextIndex = getCurrentInterval() + 1;

        //we only set the initialPeriodInterval when the next interval to be created has index bigger than PERIOD
        //this is because in the intervals with index from 1 to PERIOD we don't need anything but the current interval information to obtain the points from previous intervals
        if (nextIndex > PERIOD) initialPeriodInterval = setInitialPeriodInterval();

        //we get the on going operations to be passed to the next interval.
        const nextOperations = currentInterval.operations.filter(operation => operation.paymentInterval < PERIOD) //filter the payments that have concluded
            .map(operation => { return { ...operation, paymentInterval: (operation.paymentInterval + 1) } }); // we increase the payment interval

        //we calculate the totalSpent and totalPoints for each player this interval and pass it onto the next one
        const playerPoints = players.map(player => {
            const totalIntervalPayment = currentInterval.getTotalPayment(); //total amount spent 
            const playerPayment = currentInterval.getTotalPlayerPayment(player.name);
            const playerPoints = !playerPayment ? 0 : //if payment is 0 then points should also be reset
                (currentInterval.getPlayerPreviousIntervalPoints(player.name) + (playerPayment / totalIntervalPayment));
            return { player, totalSpent: playerPayment, totalPoints: playerPoints }
        });

        currentInterval = new Interval(nextIndex, nextOperations, playerPoints);
    };

    const play = (name, amount) => {
        // Fill this in
        if (!players.find(p => p.name === name)) players.push({ name, initialInterval: getCurrentInterval(), totalSpent: 0 }); //we could set extra data for the players here
        const player = players.find(p => p.name === name);
        player.totalSpent += amount;
        currentInterval.operations.push({ player: player, amount: (amount / PERIOD), paymentInterval: 1 });
    };

    const setInitialPeriodInterval = (tempInterval = null, minus = PERIOD) => {
        //getting operations started on the corresponding interval (currentIndex - PERIOD)
        const correspondingOperations = currentInterval.operations.filter(operation => operation.paymentInterval - minus === 0)
            .map(o => { return { ...o, paymentInterval: 1 } });

        let playerPoints;
        //initial set
        if (!initialPeriodInterval) {
            tempInterval = new Interval(1, correspondingOperations, []); 
        } else {
            //now let's set the data 1 interval further
            tempInterval = tempInterval ? tempInterval : initialPeriodInterval;
            tempInterval.index++;

            //we get the on going operations to be passed to the next interval.
            const nextOperations = tempInterval.operations.filter(operation => operation.paymentInterval < PERIOD) //filter the payments that have concluded
                .map(operation => { return { ...operation, paymentInterval: (operation.paymentInterval + 1) } }); // we increase the payment interval

            tempInterval.operations = [...nextOperations, ...correspondingOperations];
        }
        playerPoints = players.filter(p => p.initialInterval <= tempInterval.index).map(player => {
            const totalIntervalPayment = tempInterval.getTotalPayment();
            const playerPayment = tempInterval.getTotalPlayerPayment(player.name);
            const playerPoints = !playerPayment ? 0 :
                (tempInterval.getPlayerPreviousIntervalPoints(player.name) + (playerPayment / totalIntervalPayment));
            return { player, totalSpent: playerPayment, totalPoints: playerPoints }
        });
        tempInterval.previousIntervalPoints = playerPoints;

        return tempInterval;
    }

    // Returns the number of points among all active players
    // back during the time of the interval.
    const getIntervalPoints = (intervalIndex) => {
        const currInterval = getCurrentInterval();
        if (
            intervalIndex >= currInterval ||
            intervalIndex < currInterval - PERIOD ||
            intervalIndex < 1
        ) {
            throw new Error('out of bounds');
        }

        const previousTotalPoints = currentInterval.getPreviousIntervalTotalPoints();
        if (!initialPeriodInterval) {
            //we can do this when Interval is < than PERIOD
            const points = previousTotalPoints - ((currInterval - 1) - intervalIndex);
            return points > 0 ? points : 0;
        } else {
            if (intervalIndex === currInterval - 1)
                return previousTotalPoints;
            else if (intervalIndex === currInterval - PERIOD)
                return initialPeriodInterval.getPreviousIntervalTotalPoints();
            else{
                //we'll apply the setInitialPeriod to temporal variable in order to obtain the points from the desired interval 
                let tmpInterval = new Interval (initialPeriodInterval.index, initialPeriodInterval.operations, initialPeriodInterval.previousIntervalPoints);
                const intervalsApart = intervalIndex - tmpInterval.index;
                for (let i = 0; i < intervalsApart; i++){
                    tmpInterval = setInitialPeriodInterval(tmpInterval, (PERIOD - i));
                }
                return tmpInterval.getPreviousIntervalTotalPoints();
                //could even retrieve detailed information like this:
                //return {index: tmpInterval.index, totalPoints: tmpInterval.getPreviousIntervalTotalPoints(), details: tmpInterval.previousIntervalPoints}
            }
        }
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
game.play('alice', 1);
game.completeInterval(); // End interval 1, start 2
game.play('bob', 2);
console.log(game.getIntervalPoints(game.getCurrentInterval() - 1)); // returns: 1
game.completeInterval(); // End interval 2, start 3
console.log(game.getIntervalPoints(game.getCurrentInterval() - 1)); // returns: 2
game.completeInterval(); // End interval 3, start 4
console.log(game.getIntervalPoints(game.getCurrentInterval() - 2));
game.play('alice', 1);
game.completeInterval(); // End interval 4, start 5
game.completeInterval(); // End interval 5, start 6
game.completeInterval(); // End interval 6, start 7
console.log(game.getIntervalPoints(game.getCurrentInterval() - 1)); // returns: 3.5
console.log(game.getIntervalPoints(game.getCurrentInterval() - 4)); // returns: 3
game.completeInterval(); // End interval 7, start 8
console.log(game.getIntervalPoints(game.getCurrentInterval() - 2)); // returns: 3.5
