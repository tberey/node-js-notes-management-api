/* NOTES:-

This script is served to "index.hmtl", via a GET Request made by the script tags, in-page. Contains all the event listeners for each html button, and performs the relevant POST, PUT, DELETE or GET xmlRequest (AJAX), via http.

---------------------------------------------------------------------------------------------------

There are 13 functions in this file.
Function with the largest signature take 1 arguments, while the median is 0.
Largest function has 17 statements in it, while the median is 6.
The most complex function has a cyclomatic complexity value of 4 while the median is 2.

*/

// Global Space

// Wait for page to be ready.
if (document.addEventListener) document.addEventListener("DOMContentLoaded", initialised, false);
else window.onload = initialised;

function initialised() {


    // Set event listener on create button, to call anon function, which sends a XMLHttp GET request to add a new note to database. Builds new note into html for user review.
    document.getElementById('new-entry').addEventListener('click',() => {
        document.querySelector('#last-entry').innerHTML = ''; // Clear input side (newest entry), to prevent concatonation/repeated notes.
        document.querySelector('#note').innerHTML = '';// Clear output.
        
        // Clear input fields after capturing their values for parameters string, for POST Req.
        let title = document.getElementById('title-input').value;
        document.getElementById('title-input').value = '';
        let note = document.getElementById('note-input').value;
        document.getElementById('note-input').value = '';

        // Initialise a new request, and assign source url & parameters for it.
        var xhttp = new XMLHttpRequest();
        let url = 'http://localhost:8080/notes/create/new';
        let bodyParameters = 'title='+ title + '&note=' + note;
        
        xhttp.open('POST', url, true);// Open the request, POST. Async true.

        xhttp.onreadystatechange = function() { // On receipt of a state change from server, call anon func.
            if(xhttp.readyState == 4 && xhttp.status == 200) { // Wait for healthy connection and state.
                
                let lastNote = JSON.parse(xhttp.response); //Parse received string as a JSON, to access as properties.

                document.querySelector('#last-entry').insertAdjacentHTML('beforeend', //Prepend each html block on each loop iteration. Data from object props.
                    `<span class="entries">
                    <p><b>Date & Time Created: </b>${lastNote.Date}, @ ${lastNote.Time}</p>
                    <p><b>TITLE: </b>${lastNote.Title}</p>
                    <p><b>BODY: </b>${lastNote.Note}</p>
                    <p><b>Note ID: </b>${lastNote['Note ID']}</p>
                    </span><hr>`
                );
            }
        };
        // Set correct header information with request, after xhttp has opened.
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(bodyParameters); // Send request, with parameters as arg.
    });



    // Set event listener on show all button, to call anon function, which sends a XMLHttp GET request to read all notes in database and inserted into DOM.
    document.getElementById('all-entry').addEventListener('click',() => {
        document.querySelector('#note').innerHTML = '';// Clear output, to prevent concatonation/repeated notes.
        
        var xhttp = new XMLHttpRequest(); // New request.

        xhttp.open("GET", 'http://localhost:8080/notes/all', true); // Open request url, with a GET. (Async is true).

        xhttp.onreadystatechange = function() { // On receipt of a state change from server, call anon func.
            if (this.readyState == 4 && this.status == 200) { // Wait for healthy connection and state.
                
                // Parse received string as JSON to access as props, and return to assigned var. If nothing to convert, will return emtpy string (so not to loop).
                let allNotes = (val) => {
                    (xhttp.response.toLowerCase().indexOf('no notes found') == -1) ? val = JSON.parse(xhttp.response) : val = '' ;
                    return val;
                };

                if (!(allNotes().length)) document.querySelector('#note').innerHTML = xhttp.responseText; // If empty databse, return server message.

                // Build returned data into DOM.
                for (let i=0; i < allNotes().length; i++) { // Iterate (loop) through all notes returned from databse.
                    document.querySelector('#note').insertAdjacentHTML('beforeend', //Prepend each html block on each loop iteration. Data from object props.
                        `<span class="entries">
                        <p><b>Date & Time Created: </b>${allNotes()[i].Date}, @ ${allNotes()[i].Time}</p>
                        <p><b>TITLE: </b>${allNotes()[i].Title}</p>
                        <p><b>BODY: </b>${allNotes()[i].Note}</p>
                        <p><b>Note ID: </b>${allNotes()[i]['Note ID']}</p>
                        </span><hr>`
                    );
                }
            }
        };
        xhttp.send(); // Send Request.
    });



    // Set event listener on the delete all button, to delete all notes in database, with a DELETE reuqest.
    document.getElementById('all-del').addEventListener('click',() => {
        document.querySelector('#note').innerHTML = 'DELETED ALL YOUR NOTES!';// Clear output, and show deleted message (Update to show server message).
        document.querySelector('#last-entry').innerHTML = ''; // Clear input side.
        document.getElementById('title-input').value = ''; // Clear input field.
        document.getElementById('note-input').value = ''; // Clear input field.

        // Initialise a new request, and assign source url.
        var xhttp = new XMLHttpRequest();
        let url = 'http://localhost:8080/notes/delete/all';
        
        xhttp.open('DELETE', url, true);// Open the request, DELETE. Async true.

        // Set correct header information with request, after xhttp has opened, then send request.
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send();
    });



    // Set event listener on delete button, to call anon function, which sends a XMLHttp DELETE request to delete a specific note in database.
    document.getElementById('delete').addEventListener('click',() => {
        
        // Error catching - Disallow request if no ID entered into field, and break out.
        if (!(document.querySelector('#id-input').value)) {
            document.querySelector('#note').innerHTML = '<i>No ID entered! Cannot delete.</i>';
            return;
        }
        
        document.querySelector('#note').innerHTML = '';// Clear output.
        document.querySelector('#last-entry').innerHTML = ''; // Clear input side.

        // Assign id as the value from the id input field, then clear contents.
        let id = document.querySelector('#id-input').value;
        document.querySelector('#id-input').value = '';

        // Assign source url & parameters
        let url = 'http://localhost:8080/notes/delete/' + id;
        let bodyParameters = 'id=' + id;

        // Initialise a new request.
        var xhttp = new XMLHttpRequest();

        xhttp.open('DELETE', url, true); // Open the request url, with a DELETE. Async true.
        document.querySelector('#note').innerHTML = 'Note ' + id + ' not found!'; //Init output response, with a default/catch.
        xhttp.onreadystatechange = function() { // On receipt of a state change from server, call anon func.
            if (this.readyState == 4 && this.status == 200) { // Wait for healthy connection and state.
                document.querySelector('#note').innerHTML = xhttp.response; // Show server message, for status update on deletion request.
            }
        };
        // Set correct header information with request, after xhttp has opened, then send request, passing through parameters as arg.
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(bodyParameters);
    });



    // Set event listener on search button, to call anon function, which sends a XMLHttp GET request to find a specific note in database, and insert in DOM.
    document.getElementById('search').addEventListener('click',() => {
        
        // Error catching - Disallow request if no ID entered into field, and break out.
        if (!(document.querySelector('#id-input').value)) {
            document.querySelector('#note').innerHTML = '<i>No ID entered! Cannot search.</i>';
            return;
        }
        
        document.querySelector('#note').innerHTML = '';// Clear output.
        document.querySelector('#last-entry').innerHTML = ''; // Clear input side.

        // Assign id as the value from the id input field.
        let id = document.querySelector('#id-input').value;

        // Assign source url & parameters
        let url = 'http://localhost:8080/notes/' + id;
        let bodyParameters = 'id=' + id;

        // Initialise a new request.
        var xhttp = new XMLHttpRequest();

        xhttp.open('GET', url, true); // Open the request url, with a GET. Async true.
        xhttp.onreadystatechange = function() { // On receipt of a state change from server, call anon func.
            if (this.readyState == 4 && this.status == 200) { // Wait for healthy connection and state.
                
                if (xhttp.response.toLowerCase().indexOf('not found') > -1) {
                    document.querySelector('#note').innerHTML = xhttp.response; // Show server message, for status update on query request.
                } else {

                    let foundNote = JSON.parse(xhttp.response); //Parse received string as a JSON, to access as properties.

                    document.querySelector('#note').innerHTML = ''; // Clear output of default repsonse.
                    document.querySelector('#note').insertAdjacentHTML('beforeend', //Prepend each html block on each loop iteration. Data from object props.
                        `<span class="entries">
                        <p><b>Date & Time Created: </b>${foundNote.Date}, @ ${foundNote.Time}</p>
                        <p><b>TITLE: </b>${foundNote.Title}</p>
                        <p><b>BODY: </b>${foundNote.Note}</p>
                        <p><b>Note ID: </b>${foundNote['Note ID']}</p>
                        </span><hr>`
                    );
                }
            }
        };
        // Set correct header information with request, after xhttp has opened, then send request, passing through parameters as arg.
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(bodyParameters);
    });



    // Set event listener on update button, to call anon function, which sends a XMLHttp PUT request to find a specific note in database, update it, and insert in DOM.
    document.getElementById('update').addEventListener('click',() => {

        // Error catching - Disallow request if no ID entered into field, and break out.
        if (!(document.querySelector('#id-input').value) || !(document.querySelector('#title-input').value) || !(document.querySelector('#note-input').value)) {
            document.querySelector('#note').innerHTML = '<i>Missing incomplete fields! Cannot update note without a Title, Note and ID of the note you want to update.</i>';
            return;
        }

        document.querySelector('#note').innerHTML = '';// Clear output.
        document.querySelector('#last-entry').innerHTML = ''; // Clear input side.

        // Assign id, title and note as the values from the input fields, then clear contents.
        let id = document.querySelector('#id-input').value;
        document.querySelector('#id-input').value = '';
        let title = document.querySelector('#title-input').value;
        let note = document.querySelector('#note-input').value;
        

        // Assign source url & parameters
        let url = 'http://localhost:8080/notes/update/' + id;
        let bodyParameters = 'id=' + id + '&title=' + title + '&note=' + note;

        // Initialise a new request.
        var xhttp = new XMLHttpRequest();

        xhttp.open('PUT', url, true); // Open the request url, with a PUT. Async true.
        document.querySelector('#note').innerHTML = 'Note ' + id + ' not found!'; //Init output response, with a default/catch.
        xhttp.onreadystatechange = function() { // On receipt of a state change from server, call anon func.
            //console.log(this.readyState);
            //console.log(this.status);
            if (this.readyState == 4 && this.status == 200) { // Wait for healthy connection and state.
                
                if (xhttp.response.toLowerCase().indexOf('not found') > -1) {
                    document.querySelector('#note').innerHTML = xhttp.response; // Show server message, for status update on query request.
                } else {
                    
                    // Clear remaining input fields on successful update.
                    document.querySelector('#note-input').value = '';
                    document.querySelector('#title-input').value = '';

                    let updatedNote = JSON.parse(xhttp.response); //Parse received string as a JSON, to access as properties.
                    
                    document.querySelector('#note').innerHTML = ''; // Clear output of default repsonse.
                    document.querySelector('#last-entry').insertAdjacentHTML('beforeend', //Prepend each html block on each loop iteration. Data from object props.
                        `<span class="entries">
                        <p><b>Date & Time Created: </b>${updatedNote[1].Date}, @ ${updatedNote[1].Time}</p>
                        <p><b>TITLE: </b>${updatedNote[1].Title}</p>
                        <p><b>BODY: </b>${updatedNote[1].Note}</p>
                        <p><b>Note ID: </b>${updatedNote[1]['Note ID']}</p>
                        </span><hr>`
                    );
                }
            }
        };
        // Set correct header information with request, after xhttp has opened, then send request, passing through parameters as arg.
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(bodyParameters);
    });
}