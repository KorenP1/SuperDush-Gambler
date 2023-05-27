function v() {
    let checked;
    let responseDiv = document.getElementById("response-div");
    let req = new XMLHttpRequest();
    let params = "username=" + document.getElementById("username").value + "&password=" + document.getElementById("password").value;

    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status !== 200) {
                responseDiv.style.color = "red";
                responseDiv.innerHTML = this.responseText;
            }
            else {
                if (checked) {
                    responseDiv.style.color = "rgb(46, 204, 113)";
                    responseDiv.innerHTML = this.responseText;
                }
                else {
                    window.location.href = document.location.origin;
                }
            }
        }
    }

    if (document.getElementById("checkbox").checked) {
        checked = document.getElementById("checkbox").checked
        let url = document.location.origin + "/signup";
        req.open('POST', url, true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(params);
    }
    else {
        checked = document.getElementById("checkbox").checked
        let url = document.location.origin + "/login";
        req.open('POST', url, true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(params);
    }
}