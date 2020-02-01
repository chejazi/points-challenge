using System;
using System.Collections.Generic;
using System.Text;
namespace coinGame
{
    public struct Play
    {
        public int startIntervals;
        public double amount;

        public Play(int startIntervals, double amount)
        {
            this.startIntervals = startIntervals;
            this.amount = amount;
        }
    }
    public struct Player
    {
        public string name;
        public double point;
        public List<Play> plays;

        public Player(string name, double amount, int startIntervals, int point = 0)
        {
            this.name = name;
            this.point = point;
            plays = new List<Play>
            {
                new Play(startIntervals, amount)
            };
        }
        //
        public bool ReducenPlay(int currentInterval, int period)
        {
            for (int i = 0; i < plays.Count; i++)
            {
                if (plays[i].startIntervals+period <= currentInterval)
                    plays.RemoveAt(i);
            }
            if (plays.Count > 0)
                return true;
            else
                return false;
        }

        public void AddPlay(int restOfIntervals, double amount)
        {
            plays.Add(new Play(restOfIntervals, amount));
        }
    }

    class Game
    {
        int PERIOD;// Number of intervals a payment is split across
        List<double> intervals = new List<double>();// Interval data
        List<Player> players = new List<Player>();// Player data
        int currentInterval = 1;

        public Game(int period)
        {
            this.PERIOD = period;
        }

        private double CountPoints()
        {
            //If out of the game remove the player.
            for (int i = 0; i < players.Count; i++)
            {
                Player player = players[i];
                if (!player.ReducenPlay(currentInterval, PERIOD))
                    players.RemoveAt(i);
                else
                    players[i] = player;
            }

            //calculate points
            double[] playersPoin = new double[players.Count];
            for (int i = 0; i < players.Count; i++)
            {
                for (int j = 0; j < players[i].plays.Count; j++)
                {
                    playersPoin[i] += players[i].plays[j].amount;
                }
            }
            double totalAmount = 0;
            foreach (double point in playersPoin)
                totalAmount += point;

            for (int i = 0; i < players.Count; i++)
            {
                Player player = players[i];
                player.point += playersPoin[i] / totalAmount;
                players[i] = player;
            }


            //fold points
            double totalPoint = 0;
            for (int i = 0; i < players.Count; i++)
                totalPoint += players[i].point;
            return totalPoint;
        }

        public int completeInterval()
        {
            intervals.Add(CountPoints());
            return currentInterval++;
        }

        public int getCurrentInterval()
        {
            return currentInterval;
        }

        public void play(string name, double amount)
        {
            //fill
            Player player = players.Find(x => x.name == name);
            if (player.name == null)
                players.Add(new Player(name, amount, currentInterval, 0));
            else
                player.AddPlay(currentInterval, amount);

        }

        // Returns the number of points among all active players
        // back during the time of the interval.
        public double getIntervalPoints(int intervalIndex)
        {
            if (intervalIndex >= currentInterval ||
                intervalIndex < currentInterval - PERIOD ||
                intervalIndex < 1)
            {
                throw new IndexOutOfRangeException();
            }

            // Fill this in
            return intervals[intervalIndex - 1];
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            Game game = new Game(4);
            game.play("alice", 1);
            game.completeInterval(); // End interval 1, start 2
            game.play("bob", 2);
            game.getIntervalPoints(game.getCurrentInterval() - 1); // returns: 1
            game.completeInterval(); // End interval 2, start 3
            game.getIntervalPoints(game.getCurrentInterval() - 1); // returns: 2
            game.completeInterval(); // End interval 3, start 4
            game.play("alice", 1);
            game.completeInterval(); // End interval 4, start 5
            game.completeInterval(); // End interval 5, start 6
            game.completeInterval(); // End interval 6, start 7
            game.getIntervalPoints(game.getCurrentInterval() - 1); // returns: 3.5
            game.getIntervalPoints(game.getCurrentInterval() - 4); // returns: 3
        }
    }
}
