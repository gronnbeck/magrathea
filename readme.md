# webIRC

This is a branch dedicated to rewriting the concept of webIRC. 
The old code is moved to proto-alpha-0.0.1. 

The API progress will hopefully be documented here in the README. 

Architecturally I do want to build it as a system combined of
microsystems. Lets go!


## IRC Proxy 
First step is to create an IRC proxy. The proxy should proxy IRC data
and expose those data using web sockets. This module must be simple since 
it serves as the corner stone of the application.


## Replayable IRC
The second step is to build a richer API upon the aforementioned 
IRC proxy. This module should take the input of the IRC proxy, 
save the information if its unique, and forward it to any connected 
web client. 

Any client should also be able to replay any missed messages. 

