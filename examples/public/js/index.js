var examples = [
  { name : "simple",
    url : "public/examples/simple.html"}
]
var 
  jlist    = $("#list"),
  jsource  = $("#source"),
  jpreview = $("#preview");

$(() => {

  examples.forEach(function(example) {
    var button = $("<button class='btn-list'> " + example.name + " </button>");
    jlist.append(button);
    button.click(() => $.get(example.url, function(data) {
      LoadData(data);
      LoadPreview(example.url);
    }));
  });

});

function LoadData(data) {
  var content = jsource.find("#source-content");
  content.text(data);
  sh_highlightDocument();
}

function LoadPreview(url) {
  jpreview.attr("src", url); 
}
