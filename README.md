## Install Packages

```
pnpm install
```

## Create .env and Add the following

```
BETTER_AUTH_SECRET='1hXr3WliewYVrf1Cp3u30PLRjyW22nWs'
BETTER_AUTH_URL='http://localhost:3000'


# Connect to POSTGRESS DB
DATABASE_URL=""


GITHUB_CLIENT_ID=''
GITHUB_CLIENT_SECRET=''
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RESEND_API_KEY=""

```
## Create migration files using prisma

```
npx prisma migrate dev --name init
npx prisma db push


```

# Seeding DB / cleaning DB

