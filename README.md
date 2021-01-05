## Setup

1. Create database named PushNotification
2. Setup database configuration in file **./src/config/db.ts**
3. Run command `./node_modules/.bin/mikro-orm schema:create -r` if you use relationship database, e.g. **postgresql**, **mysql**, **sqlite**. If you use NoSQL such as **mongodb**, it's no need to create schema beforehand.

## Start the services
```
yarn compile
yarn app
```

or

```
yarn start:dev
```
