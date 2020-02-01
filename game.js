/*

So the key principle of going backwards in points is that from the current total points value, points are only
gained in 1 way and lost in 1 way.

Points are only added onto the current point value due to players dieing (going from a point value to 0 due to being inactive.)
This can be seen from interval 5 to 6 (Bob dies and 2.5 points are lost) and from interval 7 to 8. (Alice dies and 4.5 points are lost.)

Points are only lost due to the increase of the total point value every iteration of the interval.
This means that if a round has X points, it is certain that the round before had X - 1 points that carried over.
For example, interval 6 had 3.5 points. 2.5 points had been carried over from interval 5.

To combat the death of players, when players die, their current points is saved within their player data along with
the interval that they died in. This allows for us to add back their point values when we reach the interval that they died in.
This stays within the confines of the restrictions since we are only storing a constant size of data per player.

The data saved for the 8th interval of the example would hence be:
         {name:'Bob', currentPoints:0, deathPoints:2.5, deathInterval:5}
         {name:'Alice', currentPoints:0, deathPoints:4.5, deathInterval:7}

Since we know that spending will last for N values and that we can only look back N values, we can determine
  that a player will only ever die ONCE within the lookback amount.

So, the entire algorithm comes out to be very basic.
1. Check if the total point value currently is > 0.
    if true: minus 1 to combat the point value added in that interval
    else: continue
2. Loop over all players and check if they died in the interval we are backtracking to
    if true: add their death point value to the total point value.
    else: continue
This is now the total point value for the previous interval, this just has to be repeated enough times until the desired interval is reached.

The data requirements for this algorithm is:
Constant size data for each player.
Constant size data during the algorithm running (since the only value being held and worked with in the algorithm is the current working total points value.)
This fits withing the storage overhead requirements of O(C*N) since it is O(C)

The downside to this algorithm is that it takes O(C*N*P) time to run.
    Where C is a constant factor, N is the period and P is the number of players.
    This  is since the algorithm checks every player every iteration it completes and it may take up to N iterations to complete.

If a better average time complexity is desired, a list of size N can be held for the operation of the algorithm which is a bool value for the past N
    iterations each value is true if the iteration resulted in the death of 1 or more players. This modified version instead has a storage overhead of O(C*N)
    and has a reduced average time complexity due to some iterations being able to complete without having to loop over all players.
    In the even that no players have died, the request will complete within O(C*N) time.
    e.g deathBool = [0, 1, 0, 1] for the 8th interval of the example since intervals 6 and 8 resulted in the death of Bob and Alice respectively.

NOTE:
This algorithm also works with the original challenge outline where players can choose how to split their spending across the intervals.
This works because the algorithm doesn't need to know how points are split during intervals or how much the players bet.

*/


// The game with an implemented interval points lookback function
function Game(period) {
    const PERIOD = period; // Number of intervals a payment is split across
    const intervals = {}; //
    const players = [];                                                  // saves player in the list as an object with name, current points, death points, and death interval.
                                                                         // e.g {name:'Bob', currentPoints:0, deathPoints:2.5, deathInterval:5} or {name:'Alice', currentPoints:0, deathPoints:4.5, deathInterval:7} for interval 8 of the example
                                                                         // The current points is updated every interval update and reflects the current points that the player holds
                                                                         // The death points is updated when a player dies (goes back to 0 due to inactivity) and holds the current point value before death.
                                                                         // the death interval is updated when a player dies and holds the last interval index that the player died.
    let currentInterval = {index:1, totalPoints:0};

    const completeInterval = () => {
        currentInterval.index++;
        // other stuff to calculate points splitting and betting
    };

    const getCurrentInterval = () => {
        return currentInterval.index;
    };

    const play = (name, amount) => {
        // adds player to the list if they are not present, otherwise places the bet for them.
    };

    // Takes the desired interval index and returns the total points value that would've been present in that interval.
    const getIntervalPoints = (intervalIndex) => {
        if (intervalIndex >= currentInterval.index || intervalIndex < currentInterval.index - PERIOD || intervalIndex < 1){    // intervalIndex must be within N since death values can only be saved once to have constant size.
            throw new Error('out of bounds');
        }

        let totalPoints = currentInterval.totalPoints;
        for (let i = 0; i < currentInterval.index - intervalIndex; i++){                                               // loop and calculate previous interval total until desired interval number is reached
            if (totalPoints > 0){                                                                                      // if total points is above 0 (if a point was distributed this round)
                totalPoints -= 1;                                                                                      // remove 1 from total points to counteract point distribution.
            }
            for (let i = 0; i < players.length; i++){                                                                  // loop over all players data
                if (players[i].deathInterval == currentInterval.index - i - 1){                                        // determine if a player died in the previous interval
                    totalPoints += players[i].deathPoints;                                                             // add the amount they died with to the total points
                }
            }
        }
        return totalPoints;                                                                                            // return points value for desired interval
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
