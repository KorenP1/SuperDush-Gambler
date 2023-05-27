function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleepNfadeNremove(id, seconds) {
  
    await sleep(seconds * 1000);
  
    let element = document.getElementById(id);
  
    element.style.transition = "opacity 1s linear";
    element.style.opacity = "0";
  
    await sleep(1 * 1000);
  
    element.remove();
  }

function updateTextInput(val) {
    document.getElementById('range-output').innerHTML = "Mine Count: " + val; 
  }

function betMultiplier(multiplier) {
    document.getElementById('bet-input').value = document.getElementById('bet-input').value * multiplier;
}

function reDirectIfNeeded(url, responseURL) {
  if (url !== responseURL) {
    window.location.href = responseURL;
  }
}

function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

function updateStats() {
  let korenpDontWantYouToWin = 0.97;
  let bet = document.getElementById('currBet').innerHTML.split(' ')[1];
  let mines = document.getElementById('currBet').innerHTML.split(' ')[3];
  let gems = 0;
  for (let element of document.getElementById('div-wrapper').children) {
    if (element.firstChild.src === document.location.origin + '/img/greenGem.png') {
      gems++;
    }
  }
  if (gems === 0) {
    document.getElementById('stats').innerHTML = '0.00 (0.00x)'
    return
  }
  let pWin = factorial(25 - mines) * factorial(25 - gems) / factorial(25) / factorial(25 - mines - gems);
  let earned = 1 / pWin * korenpDontWantYouToWin * bet;
  if (bet == 0) {
    bet = 1;
  }
  final = earned.toFixed(2) + ' (' + (earned / bet).toFixed(2) + 'x)';
  document.getElementById('stats').innerHTML = final;
}

function doesAbleToCollectCredits() {
  let creditsButton = document.getElementById("creditsButton");
  let url = document.location.origin + "/doesAbleToCollectCredits";
  let req = new XMLHttpRequest();

  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.responseText === "True") {
              creditsButton.disabled = false;
              creditsButton.style.backgroundColor = "orange";
              creditsButton.style.cursor = "pointer";
              creditsButton.innerHTML = "Collect 10 Credits";
          }
          if (this.responseText === "False") {
              creditsButton.disabled = true;
              creditsButton.style.backgroundColor = "rgb(192, 104, 104)";
              creditsButton.style.cursor = "not-allowed";
              creditsButton.innerHTML = "Try Again Tommorow :|";
        }
      }
  }
  req.open('GET', url, true);
  req.send();
}

function collectCredits() {
  let creditsButton = document.getElementById("creditsButton");
  let url = document.location.origin + "/collectCredits";
  let req = new XMLHttpRequest();

  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.responseText === "Success") {
              creditsButton.disabled = true;
              creditsButton.style.backgroundColor = "rgb(46, 204, 113)";
              creditsButton.style.cursor = "not-allowed";
              creditsButton.innerHTML = "10 Credits Collected :)";
              getCredits();
          }
      }
  }
  req.open('GET', url, true);
  req.send();
}

function getCredits() {
  let url = document.location.origin + "/getCredits";
  let req = new XMLHttpRequest();

  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.status === 200) {
              updateCreditsLocal(parseFloat(this.responseText));
              updateCreditsInHTML();
          }
      }
  }
  req.open('GET', url, true);
  req.send();
}

function loadGame() {
  let url = document.location.origin + "/loadGame";
  let req = new XMLHttpRequest();

  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.status === 200) {
              // X = Not Clicked
              // G = Clicked And Not Bomb
              let data = this.responseText.split(' ')
              let game = data[0];
              let bet = parseFloat(data[1]);
              let mines = parseInt(data[2]);
              for (const [index, element] of [...game].entries()) {
                let currDiv = document.getElementById(index)
                if (element == "G") {
                  currDiv.getElementsByTagName('img')[0].src = 'img/greenGem.png';
                  currDiv.style.pointerEvents = "none";
                }
                else {
                  currDiv.style.pointerEvents = "auto";
                }
              }
              document.getElementById('currBet').innerHTML = 'Bet: ' + bet + ' Mines: ' + mines;
              updateStats();
          }
      }
  }
  req.open('GET', url, true);
  req.send();
}

