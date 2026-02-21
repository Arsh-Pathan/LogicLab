# LogicLab

Hey there! 👋 Welcome to LogicLab. I built this to be a high-precision digital logic laboratory for engineers, students, and anyone who loves dropping logic gates together to build cool things.

You can build, simulate, and package complex digital circuitry with total mathematical accuracy. It features a really clean, minimalist interface inspired by Anthropic's design language, so it stays out of your way while you work.

## What it does

- **Real-time Flow Engine**: Signals propagate instantly. You can embed Integrated Circuits (ICs) inside other ICs endlessly.
- **Build Your Own ICs**: Group a bunch of gates, save it, and now you have a single block you can re-use. Great for building up from NAND gates all the way to a CPU!
- **Interactive Learn Section**: I added a curriculum track to take you from basic boolean logic all the way through advanced computer architecture.
- **Built-in Docs**: Everything you need to know about the gates and truth tables is right inside the app.
- **Cloud Saving**: With the built-in Supabase stack, you can create an account and access your circuits from any browser. It saves everything securely to the database.

## Built With

- **Frontend**: React 18, Vite, Zustand for state management.
- **Visuals**: React Flow for the grid, Three.js for some sweet 3D backgrounds, and Tailwind CSS.
- **Backend / Authentication**: A fully local, dockerized Supabase stack (PostgreSQL, GoTrue, PostgREST).

---

## Running it Locally (or on your Server)

LogicLab is fully containerized. You just need Docker Compose to spin up the app and all its database services instantly.

### 1. Set up your environment variables

Copy `.env.docker` to `.env`. This holds your JWT secrets and Postgres passwords.

If you want to host this on your own domain (for example, `logiclab.arsh-io.website`), you can configure the `DOMAIN` and `API_DOMAIN` variables inside your `.env` so that all the authentication callbacks point to the right place!

```env
# Example .env file

POSTGRES_PASSWORD=your_super_secure_password
JWT_SECRET=your_super_long_random_jwt_secret
ANON_KEY=your_anon_key

# --- Domain Setup ---
# Leave these commented out if you're just running on localhost!
# DOMAIN=https://logiclab.arsh-io.website
# API_DOMAIN=https://api.logiclab.arsh-io.website
```

### 2. Boot it up

Run this command to build the UI and start the Supabase database:

```bash
docker-compose --env-file .env up -d --build
```

If you're running locally without custom domains, just open:

- **App**: http://localhost:3000
- **API**: http://localhost:8000

### 3. Shutting down & Wiping Data

To spin the containers down:

```bash
docker-compose --env-file .env down
```

If you messed up the database or want a fresh start, bring it down and wipe the local volume directory:

```bash
docker-compose --env-file .env down -v
rm -rf supabase/db/data
```
