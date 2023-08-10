# Realtime Chat Application

> Procedure to run the application

**Before you start: Make sure you already have Node.js installed in your local machine - You can [follow this guide](https://www.youtube.com/watch?v=3F5IaPqj7ds) if you haven't installed it yet.**

1. Clone the project in your choice directory. You can check this [youtube link](https://www.youtube.com/watch?v=q9wc7hUrW8U) for guide
2. In the root directory of your cloned project, navigate to `/server` directory and create an `.env` file

Inside the `.env` file copy and paste this

```
ACCESS_TOKEN_SECRET=<YOUR_RANDOM_ACCESS_TOKEN_SECRET>
REFRESH_ACCESS_TOKEN=<YOUR_RANDOM_REFRESH_ACCESS_TOKEN>
MONGODB_URL=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_MONGODB_CLUSTER>/app

SOCKET_IO_ORIGIN=http://localhost:3001
```

3. In `ACCESS_TOKEN_SECRET` and `REFRESH_ACCESS_TOKEN` you can just generate your own here: [API Token Generator](https://generate-random.org/api-token-generator?count=1&length=64&type=mixed-numbers-symbols&prefix=) and just paste it

4. To get your `MONGODB_URL` you can just [follow this tutorial on youtube](https://www.youtube.com/watch?v=rHbhlW8qv5A).

<br />

> Take note: After you get the `MONGODB_URL`, dont't forget to add `/app` in the end of the URL. `/app` will stand as your database name. If you didn't put it, by default it is `/myFirstDatabase`

<br />

By default, your `SOCKET_IO_ORIGIN` runs on `http://localhost:3001` because that's where your client application run. Just leave it in `http://localhost:3001`

5. Type `npm install` command in the root directory of your project. It will install all dependencies from the `package.json`

6. Now from your root directory again, type `npm run install-packages` command and it will install all packages both for client and server.

7. After installing all the dependencies you can now run both server at the same time using `npm run dev` command.

8. Open `http:localhost:3001`
