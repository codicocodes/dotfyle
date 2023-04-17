## Contributing

To contribute you will first need to fork the repo and make some adjustments to get it up and running on your local
machine. Below are the steps to follow in order for you to get dotfyle to run on your local machine.

### 1. Make a copy of `.env` from the example file `.env.example`.

```
cp .env.example .env
```

### 2. Install and setup a postgres server

[Follow the prisma tutorial on installing and running a postgres server on your local machine][prisma-postgres-install]

### 3. Create a new postgres user and database

If it's your first time installing postgres, you will have to create a new user and a database for prisma to connect.
If you already have a user, then you can just skip to making a new database. First, enter the psql command mode:

For Linux/MacOS:
```
sudo -u postgres psql
```

Then, create a new user and a database (replace `<username>` and `<password>` with your preferred username and password):

```
CREATE USER <username> SUPERUSER;
ALTER USER <username> WITH PASSWORD '<password>';
```

Finally, create the database:

```
CREATE DATABASE dotfyle_dev;
```

Once done, modify your `.env` file and adjust your `DATABASE_URL`:

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/dotfyle_dev
```

### 4. Create a new GitHub OAuth Application

[Follow this link][new-oauth] to create a new app filling the following required details on creation:

```
Homepage URL: http://localhost:5173
Authorization callback URL: http://localhost:5173/api/auth/github/callback
```

Once completed, you will be redirected to the application page settings, from there create the client secret by clicking
on `Generate a new client secret` button.

Next, copy the client secret generated and the client ID into the `.env` file, replacing `<client_id>` and
`<client_secret>`, respectively:

```
GITHUB_ID=<client_id>
GITHUB_SECRET=<client_secret>
```

### 5. Create a JWT Access Secret

Modify your `.env` file and adjust your `JWT_ACCESS_SECRET`:

```
JWT_ACCESS_SECRET=<secret_string>
```

You can create a random string for this, as an example you can use `randomstring` to create a random string which you
can input into `JWT_ACCESS_SECRET`:

```
npx randomstring 32
```

### 6. Install dependencies

Use `pnpm` to install dependencies.

```
pnpm install
```

### 7. Run migrations

Run the prisma migrate command to sync db tables:

```
npx prisma migrate dev
```

### Running the dev server

Finally, you can run the dev server:

```
pnpm run dev
```

[prisma-postgres-install]: https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database
[new-oauth]: https://github.com/settings/applications/new
