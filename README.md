# Himitsu

Personal environment manager built using Next.js, ShadcnUI, and Libsql.

## Why

Lately I've code in 2 different machine, and it's kinda hassle to copy the environment between machine.<br/>
Currently, I either upload my environment on private discord server, or to my whatsapp.

I hope with this I won't have any hassle managing environment for each of my projects.

## Usage

1. Host this project
2. Install himitsu CLI

```bash
bun add --global himitsu
```

3. Set your CLI config

```bash
himitsu config --set url <this-project-url>

# Using username and password
himitsu config --set auth <username>:<password>
# Using API token
himitsu config --set token <token>
```

4. Pull / push environments

## Available commands

### `config`

Update `himitsu` configuration.

```bash
himitsu config <set|get|list>

# Get saved config
himitsu config list

# Get certain key from config
himitsu config get auth

# Set config
himitsu config set auth lorem:ipsum
```

**Available configuration**

| **Key**  | **Default** | **Description**                                                                                |
| :------- | :---------- | :--------------------------------------------------------------------------------------------- |
| url      | -           | Hosted website url (https://sshhh.mbaharip.com)                                                |
| auth     | -           | `user`:`pass` format authentication                                                            |
| token    | -           | Token access instead of authentication                                                         |
| duration | 10m         | Default share token duration. Using dayjs to parse (https://day.js.org/docs/en/manipulate/add) |

### `list`

List available environments.

```bash
himitsu list <?folder>

# List all projects
himitsu list
# folder-a/project-a folder-a/project-b project-c project-d

# List projects inside folder
himitsu list project-a
# project-a project-b
```

### `pull`

By pulling, CLI will also create `.himitsurc` file.
This file will be used for `push` command

```bash
himitsu pull <project-name>

# Get all project environments
himitsu pull my-cool-saas
# .env .env.local .env.example

# Get certain project environment
himitsu pull my-cool-saas --name=local
# .env.local
himitsu pull my-cool-saas --name=local,staging
# .env.local #.env.staging

# List available environment
himitsu pull my-cool-saas --list
```

### `push`

If there a `.himitsurc` file, it will be used as the project name automatically.<br/>
If there areno `.env.example`, the CLI will automatically generate it.

```bash
himitsu push <?project-name>

# Save all env
himitsu push
himitsu push my-cool-saas

# Save certain env
himitsu push --name=local
himitsu push --name=local,staging
```

### `share`

Return a shareable link in case your colleagues need the env.<br/>
The link will be valid for 10 minutes (can be changed via `duration` config or flag)

```bash
himitsu share <project-name>

himitsu share my-cool-saas
# https://sshhh.mbaharip.com/share?token=<token-for-10-min>

himitsu share my-cool-saas --duration=1hour
# https://sshhh.mbaharip.com/share?token=<token-for-1-hour>

himitsu share my-cool-saas --name=production
# https://sshhh.mbaharip.com/share?token=<prod-token-for-10-min>
```
