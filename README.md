# Twilio Express OpenAI Demo


## Getting started

Install dependencies
```
npm install 
```

Copy the `.env.example` file to `.env` and update the `OPENAI_API_KEY` with your OpenAI API key.
```
cp .env.example .env
```

Run the app
```
node --env-file=.env app.js
```

Setup ngrok
```
ngrok http 3000
```

Now configure your Twilio number to point to the ngrok url, with the `/incoming` path appended to it. e.g
```
https://797e-94-203-213-74.ngrok-free.app/incoming
```