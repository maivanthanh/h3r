$(function() {
    var clip = new h3r.Clip(document.getElementById("main"));
    let urlParams = new URLSearchParams(window.location.search);
    let h3rURL = urlParams.get('url');
    if (!h3rURL) {
        console.error("format: https://h3rembed.vn?url=<your_url_here>");
    } else {
        clip.appendH3R(h3rURL);
    }
});
