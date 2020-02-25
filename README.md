# Notes Lookup API (Node.js)


***


## A RESTful Notes Lookup API, made in Node, that allows users to performs CRUD operations on a MongoDB Database.

### <i> Description here...


***

## NEW FRONT-END HOMEPAGE or LANDING PAGE: http://localhost:<\Port>\/notes - (Serves "index.html").

***

#### List of URL(http://localhost:<\Port>\/) + URN (End-points), for Requests against a MongoDB, that are currently available:

| URN | Action on DB | Full URI (Using some port, e.g. "8080") |
|:---|:---|:---|
| <ul><li>"/notes/new"</li><li>"/notes/new?title=Some+Note+Title&note=Some+note+here"</li></ul> | <b><u>CREATE</u></b> | <ul><li>"http://localhost:8080/notes/new"</li><li>"http://localhost:8080/notes/new?title=Some+Note+Title&note=Some+note+here"</li></ul> |
| <ul><li>"/notes/all"</li><li>"/notes/seeAll"</li><li>"/notes/<\noteID>\"</li></ul> | <b><u>READ</u></b> | <ul><li>"http://localhost:8080/notes/all"</li><li>"http://localhost:8080/notes/seeAll"</li><li>"http://localhost:8080/notes/<\noteID>\"</li></ul> |
| <ul><li>"/notes/update?id=<\noteID>\&title=Some+Update&note=Hello,+world,+new+update"</li></ul> | <b><u>UPDATE</u></b> | <ul><li>"http://localhost:8080/notes/update?id=<\noteID>\&title=Some+Update&note=Hello,+world,+new+update"</li></ul> |
| <ul><li>"/notes/del?id=<\noteID>\"</li><li>"/notes/delAll"</li></ul> | <b><u>DELETE</u></b> | <ul><li>"http://localhost:8080/notes/del?id=<\noteID>\"</li><li>"http://localhost:8080/notes/delAll"</li></ul> |

##### POST/PUT/DELETE requests available with an app like Postman, or other middleware.


***
***


|Version| Changes|
|:---|:---|
|Version 0.0.1 [2020-02-22]|<ul><li>Initial Commit.</li><li>Add "main.js" file, node project.</li><li>Add README.md</li><li>Make new dir "Screenshots".</li><li>Add some screenshots to "Screenshots" dir.</li></ul>|
|Version 0.0.2 [2020-02-22]|<ul><li>Split methods into routes, with a new "routes" dir, and a route script file for each CRUD Method. (Using modules/exports).</li><li>Add new DEL & GET methods to respective route script files.</li><li>Update POST method in POST script file, to add more data into the note records going into db.</li><li>Update README.md</li></ul>|
|Version 0.1.0 [2020-02-23]|<ul><li>Add a whole set of CRUD operation on db, using GET http Requests.</li><li>Add error handling for each route file's request. As in all requests will check to see it is a valid action.</li><li>Create/Update notes with omitted query strings won't be nullified.</li><li>General improvements/bug fixes.</li><li>Comments tidy-up & testing.</li><li>Update README.md</li></ul>|
|Version 0.1.1 [2020-02-24]|<ul><li>Began work on front-end back-end connection, with a temporary setup (using get rquests & query string, in a iframe - for now).</li><li>Add "index.html", which will serve as front end.</li><li>Tested object transfer from middle-ware to back end, to begin work on new methods for front end.</li><li>Add mp4 video demo to screenshots dir.</li><li>Update README.md</li></ul>|
|Version 0.2.0 [2020-02-25]|<ul><li>Major Front-End Update</li><li>Serve "index.html" client landing page</li><li>Connect front with back, via AJAX in the front end.</li><li>Add new screenshot and rename most. Also remove old screenshot.</li><li>Update README.md</li></ul>|