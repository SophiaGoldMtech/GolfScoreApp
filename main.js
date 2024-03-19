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
    }
  }
}

document.getElementById("add-player-btn").addEventListener("click", addPlayer);

let currentPlayer = 0;
let currentHoleNumber = 1;

function playerRender(playerName) {
  const frontTable = document.getElementById("front-tbody");
  const backTable = document.getElementById("back-tbody");

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
  backPlayerRow.innerHTML += `<td id="${playerName.toLowerCase()}-total"></td>`;

  console.log(frontTable);

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
}

document.getElementById("score-submit-btn").addEventListener("click", addScore);

function scoreRender() {
  players.forEach((player) => {
    player.updateTableScores();
  });
}

function whosTurn() {
  const currentScore = document.getElementById("current-score");
  currentScore.innerHTML = `Hey, ${players[currentPlayer].name}! It's your turn! We're currently playing hole ${currentHoleNumber}.`;
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

  const totalCell = document.getElementById(`${player}-total`);
  totalCell.innerHTML = total;
}

function sumArray(scores) {
  return scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}
