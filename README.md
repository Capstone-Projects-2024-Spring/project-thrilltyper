<div align="center">


# ThrillTyper
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://applebaumian.github.io/tu-cis-4398-docs-template/)


</div>

![typetriller](https://github.com/Capstone-Projects-2024-Spring/project-thrilltyper/assets/123014046/68ef13e5-5c5a-4a95-a96d-66faa2640711)



## Keywords

Section 4
Python
React
Type Racing
Web Application

## Project Abstract

Welcome to the exciting world of ThrillTyper – a cutting-edge typing racer game that's here to make typing fun and competitive. This game is an online web application that offers various single player modes including a robot opponent mode, custom mode, and dynamic race mode, private online multiplayer, and public online multiplayer. In multiplayer each race is composed of up to ten racers, and in online multiplayer the host of the game shall have the option between two to ten competitors. Metrics for each race shall be logged to each user’s account including words-per-minute (wpm), time, and accuracy, however, if the player has no account they shall be playing as a guest with no saved data. Participants shall be able to register accounts, join typing races, and compete in real-time against each other. The game shall feature a user-friendly interface built with JavaScript, a backend powered by Flask, and WebSocket technology for seamless real-time communication. The game shall include user authentication, race creation, and a dynamic leaderboard to showcase the fastest typists.

## High Level Requirement

ThrillTyper is the ultimate typing challenge, offering players an array of modes to engage with. In robot opponent mode, users will see the robot’s progress typing against them and their own metrics. Custom mode will allows users to input texts, select genres, and select between words and sentences. Dynamic race mode will analyze the user’s last few sentences typed and their metrics to generate a few new lines based on that data and what AI deems best to generate. While online multiplayer provides the thrill of real-time competition with two to ten players hosted by a game master. Key metrics, such as words-per-minute (wpm), time, and accuracy, shall be shown in game and meticulously logged for each user, creating a personalized experience. Whether you're a registered user tracking your progress or a guest enjoying the rush, ThrillTyper ensures an exciting typing adventure for everyone.

## Conceptual Design

The initial design concept envisions a software architecture where the frontend, developed using JavaScript, provides a user-friendly interface for interaction. The backend is powered by Flask, a framework written in Python, serving as a robust foundation for text generation, multiplayer connection handling and user data handling. Real-time communication is facilitated through WebSocket technology, ensuring dynamic multiplayer experience. The software stack is designed for compatibility with standard web browsers, making it accessible across various operating systems. The development process adheres to industry best practices, utilizing Git for version control and collaborative development.

## Background

ThrillTyper seeks to distinguish itself through the incorporation of real-time multiplayer capabilities, a dynamic leaderboard, and an emphasis on performance metrics tracking. Proprietary products like "TypeRacer" and "Nitro Type" were also scrutinized for their user engagement features and various capabilities. In crafting ThrillTyper, the aim is not only to offer a unique and thrilling game experience but also to strategically position the product by leveraging successful elements observed in existing projects while introducing innovative differentiators like Robot Opponent Mode and Dynamic Text Generation that cater to a broader user base.

## Required Resources

This is a software-dominant project with zero outside hardware requirements. The Visual Studio Code IDE shall be the biggest requirement to program in JavaScript and Python. Experience with Python Flask and JavaScript shall be helpful. A computer or server provider shall be needed to act as a server to host the application.

## Implemented Features

- Single Player: basic timed gameplay

- Robot Opponent Mode: competing against a simulated opponent with difficulties of either easy, medium, or hard

- Custom Mode: allows user to choose genre for words to type or input a blurb of their own to type

- User Systems: accounts, logging in, dashboard, and leaderboard

- Dynamic Mode: generates an easy blurb for the user to type initially and based on the WPM the users has for that it generates a new blurb, and this goes on until time runs out


## Known Bugs

### Release 1.0

1. Dynamic Text Generation does not allow the user to advance if they type two spaces in a row after finishing their last blurb
2. Multiplayer does not synchronize gameplay so that the match ends when one player has finished the race
3. The background of the cosmetic function may not always maintain a fixed size depending on the length of the monitor.

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/ereizas">
            <img src="https://avatars.githubusercontent.com/u/71237683?v=4" width="100;" alt="ereizas"/>
            <br />
            <sub><b>Eric Reizas</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/TU-Wenjie-Gao">
            <img src="https://avatars.githubusercontent.com/u/112009999?s=88&v=4" width="100;" alt="TU-Wenjie-Gao"/>
            <br />
            <sub><b>Wenjie Gao</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Dem0nMaxwell">
            <img src="https://avatars.githubusercontent.com/u/112010069?s=88&v=4" width="100;" alt="Dem0nMaxwell"/>
            <br />
            <sub><b>Wenjie Chen</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/JasonC136">
            <img src="https://avatars.githubusercontent.com/u/112498586?s=88&v=4" width="100;" alt="JasonC136"/>
            <br />
            <sub><b>Jason Chen</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/tun79877">
            <img src="https://avatars.githubusercontent.com/u/114621735?s=88&v=4" width="100;" alt="tun79877"/>
            <br />
            <sub><b>Xianjun Hu</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/jimmy70111">
            <img src="https://avatars.githubusercontent.com/u/123014046?s=88&v=4" width="100;" alt="jimmy70111"/>
            <br />
            <sub><b>Jimmy Jiang</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/tuk04440">
            <img src="https://avatars.githubusercontent.com/u/123014730?s=88&v=4" width="100;" alt="tuk04440"/>
            <br />
            <sub><b>Allen Abraham</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/icycoldveins">
            <img src="https://avatars.githubusercontent.com/u/81425589?v=4" width="100;" alt="tuk04440"/>
            <br />
            <sub><b>Allen Abraham</b></sub>
        </a>
    </td>
   </tr>
</table>

[//]: # ( readme: collaborators -end )
