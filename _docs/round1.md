We have to design a system which needs to sync the messages from user’s phone to backend server. This happens after user permission and needs to be persisted on database as an encrypted messages. We only sync the non-personal messages.
We have to design a system which can persist and serve the user messages. Also, let’s try to cover the interaction with the app, and how the whole system would function.
A message typically includes:
Sender
Content
Timestamp of receival at user’s phone
Majorly we are looking for two things:
Persistence and serving from the backend system
Logic on app side to send messages to backend

250chars = 250B  
250B
100M message = 25Gbs

25Gb = 20Gbs app
12Gbs

250\* 1000 = 250Kb - per phone
