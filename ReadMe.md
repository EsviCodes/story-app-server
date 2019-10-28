# Plan of approach

## Synopisis
This app is a multiple player game to create stories together.

### features
- Supports multiple simultaneous games with a lobby system;
- A story can be written with t
- generate random story items
- Start with a given first sentence
- Choose from different themes / topics
- If a player creates a new story, he/she can create story items him/herself and wait for another person who wants to write that story together
- Use a dice to randomly select story outputs (like dungeon and dragons)


1. What will the database schema be?
- Lobby System
.. id, name, player1, player2, status, story
- Players
.. username, password
- Story
.. title, description (based on beginning sentence)
- Text
.. sentence, player, story

Once apon a time in _BLANK_ (place), a _BLANK_ (character) was born to _BLANK_ (part of sentece with verb).
- place
- character
- part of sentence with verb 


2. What reducers will the store have?

3. What routes will be handled on the frontend?
/signup
/login
/ 


4. What routes will be handled on the backend
/login
/signup
/story
/text
/place
/character
/verb

#### thoughts
- We can write our own story API or look for an excisting story writing API