document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;

  if (currentPath.endsWith("index.html")) {
    runIndex();
  } else if (currentPath.endsWith("signup.html")) {
    runSignup();
  } else if (currentPath.endsWith("progress.html")) {
    runProgress();
  } else if (currentPath.endsWith("profile.html")) {
    runProfile();
  } else if (currentPath.endsWith("composition.html")) {
    runComposition();
  } else if (currentPath.endsWith("preference.html")) {
    runPreference();
  } else if (currentPath.endsWith("scheduling.html")) {
    runScheduling();
  }
});

function fetchUserId(callback) {
  const token = localStorage.getItem('token');
  fetch('/getUserId', {
    headers: {
      'Authorization': token
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Not logged in');
      }
    })
    .then(data => {
      window.userId = data.userId; // Store userId globally
      callback();
    })
    .catch(error => {
      console.error('Error:', error);
      window.location.href = '/';
    });
}

function runIndex() {
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/home', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/progress';
      } else {
        alert(data);
      }
    })
    .catch(error => console.error('Error:', error));
  });
}

function runSignup() {
  document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const fullName = document.getElementById('fullName').value;
    const password = document.getElementById('password').value;
    const coach = document.getElementById('coach').checked;

    fetch('/submitSignup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, password, coach })
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
      window.location.href = '/';
    })
    .catch(error => console.error('Error:', error));
  });
}

function runProgress() {
  const token = localStorage.getItem('token');
  console.log("UserId:", window.userId);
  // progress bar stuff done with https://codeconvey.com/semi-circle-progress-bar-css/

  // Access the userId passed from the server
  const userId = "<%= userId %>";
  console.log("User ID:", userId);

  function animatePercentage(perc) {
    if (perc == 101) {
        perc1 = 0;
    } else {
        perc1 = perc;
    }
    $(".progress").each(function(){
        var $bar = $(this).find(".bar");
        var $val = $(this).find("span");
        $({p:0}).animate({p:perc1}, {
        duration: 1000,
        easing: "swing",
        step: function(p) {
            $bar.css({
                transform: "rotate("+ (45+(p*1.8)) +"deg)", // 100%=180° so: ° = % * 1.8
                // 45 is to add the needed rotation to have the green borders at the bottom
            });
            $val.text((perc1 + "%"));
            if (perc === 101) {
                $val.text("No Tasks Yet");
            }
        }
        });
    }); 
}

$(document).ready(animatePercentage(101));

const taskInput = document.getElementById("task");
const addBtn = document.getElementById("add");
const taskList = document.getElementById("taskList");
let done = 0;

// Add task
addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        createTask(taskText);
        taskInput.value = "";
    }
});

// Create a new task
function createTask(text) {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <div style="margin-top: 1px; margin-bottom: 1px; background-color: #FFD300; display: table; align-items: center; border-radius: 4px; min-width: 100px;width: fit-content; height: 20px; border: 1px solid black; ">
        <button class="complete" style="border-radius: 2px; border: 1px solid gray; background-color: white; font-family: 'Impact', 'fantasy', 'Arial Black'; font-weight: 1000; font-size: 10px; color: #25b396; height: 20px; width: 20px; padding: 0px; margin: 1px;"></button>
        <span style="position: relative; font-size: 16px; ">${text}</span>
        </div>
    `;
    taskList.appendChild(taskItem);

    // Delete task
    const deleteBtn = taskItem.querySelector(".complete");
    deleteBtn.addEventListener("click", () => {
        deleteBtn.innerHTML="&#10003;"
        taskItem.remove();
        done -= 1;
        animatePercentage(100*done/total);
    });

    total += 1;
    done += 1;
    animatePercentage(100*done/total);
}
}

function runProfile() {
  console.log("UserId:", window.userId);
  const userId = window.userId;

  const genderChart = new Chart(document.getElementById('genderChart'), {
    type: 'pie',
    data: {
      labels: ['Male', 'Female', 'Other'],
      datasets: [{
        label: 'Gender',
        data: [50, 50, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }],
    },
  });

  const ageChart = new Chart(document.getElementById('ageChart'), {
    type: 'bar',
    data: {
      labels: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      datasets: [{
        label: 'Age',
        data: [5, 10, 15, 20, 10, 5, 2],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const weightChart = new Chart(document.getElementById('weightChart'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Weight',
        data: [200, 195, 190, 185, 180, 175, 170],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

function runComposition() {
  console.log("UserId:", window.userId);
  const userId = window.userId;

  const compositionData = {
    labels: ['Fat', 'Muscle', 'Bone', 'Water'],
    datasets: [{
      label: 'Body Composition',
      data: [20, 50, 10, 20],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const compositionChart = new Chart(document.getElementById('compositionChart'), {
    type: 'doughnut',
    data: compositionData,
  });
}

function runPreference() {
  console.log("UserId:", window.userId);
  const userId = window.userId;

  const preferenceData = {
    labels: ['Cardio', 'Strength', 'Flexibility', 'Balance'],
    datasets: [{
      label: 'Exercise Preferences',
      data: [25, 50, 15, 10],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  const preferenceChart = new Chart(document.getElementById('preferenceChart'), {
    type: 'polarArea',
    data: preferenceData,
  });
}

function runScheduling() {
  console.log("UserId:", window.userId);
  const userId = window.userId;

  // FullCalendar initialization code here
}