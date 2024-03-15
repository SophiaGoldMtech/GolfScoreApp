//Ask Michael what he altered in this!!
// function getAvailableGolfCourses() {
//     return fetch(
//         "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
//         { mode: "no-cors" }
//     ).then(function (response) {
//     return response.json();
// }).then((data) => {
//     console.log(data)
//     return data
// });
//Return this data into the courses array down below.
// }

let course = [
    {
      id: 11819,
      name: 'Thanksgiving Point Golf Course - Lehi, UT',
      url: 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course11819.json'
    },
    {
      id: 18300,
      name: 'Fox Hollow Golf Course - American Fork, UT',
      url: 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course18300.json'
    },
    {
      id: 19002,
      name: 'Spanish Oaks Golf Course - Spanish Fork, UT',
      url: 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course19002.json'
    }
  ]

function courseSelected() {
    let golfCourseId = document.getElementById("course-select").value;
    console.log(golfCourseId)
    return golfCourseId;
}

function getGolfCourseDetails(golfCourseId) {
return fetch(
    `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
    { mode: "no-cors" }
).then(function (response) {
    return response.json();
});
}

//Add Course Options
let courseOptionsHtml = '';
courses.forEach((course) => {
 courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
});

document.getElementById('course-select').innerHTML = courseOptionsHtml;


//Add Tee Options
let teeBoxSelectHtml = ''
teeBoxes.forEach(function (teeBox, index) {
   teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
     teeBox.totalYards
   } yards</option>`
});

document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;

let selectedCourse = 

function render() {
    let tableHtml = `<h2>FRONT 9</h2>
    <table id="front-nine" class="table table-bordered">
      <thead>
        <tr>
          <th>HOLE</th>
          <th>01</th>
          <th>02</th>
          <th>03</th>
          <th>04</th>
          <th>05</th>
          <th>06</th>
          <th>07</th>
          <th>08</th>
          <th>09</th>
          <th>OUT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>YARDAGE</th>
          <td>${courseInfo.holes[].teeboxes[].yards}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>PAR</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>HANDICAP</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>PLAYER 1</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div id="back-nine-container" class="table-responsive">
    <h2>BACK 9</h2>
    <table id="back-nine" class="table table-bordered">
      <thead>
        <tr>
          <th>HOLE</th>
          <th>10</th>
          <th>11</th>
          <th>12</th>
          <th>13</th>
          <th>14</th>
          <th>15</th>
          <th>16</th>
          <th>17</th>
          <th>18</th>
          <th>IN</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>YARDAGE</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>PAR</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>HANDICAP</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th>PLAYER 1</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
      </table>`
}