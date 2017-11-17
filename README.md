
# SkyBet JS Tech Test


This project is built using ReactJS, Redux, JS ES6/7, WebPack and it provides a web interface for visualising the data retrieved from the provided API.
The UI is based on a modified and basic version of [CoreUI](http://coreui.io/).

The app also connects to the provided WebSocket on the markets screen, in order to reflect the price change updates.
The tests can be accessed by running the `npm run test` command. (I've only had the time to include a couple of basic tests)

## Tasks

* It displays the Football events
* Added option for showing the primary market for each of the events
* Added option for switching between decimal and fractional odds
* Ability to browse markets / outcomes for each of the events.
* Ability to lazy load markets / outcomes on specific pages.
* Using the provided WebSocket for updates.
* Grouped events via the side bar.
* Displaying markets with different types using specific layouts.
* Deep linking.

## Not implemented
* I did not have time to change the display of markets / outcomes based on their statuses (basic)
* I only managed to include a couple of basic tests.

If needed, I can implement / improve the points above. 

## Getting Started

* Install [Docker](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/)
* Start the **Docker** containers by typing `docker-compose up` in the root directory (where **docker-compose.yml** resides). This will build and start the **api** & **web** containers.
* Once all the containers have started running, please open a browser and navigate to <http://localhost:8585> in order to test the data feed via the web interface.
* In order to close and destroy the environment, please press `CTRL + C` followed by `docker-compose down`.

