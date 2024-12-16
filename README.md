# Loopify

An app to help users discover new music based on their mood.

## Background

We are a group of 5 Full-Stack Web Development students from Business College Helsinki who decided to work together to make a Mood playlist generator using the Spotify API.

## Prerequisites

### Spotify Premium

To use the app to it's full extent you need a **spotify premium** account

## Installation

If you wish to run the project locally, do as the following:

1. Clone the repository  
   `git clone https://github.com/athinakantis/Loopify.git`

2. Create your spotify app at [Spotify for Developers](https://developer.spotify.com/dashboard)

3. In the project settings:

    1. Define the redirect uri you will be using for your project
    2. Add the Client ID and redirect URI to the **LandingPage component**

    ```js
    // In LandingPage.jsx

    const clientID = 'YOUR_CLIENT_ID_HERE';
    const redirectURI = 'http://your_redirect_uri:3000';
    ```

4. Install the dependencies  
   `npm install`

5. Run the project  
   `npm run dev`

## Features

-   Search and play music
-   Filter playlists based on users mood
-   Playlist creation

## Technologies used

-   React
-   Spotifty API

## Known Flaws

### - Accesstoken doesn't automatically renew

Because of the 9 week limit, we made the decision to focus on the front-end experience and getting more familiar with API-calls and React. This unfortunately means there is no automatic renewal for the accesstoken and the user has to refresh after the token expires (1 hour)

## Authors

Maria Aluko - [GitHub](https://github.com/maria-aluko)  
Nikita Shub - [GitHub](https://github.com/nikitushu2)  
Md Mahmudur Rahman - [GitHub](https://github.com/mehedimrm22)  
Athina Kantis - [GitHub](https://github.com/athinakantis)  
Ajay Sharma - [GitHub](https://github.com/Ajaysharmasgit)
