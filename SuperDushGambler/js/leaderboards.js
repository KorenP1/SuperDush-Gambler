function addToLeaderboards(currLeader) {
    let credits = currLeader.split(' ')[0]
    let user = currLeader.split(' ')[1]
    let leaderboardsTable = document.getElementById('leaderboards');
    if (leaderboardsTable.rows[1].cells[1].textContent === '') {
        leaderboardsTable.rows[1].cells[1].textContent = user;
        leaderboardsTable.rows[1].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[2].cells[1].textContent === '') {
        leaderboardsTable.rows[2].cells[1].textContent = user;
        leaderboardsTable.rows[2].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[3].cells[1].textContent === '') {
        leaderboardsTable.rows[3].cells[1].textContent = user;
        leaderboardsTable.rows[3].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[4].cells[1].textContent === '') {
        leaderboardsTable.rows[4].cells[1].textContent = user;
        leaderboardsTable.rows[4].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[5].cells[1].textContent === '') {
        leaderboardsTable.rows[5].cells[1].textContent = user;
        leaderboardsTable.rows[5].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[6].cells[1].textContent === '') {
        leaderboardsTable.rows[6].cells[1].textContent = user;
        leaderboardsTable.rows[6].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[7].cells[1].textContent === '') {
        leaderboardsTable.rows[7].cells[1].textContent = user;
        leaderboardsTable.rows[7].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[8].cells[1].textContent === '') {
        leaderboardsTable.rows[8].cells[1].textContent = user;
        leaderboardsTable.rows[8].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[9].cells[1].textContent === '') {
        leaderboardsTable.rows[9].cells[1].textContent = user;
        leaderboardsTable.rows[9].cells[2].textContent = credits;
    }
    else if (leaderboardsTable.rows[10].cells[1].textContent === '') {
        leaderboardsTable.rows[10].cells[1].textContent = user;
        leaderboardsTable.rows[10].cells[2].textContent = credits;
    }
}

function leaderboards() {
    let url = document.location.origin + "/getLeaderboards";
    let req = new XMLHttpRequest();
  
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let data = this.responseText;
                data = data.split('\n');
                data.forEach(addToLeaderboards);
            }
        }
    }
    req.open('GET', url, true);
    req.send();
  }

leaderboards();