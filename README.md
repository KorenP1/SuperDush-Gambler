MineSweeper Gambling Game

In order to run you need to have running postgres db
You can run it by this command:
`docker run -it --rm --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 docker.io/postgres`

Then you are able to run the minesweeper game
The postgres username is 'postgres'
There are 2 environment variables POSTGRES_HOST and POSTGRES_PASSWORD while the defaults are 'localhost' and 'password'
You can run the image by this command:
`docker run -it --rm --name minesweeper -e POSTGRES_HOST=localhost -e POSTGRES_PASSWORD=password -p 5432:5432 docker.io/korenp/minesweeper-gambler`

By KorenP :0