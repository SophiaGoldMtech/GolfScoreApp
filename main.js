function getAvailableGolfCourses() {
  return [
    {
      id: 11819,
      name: "Thanksgiving Point Golf Course - Lehi, UT",
      url: "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course11819.json",
    },
    {
      id: 18300,
      name: "Fox Hollow Golf Course - American Fork, UT",
      url: "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course18300.json",
    },
    {
      id: 19002,
      name: "Spanish Oaks Golf Course - Spanish Fork, UT",
      url: "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course19002.json",
    },
  ];
}

let courses = getAvailableGolfCourses();

let courseOptionsHtml =
  "<option value='-1' selected disabled hidden>Select Course</option>";
courses.forEach((course) => {
  courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
});

document.getElementById("course-select").innerHTML = courseOptionsHtml;

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
  return fetch("./response.json").then((response) => {
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
  console.log(holeStats);
  let scorecard = document.getElementById("scorecard-container");
  let tableHtml = ``;
}
