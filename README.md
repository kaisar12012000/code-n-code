# CodeNCode (An RTC Code editing webapp)

This is a Next.JS project develop to practise/showcase my skills as a full stack NextJS developer. The goal was to build a full stack app with RTC that showcased my understanding of NextJS, Real time collaboration and other fundementals.

# Table of Contents
### 1. Tech stack
### 2. Installation and setup
### 3. Documentation
1. Code editing and compilation
2. Room creation
3. RTC


## 1.Tech stack
1. Code editing and compilation
    - react-ace
    - child-process
    - fs
    - os
    - path
    - Language compilers
2. RTC
    - socket.io
    - redis
    - express, http, cors
3. Data storage feature
    - json-server

## 2. Installation and setup
Clone this repo:
```
git clone https://github.com/kaisar12012000/code-n-code.git
```
Install all dependencies:
```
npm install
```
The installation is complete.
It is time to set the environment variables.
In the root directory create a `.env` file and paste the following environment variables in it. These are very essential for the app to run.
```
NEXT_PUBLIC_DOMAIN=localhost
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
NEXT_PUBLIC_DB_URL=http://localhost:3001/rooms
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002/
```
To run the app it is important to first start the data storage server and the socket server.
To start the data storage server in the root project directory run the following.
```
node server.js
```
The json server will start running at `PORT=3001`. To avoid database integration complexities `json-server` is used to mock a database.
Now run the socket server by running the following in the root directory.
```
node socketServer.js
```
Now that the data storage server and the socket server at `PORT=3001` and `PORT=3002` respectively are up and running run the following in the root directory to start the app.
```
npm run dev
```
And your app is available at [http://localhost:3000/](http://localhost:3000/)

## Documentation
#### 1. Code Editing and compilation
This full stack module comprises of one POST api that takes the code coming from client generates the file with proper extension and then feeds it to the respective compiler.
On the client side there is a client component which leverages React-ace package to give uses the text editor UX. The code with the language extension and the filePath(optional) is sent via a POST Request and the controller function first checks of the file path is sent from client if not it creates a new unique file for that language, if the file path exists it will check if the file exists and creates a new file onl if the file does not exists.
After creating the file it runs the file using dynamocally generated command and passing it to `child_process.exec()` method.
`exec()` then returns the stdout, stderr and error to the client as the API response.
### 2. Room creation
This module comprises of one API that generates a unique roomId, host code, guest code along with other details and stores it inside a json file using `json-server`'s POST API to add data. Then returns the room details to client. The client will then set two key-value pairs in localStorage to remember that the room host is accessing the room and that they are logged in followed by redirecting the user to the room url. The room client component fetches from localhost whether the user accessing the link is a host or not and whether they are logged in or not. If they are host and logged in the room client component then fetches data from the GET room details api and then proceed to socket initialization on client side. If the user is not host they will be shown a screen that blocks them to access the code editor till the enter their name and the correct room code(host code for hosts and guest code for clients). Depending on the code (host/guest) the client component renders its children on user's browser.
### 3.RTC
To implement RTC (Real time collaboration) I leveraged `socket.io`.
`socket.io` is an npm package that leverages websockets and http polling to implement real time user data sharing between users.
The server for the socket is isolated from the app's backend.
It listens to a client event named `code-change` and emits the data recieved to all the users on that socket connection after caching it in memory using redis. I used redis because of a particular usecase.
Usecase is as follows: "User A has started coding and has written quite long code. He stops for a few minutes to think. Now in the middle of  User A's thinking User B has joined too and all he sees is a white screen. Assuming his partner User A hasn't started he starts writing code and due to RTC all the code user A wrote is replaced by user B's first line of code." This happened because of lack of a database to store the code progress. Ideally user B even after joining late should have seen User A's work so far. This pointed out the need for optimised real time data transactions. To implement a database like mongo/Postgres/MySql would solve this issue but a more optimised solution was to save the changes in memory and hence I used redis to store the code chages mapped to the roomId.
This helped store the latest version of code in memory and when any user joins using the URL the latest code is fetched from the redis. This took care of the above mentioned scenario.