# MineSweeper Gambling Game

In order to run the game you need to have running postgres db \
You can run it by this command: \
`docker run -it --rm --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 docker.io/postgres`

After you do have a running postgres db you are able to run the minesweeper game

The postgres username is 'postgres' \
There are 2 environment variables POSTGRES_HOST and POSTGRES_PASSWORD while the defaults are 'localhost' and 'password'

You can run the image by this command: \
`docker run -it --rm --name minesweeper-gambler -e POSTGRES_HOST=localhost -e POSTGRES_PASSWORD=password -p 8080:8080 docker.io/korenp/minesweeper-gambler`

By KorenP :0