function startGame() {
  let url = document.location.origin + "/startGame";
  let req = new XMLHttpRequest();
  let betCredits = document.getElementById('bet-input').value;
  let mineCount = document.getElementById('range-input').value; 
  let params = 'betCredits=' + betCredits + '&mineCount=' + mineCount;

  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.status === 200) {
            document.getElementById('stats').style.color = "#85bb65";
            for (let element of document.getElementById('div-wrapper').getElementsByTagName('div')) {
                let img = element.getElementsByTagName('img')[0];
                img.src = 'img/question.png';
                img.style.opacity = 1;
                img.style.width = "65%";
                element.style.pointerEvents = "auto";
            }
            updateCreditsLocal(parseFloat((credits_local - betCredits).toFixed(2)));
            updateCreditsInHTML();
            document.getElementById('currBet').innerHTML = 'Bet: ' + betCredits + ' Mines: ' + mineCount;
            updateStats();
          }
      }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  req.send(params);
}

function submit(div) {
  let url = document.location.origin + "/submit";
  let req = new XMLHttpRequest();
  divLocation = div.id;
  let params = 'divLocation=' + divLocation; 

  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.responseText.length === 25) {
            div.getElementsByTagName('img')[0].src = 'img/bomb.png';
            for (let element of document.getElementById('div-wrapper').getElementsByTagName('div')) {
              let img = element.getElementsByTagName('img')[0];
              element.style.pointerEvents = "none";
              document.getElementById('stats').innerHTML = '0.00 (0.00x)';
              document.getElementById('stats').style.color = "red";
              div.style.pointerEvents = "none";
              if (img.src === window.location.origin + '/img/question.png') {
                img.style.opacity = 0.3;
                img.style.width = "50%";
                if (this.responseText[element.id] == 'B') {
                    img.src = 'img/bomb.png'
                  }
                else {
                  img.src = 'img/greenGem.png';
                }
                }
              }
          }
          if (this.responseText === "NotBomb") {
            div.getElementsByTagName('img')[0].src = 'img/greenGem.png';
            updateStats();
          }
          div.style.pointerEvents = "none";
          div.getElementsByTagName('circle')[0].classList.remove('spinning');
      }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  req.send(params);
  div.getElementsByTagName('circle')[0].classList.add('spinning');
}

function cashout() {
  let url = document.location.origin + "/cashout";
  let req = new XMLHttpRequest();

  req.onreadystatechange = async function() {
      if (this.readyState === 4) {
          reDirectIfNeeded(url, this.responseURL);
          if (this.status === 200) {
              updateCredits = parseFloat((credits_local + parseFloat(this.responseText)).toFixed(2));
              updateCreditsLocal(updateCredits);
              updateCreditsInHTML();
              if (this.responseText != 0) {
                  startConfetti();
                  await sleep(0.5 * 1000);
                  stopConfetti();
              }
          }
      }
  }
  req.open('GET', url, true);
  req.send();
}

function updateCreditsLocal(credits) {
  credits_local = credits;
}

function updateCreditsInHTML() {
    document.getElementById('CreditsCounter').innerHTML = "Credits: " + credits_local;
}

function maxCredits() {
  document.getElementById('bet-input').value = credits_local;
}

function main() {

    // Set Default Credits Value
    getCredits();

    // Load Game
    loadGame();

    // Disabled Buttons Startup
    creditsButton.disabled = true;

    // doesAbleToCollectCredits, True/False API
    doesAbleToCollectCredits();

    // Loading Screen
    sleepNfadeNremove("fade", 2);
  
  }

let credits_local = 0;
main();