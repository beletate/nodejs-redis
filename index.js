const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = require('redis');
const client = redis.createClient();

const port = 3000;

app.get('/', async(req, res) => {
  const value = await client.get(req.body['key']);
  if(value) res.status(200).send(value);
});

app.post('/', async(req, res) => {
  await client.set(req.body['key'], req.body['value']);
  const value = await client.get(req.body['key']);
  if(value) res.status(201).send('Value has been set.')
})

app.delete('/', async(req, res) => {
  await client.del(req.body['key'], req.body['value']);
  const value = await client.get(req.body['key']);
  if(!value) res.status(201).send('Value has been deleted.')
})

client.on('error', err => console.error('Redis Cliente Error', err));

app.listen(port, async () => {
  await client.connect();
  console.log(`Server running on http://localhost:${port}`);
});