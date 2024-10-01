const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;
const OpenAI = require('openai');
const app = express();

app.use(urlencoded({extended: false}));

app.post('/incoming', (request, response) => {

  const voiceResponse = new VoiceResponse();
  voiceResponse.say('Hello, how are you?');

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

  const openai = new OpenAI();
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "user", content: voiceInput}
    ],
    temperature: 0,
  })
  const assistantResponse = chatCompletion.choices[0].message.content

  const voiceResponse = new VoiceResponse();
  voiceResponse.say(assistantResponse);
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
