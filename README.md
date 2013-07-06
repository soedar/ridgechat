#RidgeChat
RidgeChat is an anonymous pair chatting web application written in Node.js.

##Live Demo
Deployed on Heroku: http://ridgechat.herokuapp.com/  
If you are the only person in the room, open the url in another tab/window. Have fun talking to yourself.

##API EndPoints
`GET /register/<user_id>`: Register user_id with RidgeChat. This endpoint returns a room_id, to be used for subsequent requests. RidgeChat will ensure that the user who called this method will not be in the same room as himself.  
**Sample Request**: `/register/eLUBzHR0yQ`  
**Sample Response**:  
```json
{
  "success": true,
  "room_id": "oZQpaxMPX8"
}
```
  
  
`GET /room/<room_id>/<user_id>/messages/<timestamp>`: Return messages in room_id since timestamp time. Supplying a timestamp value of 0 will return all messages since the creation of the room. If there are no messages since timestamp, the http will not return (i.e. block) until a message is posted in the room, or after messageTimeout. System Messages will have a user_id of 0 and will contain another key msg_type indicating the message type.  

**Sample Request**: `/room/oZQpaxMPX8/eLUBzHR0yQ/messages/0`  
**Sample Response**:  
```json
{
  "success": true,
  "messages": [
    {
      "user_id": "0",
      "msg_type": "JOIN",
      "message": "eLUBzHR0yQ",
      "timestamp": 1373139288621
    },
    {
      "user_id": "0",
      "msg_type": "JOIN",
      "message": "YLeed10emS",
      "timestamp": 1373139291616
    },
    {
      "user_id": "YLeed10emS",
      "message": "Hello, world",
      "timestamp": 1373139294041
    },
    {
      "user_id": "0",
      "msg_type": "LEFT",
      "message": "eLUBzHR0yQ",
      "timestamp": 1373139310456
    }
  ]
}
```
  
  
`POST /room/<room_id>/<user_id>/post/`: Post a message to the room. The message has to be in the post body in the JSON format `{message: <message>}`.

##Web Client
Simple web client done in Bootstrap and JQuery. When a user access the web client, it will do the following:

1. A new user_id will be generated. 
2. Make an ajax call to the register endpoint to get the room_id that the user should join. 
3. Make an ajax call to the message endpoint to get the messages in room_id since time 0
4. Update the UI with the messages when the ajax call is complete.
5. Determine the timestamp of the last message, and make an ajax call to message endpoint since timestamp
6. Repeat from step 4 until the user close the web client.

When the user post something, the web client will make an ajax call to the post endpoint. Any blocked message endpoint calls will be returned with the new post message.

##Noteworthy Features and Implementation
1. Messages arrive in the web client almost as soon as they are posted in the room.  
    Instead of polling the api end points for new message every poll_time seconds, every call to the message endpoint is blocked until there are new messages in the room, or after timeout seconds. This means that the web client will know immediately when there is a new message posted in the room, as the http call will return the new message. After timeout seconds with no new message, the endpoint will return an empty messages array, and the web client will call the endpoint again. Contrast this with the naive polling method, which will cause new messages to incur a delay of up to `poll_time` seconds before appearing in the web client. 

2. Server side player leaving detection  
    HTTP is a stateless protcol, it can get quite challenging to determine the event when a user leave the room. In order to detect when an user has left the room, every call to the messages endpoint will be timestamped. Before returning the list of messages, the api server will check whether the last request time for message for any the users have exceeded inactive_timeout. Users whose last request time have exceeded inactive_timeout would indicate that they have left the web client (since the web client has not been requesting for new messages). The clearing of inactive users is done lazily; this check only occurs when a client calls the message endpoint.

    Because this check is done lazily, we would also need to perform this check as we decide which room to pair a new user with. This case would happen when an user joins and leaves the room before being paired with another user. We would not want to pair a new user to a room which is already empty.

    Note: Although on the client side, we can use the `window onbeforeunload` event to determine when the user closes the window, and call a "leave room" endpoint to close the room, this implementation would not allow us to detect the scenario when the user has lost internet connectivity. Worse, it is possible to pair a new player to a room to an stale player that has lost internet connectivity (since we would assume that the stale player is still in the room as we did not receive the leave room event from that player)