# Chess
Maybe?

So this is a project that I started in early 9th grade. Then all I did was just code the game of chess and nothing else.
Then I came back to it in early 10th grade and I fixed up all the bugs and added some chess rules I didn't have before
(like you can't move into check, or castle through check) then I added a bunch of extra features and added an AI to play against.
The AI uses a minimax algorithm with Alpha Beta Pruning.

Currently I'm working on making small optimazations to the algorithm.
I'm planning on adding iterative deepening to sort the nodes which should make Alpha Beta Pruning more optimal
Also my pruning doesn't work properly right now so I need to fix that.

I have more things I'm planning on doing (like using a better board representation, and more advanced board evaluation like maybe using
a transposition table) but for now I'm going to work on improving pruning with iterative deepening.

I also want to add an opening book at some point (that will be annoying to do tho)
And I want to make it detect what game state it is in (opening, middle game, end game) and use that to determine certain things
like values of pieces, going for pawn promotions, stuff like that.

Also my end goal is to have my AI have an ELO rating of above 1000 (my current rating is 700, I'm pretty bad)
and then I want to build a robot arm that uses vision detection to construct a virtual board state, run the AI on that and
convert the chess move into motor positions and have the arm make the move.

I would probably do this with an arduino controlling the arm and sending data back and forth to my computer using serial communications

If that's too hard I might consider using the p5.bots javascript library to control the arduino entirely from my laptop.

Will update this when I add things

- Connor
