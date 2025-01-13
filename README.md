[![Codacy Badge](https://app.codacy.com/project/badge/Grade/17026646c91347628d29b552195035e0)](https://app.codacy.com/gh/12-cactus/espi/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/17026646c91347628d29b552195035e0)](https://app.codacy.com/gh/12-cactus/espi/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

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
