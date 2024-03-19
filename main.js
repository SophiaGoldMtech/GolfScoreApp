function getAvailableGolfCourses() {
  return fetch(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json"
  )
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      let courses = data;

      let courseOptionsHtml =
        "<option value='-1' selected disabled hidden>Select Course</option>";
      courses.forEach((course) => {
        courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
      });

      document.getElementById("course-select").innerHTML = courseOptionsHtml;
    });
}

getAvailableGolfCourses();

function courseSelection() {
  let golfCourseId = document.getElementById("course-select").value;

  let response = getGolfCourseDetails(golfCourseId);
  response.then((courseDetails) => {
    let teeBoxes = courseDetails.holes[0].teeBoxes;

    let teeBoxSelectHtml =
      "<option value='-1' selected disabled hidden>Select Tee</option>";

    teeBoxes.forEach(function (teeBox, index) {
      teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
        teeBox.yards
      } yards</option>`;
    });

    document.getElementById("tee-select").innerHTML = teeBoxSelectHtml;

    document
      .getElementById("tee-select")
      .addEventListener("change", function () {
        teeSelection(courseDetails);
      });
  });
}

function getGolfCourseDetails(golfCourseId) {
  return fetch(
    `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`
  ).then(function (response) {
    return response.json();
  });
}

function teeSelection(courseDetails) {
  let selectedTee = document.getElementById("tee-select").value;
  let holeStats = courseDetails.holes.map(function (hole) {
    return {
      yardage: hole.teeBoxes[selectedTee].yards,
      par: hole.teeBoxes[selectedTee].par,
      handicap: hole.teeBoxes[selectedTee].hcp,
    };
  });
  render(holeStats);
}

function render(holeStats) {
  clearTableBody();

  holeStats.forEach((hole, index) => {
    if (index < 9) {
      const yardageRow = document.getElementById("front-yardage");
      const parRow = document.getElementById("front-par");
      const handicapRow = document.getElementById("front-handicap");

      appendDataToRow(yardageRow, holeStats[index].yardage);
      appendDataToRow(parRow, holeStats[index].par);
      appendDataToRow(handicapRow, holeStats[index].handicap);
    } else {
      const yardageRow = document.getElementById("back-yardage");
      const parRow = document.getElementById("back-par");
      const handicapRow = document.getElementById("back-handicap");

      appendDataToRow(yardageRow, holeStats[index].yardage);
      appendDataToRow(parRow, holeStats[index].par);
      appendDataToRow(handicapRow, holeStats[index].handicap);
    }
  });
}

function clearTableBody() {
  const frontNine = document.getElementById("front-nine");
  const tdElements = frontNine.querySelectorAll("td");
  tdElements.forEach((td) => td.remove());

  const backNine = document.getElementById("back-nine");
  const tdElementsBack = backNine.querySelectorAll("td");
  tdElementsBack.forEach((td) => td.remove());
}

function appendDataToRow(row, data) {
  const cell = document.createElement("td");
  cell.textContent = data;
  row.appendChild(cell);
}

let players = [];

class Player {
  constructor(name, id, scores = []) {
    this.name = name;
    this.id = id;
    this.scores = scores;
  }

  updateTableScores() {
    this.scores.forEach((score, index) => {
      let cell = document.getElementById(
        `${this.name.toLowerCase()}-${index + 1}`
      );
      cell.innerHTML = score;
    });
  }
}

function addPlayer() {
  if (players.length === 0 || players[0].scores.length === 0) {
    if (players.length < 4) {
      const playerNameInput = document.getElementById("player-input");
      const playerName = playerNameInput.value.trim().toUpperCase();

      if (playerName === "") {
        alert("Please enter a valid player name.");
        return;
      }

      if (!playerRender(playerName)) {
        return;
      }

      const playerId = players.length + 1;
      const newPlayer = new Player(playerName, playerId);
      players.push(newPlayer);

      playerNameInput.value = "";
    } else {
      alert("Golf is only for 4 people at a time.");
      playerNameInput.value = "";
    }
  }
}

document.getElementById("add-player-btn").addEventListener("click", addPlayer);

let currentPlayer = 0;
let currentHoleNumber = 1;

function playerRender(playerName) {
  const frontTable = document.getElementById("front-tbody");
  const backTable = document.getElementById("back-tbody");
  const totalTable = document.getElementById("total-tbody");

  if (!frontTable || !backTable) {
    console.error("Front or back table does not exist.");
    return false;
  }

  const frontPlayerRow = document.createElement("tr");
  frontPlayerRow.setAttribute("id", playerName.toLowerCase() + "-front-row");
  frontPlayerRow.innerHTML = `<th>${playerName}</th>`;
  frontTable.appendChild(frontPlayerRow);

  const backPlayerRow = document.createElement("tr");
  backPlayerRow.setAttribute("id", playerName.toLowerCase() + "-back-row");
  backPlayerRow.innerHTML = `<th>${playerName}</th>`;
  backTable.appendChild(backPlayerRow);

  const totalPlayerRow = document.createElement("tr");
  totalPlayerRow.setAttribute("id", playerName.toLowerCase() + "-total-row");
  totalPlayerRow.innerHTML = `<th>${playerName}</th>
  <td id="${playerName.toLowerCase()}-total-score"></td>`;
  totalTable.appendChild(totalPlayerRow);

  sillyMessages();

  let frontCells = frontPlayerRow.cells.length;
  let backCells = 10;

  while (frontCells < 10) {
    frontPlayerRow.innerHTML += `<td id="${playerName.toLowerCase()}-${frontCells}"></td>`;
    frontCells = frontPlayerRow.cells.length;
  }
  frontPlayerRow.innerHTML += `<td id="${playerName.toLowerCase()}-out"></td>`;

  while (backCells < 19) {
    backPlayerRow.innerHTML += `<td id="${playerName.toLowerCase()}-${backCells}"></td>`;
    backCells++;
  }
  backPlayerRow.innerHTML += `<td id="${playerName.toLowerCase()}-in"></td>`;

  return true;
}

function addScore() {
  let scoreInput = document.getElementById("score-input");
  let score = parseInt(scoreInput.value);
  if (isNaN(score)) {
    alert("Please input a valid number.");
    return;
  }
  players[currentPlayer].scores.push(score);
  scoreInput.value = "";

  scoreRender();
  calculateSum(currentPlayer);

  if (currentPlayer < players.length - 1) {
    currentPlayer++;
  } else {
    currentPlayer = 0;
    currentHoleNumber++;
  }
  whosTurn();
  sillyMessages();
  gameOver();
}

document.getElementById("score-submit-btn").addEventListener("click", addScore);

function scoreRender() {
  players.forEach((player) => {
    player.updateTableScores();
  });
}

function whosTurn() {
  const currentScore = document.getElementById("current-score");
  if (currentHoleNumber < 18) {
    currentScore.innerHTML = `Hey, ${players[currentPlayer].name}! It's your turn! We're currently playing hole ${currentHoleNumber}.`;
  } else if ((currentHoleNumber = 18)) {
    alert(`This is your last hole, fellas. Make it a good one.`);
    currentScore.innerHTML = `Thanks for playing ${players[
      currentPlayer
    ].name.toLowerCase()}. We had a blast! Don't be a stranger. See you soon.`;
  }
}

function calculateSum(currentPlayer) {
  let player = players[currentPlayer].name.toLowerCase();
  let score = players[currentPlayer].scores;
  let outArray = score.slice(0, 9);
  let inArray = score.slice(9, 18);

  let outSum = sumArray(outArray);
  let inSum = sumArray(inArray);
  let total = outSum + inSum;

  const outCell = document.getElementById(`${player}-out`);
  outCell.innerHTML = outSum;

  const inCell = document.getElementById(`${player}-in`);
  inCell.innerHTML = inSum;

  const totalCell = document.getElementById(`${player}-total-score`);
  totalCell.innerHTML = total;
}

function sumArray(scores) {
  return scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

function sillyMessages() {
  const tableLabel = document.getElementById("total-table-label");
  let totalTableHtml = ``;
  if (currentHoleNumber === 1) {
    totalTableHtml = `*TOTAL SCORES*`;
  } else if (currentHoleNumber === 2) {
    totalTableHtml = `Nice first round, can you do it again?`;
  } else if (currentHoleNumber === 3) {
    totalTableHtml = `Well that one was certainly something...`;
  } else if (currentHoleNumber === 4) {
    totalTableHtml = `No no no, your swing is GREAT. You don't need to work on that ~AT ALL~`;
  } else if (currentHoleNumber === 5) {
    totalTableHtml = `¯\_(ツ)_/¯`;
  } else if (currentHoleNumber === 6) {
    totalTableHtml = `I really wasn't sure if I'd like you all...`;
  } else if (currentHoleNumber === 7) {
    totalTableHtml = `That's it. I just didn't think I'd like you.`;
  } else if (currentHoleNumber === 8) {
    totalTableHtml = `It's your hair. Is that on purpose?`;
  } else if (currentHoleNumber === 9) {
    totalTableHtml = `YES? Well that's my bad.`;
  } else if (currentHoleNumber === 10) {
    totalTableHtml = `In my defense, I don't have hair, I don't know how it's supposed to work.`;
  } else if (currentHoleNumber === 11) {
    totalTableHtml = `See? No hair. \(•◡•)/`;
  } else if (currentHoleNumber === 12) {
    totalTableHtml = `(~˘▾˘)~ This is me, by the way. I'm not sure if that was clear.`;
  } else if (currentHoleNumber === 13) {
    totalTableHtml = `You guys really aren't that bad...♥‿♥`;
  } else if (currentHoleNumber === 14) {
    totalTableHtml = `I think maybe we're best friends now? ⚆ _ ⚆`;
  } else if (currentHoleNumber === 15) {
    totalTableHtml = `BUT WAIT! Hole 15??? And then you leave me?!`;
  } else if (currentHoleNumber === 16) {
    totalTableHtml = `ಠ╭╮ಠ ... (ง'̀-'́)ง ... (ಥ﹏ಥ)`;
  } else if (currentHoleNumber === 17) {
    totalTableHtml = `I miss you already ♡`;
  } else if (currentHoleNumber === 18) {
    totalTableHtml = `Goodbye old friend, I'll never forget how bad you were at golf. LUV U! BYE!`;
    let gameOver = true;
    return gameOver;
  }
  tableLabel.innerHTML = totalTableHtml;
}

function gameOver() {
  if (gameOver) {
    document.documentElement.innerHTML =
      "What are you still doing here? GOLF is over. Go home.";
  }
}
