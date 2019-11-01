# Story Writing Game

## Synopisis
Have you always wanted to write a story together with your friends, or do you dare to collaborate with a random stranger? This is the app for you! Create or join a writing room, take turns in writing a new sentence, and say yes! Go with whatever the other writer puts into the story and work from there. It's that simple. Happy Writing!

This app is a multiple player game to write a story together.

## Tips to write an amazing story
1. Say yes!
.. Saying yes is the most important rule of writing a story together. 

### features
- Write a story with

- Supports multiple simultaneous games with a lobby system;
X generate random story items
X Start with a given first sentence
X Choose from different themes / topics
X If a player creates a new story, he/she can create story items him/herself and wait for another person who wants to write that story together
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

Once apon a time in _BLANK_ (place), a _BLANK_ (character) was born to _BLANK_ (verb) a _BLANK_ (noun).
- place
- character
- verb 
- noun 


#### thoughts
- We can write our own story API or look for an excisting story writing API

- Take turn
- - back-end ?
- quit the turn