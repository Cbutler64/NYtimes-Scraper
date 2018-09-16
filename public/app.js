// Grab the articles as a json
var deleteID;

$(document).ready(function(){

  getArticles()
})

function getArticles(){
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    
    // Display the apropos information on the page
    $("#articles").append("<p class = notes data-id='" + data[i]._id + "'>Title: " + data[i].title +  "</p>");
    $("#articles").append("<br>");
    $("#articles").append("<a>Link: " + data[i].link  + "</a>");
    $("#articles").append("<p>Summary: " + data[i].summary  + "</p>");
    
    var btnMakeNote = $("<button>");
    btnMakeNote.addClass("makenote-button btn-primary btn-xs");
    btnMakeNote.css("cursor", "pointer");
    btnMakeNote.text("Make a Note");
    btnMakeNote.css("width", "30%");
    btnMakeNote.css("border-radius", "15px");
    btnMakeNote.attr("data-id", data[i]._id)
    var btnViewNotes = $("<button>");
    btnViewNotes.addClass("viewnotes-button btn-primary btn-xs");
    btnViewNotes.css("cursor", "pointer");
    btnViewNotes.text("View Notes");
    btnViewNotes.css("width", "30%");
    btnViewNotes.css("border-radius", "15px");
    btnViewNotes.attr("data-id", data[i]._id)
    $("#articles").append(btnMakeNote);
    $("#articles").append(btnViewNotes);
    $("#articles").append("<br>");
    $("#articles").append("<br>");
    $("#articles").append("<br>");
  }
});
}
$(document).on("click", "#scrapeBtn", function() {
$.getJSON("/scrape", function(data) {
  console.log(data);
}).then(function() {
 getArticles()
});
});
// Whenever someone clicks makenote button
$(document).on("click", ".makenote-button", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2> Title:" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      //if (data.note) {
        // Place the title of the note in the title input
      //  $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
      //  $("#bodyinput").val(data.note.body);
      //}
    });
});


$(document).on("click", ".viewnotes-button", function() {
  // Empty the notes from the note section
  var thisId = $(this).attr("data-id");
 viewNotes(thisId)
});

function viewNotes(ID){
  
  deleteID = "";
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = ID;
  deleteID = ID;
  console.log(thisId)
  $("#notes").append("<h2>Article Notes:</h2>");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      if (data.note) {
        for (var i = 0; i < data.note.length; i++){

          $("#notes").append("<h2 class = 'notes'>" + data.note[i].title + "</h2>");
          $("#notes").append("<h4 class = 'notes'>" + data.note[i].body + "</h4>");
          var btnDeleteNote = $("<button>");
          btnDeleteNote.addClass("deletenote-button btn-primary btn-xs");
          btnDeleteNote.css("cursor", "pointer");
          btnDeleteNote.text("Delete Note");
          btnDeleteNote.css("width", "30%");
          btnDeleteNote.css("border-radius", "15px");
          btnDeleteNote.attr("data-id", data.note[i]._id)
          $("#notes").append(btnDeleteNote);
          $("#notes").append("<br>");
          $("#notes").append("<br>");
        }
      }

      if (data.note.length < 1){
        $("#notes").append("<h2>There are no notes for this article</h2>");
      }
     
    });
}

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      viewNotes(thisId);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".deletenote-button", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "Delete",
    url: "/notes/" + thisId,
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      viewNotes(deleteID);
    });

  // Also, remove the values entered in the input and textarea for note entry
});