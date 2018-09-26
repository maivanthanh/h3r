$(function() {
    var clip = new h3r.Clip(document.getElementById("main"));
    let urlParams = new URLSearchParams(window.location.search);
    let h3rURL = urlParams.get('url');
    clip.appendH3R(h3rURL);
});
