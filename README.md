# Espinoso

## TL;DR

> [ngrok](https://ngrok.com/) is required for development.

```sh
git clone git@github.com:12-cactus/espi.git && cd espi
yarn install
cp .env.example .env
```

Create your dev bot using BotFather and the command `/newbot`, then add your bot token to the .env file.

When finish those steps, you have to make a tunnel and then start.
Console one:

```sh
yarn tunnel
```

Console two:

```sh
yarn dev
```

Finish, `/start` your bot on Telegram and enjoy to code...
