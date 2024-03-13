let courses = [
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

//functions

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