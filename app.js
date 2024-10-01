const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;
const OpenAI = require('openai');
const app = express();
require('colors');

app.use(urlencoded({extended: false}));

app.post('/incoming', (request, response) => {

  const voiceResponse = new VoiceResponse();
  const greeting = 'Hello, how are you?';
  voiceResponse.say(greeting);
  console.log(`Voice Agent -> ${greeting}` . green);

  // setting up event here, for how to handle future incoming audio for this call
  voiceResponse.gather({
    input: ["speech"],
    speechTimeout: "auto",
    speechModel: 'experimental_conversations',
    enhanced: true,
    action: '/respond',
  })

  response.type('application/xml');
  response.send(voiceResponse.toString());
});

app.post('/respond', async (request, response) => {

  const voiceInput = request.body.SpeechResult;
  console.log('User -> ' + voiceInput);

  const openai = new OpenAI();
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "Keep responses no longer than 20 words."},
      {role: "user", content: voiceInput}
    ],
    temperature: 0,
  })
  const assistantResponse = chatCompletion.choices[0].message.content

  const voiceResponse = new VoiceResponse();
  voiceResponse.say(assistantResponse);
  console.log(`Voice Agent -> ${assistantResponse}` . green);
  voiceResponse.redirect({method: 'POST'}, '/listen');

  response.type('application/xml');
  response.send(voiceResponse.toString());

});

app.post('/listen', (request, response) => {

  const voiceResponse = new VoiceResponse();

  // setting up event here, for how to handle future incoming audio for this call
  voiceResponse.gather({
    input: ["speech"],
    speechTimeout: "auto",
    speechModel: 'experimental_conversations',
    enhanced: true,
    action: '/respond',
  })

  response.type('application/xml');
  response.send(voiceResponse.toString());
});


app.listen(3000, () => {
  console.log(
    'Now listening on port 3000. ' +
    'Be sure to restart when you make code changes!'
  );
});
