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
  }
});

function fetchUserId(callback) {
  fetch('/getUserId')
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
  console.log("Running index.js code");
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/home', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.text())
    .then(data => {
      if (data === "Invalid email or password") {
        alert(data);
      } else {
        window.location.href = '/progress';
      }
    })
    .catch(error => console.error('Error:', error));
  });
}

function runSignup() {
  console.log("Running signup.js code");
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
        deleteBtn.innerHTML="&#10003";
        if (!deleteBtn.disabled) {
            done++;
            animatePercentage((done/taskList.children.length)*100);
        }
        deleteBtn.disabled = true;
    });
    animatePercentage((done/taskList.children.length)*100);
}
}

function runProfile() {
  console.log("UserId:", window.userId);
  let chosen = new Array(0);

const excerciseList = ["Bridge", "Chair squat", "Knee pushup", "Stationary lunge", "Plank to Downward Dog", "Straight-leg donkey kick", "Bird Dog", "Forearm plank", "Side-lying hip abduction", "Bicycle crunch", "Single-leg bridge", "Squat", "Pushup", "Walking lunge", "Pike pushups", "Get-up squat", "Superman", "Plank with alternating leg lift", "situp", "Dead bug", "Bridge with leg extended", "Overhead squat", "One-legged pushup", "Jumping lunges", "Elevated pike pushups", "Get-up squat with jump", "Advanced Bird Dog", "One-leg or one-arm plank", "Side plank with hip abduction", "Hollow hold to jackknife"];

document.getElementById('submitButton').addEventListener("click", function() {
    onSubmit();
 });

async function onSubmit() {
    let checkboxes = document.getElementsByName('preference');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            chosen.push(i);
        }
    }
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const cursor = client.db("fitness-app-data").collection("logins");
        var userEmail = sessionStorage.getItem('email');
        await cursor.update(
            { email: userEmail },
            {
              $set: {
                preferences: chosen.toString()
              }
            }
         )
        console.log("successful");
        res.send("successful");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
    }
    document.location.href = "profile.html";
    do {
       updatePreference(chosen);
    } while(document.location.href !== "profile.html");
}

// things added to chosen is not carried over to profile.html (bottom function)

async function updatePreference(chosen) {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const cursor = client.db("fitness-app-data").collection("logins");
        var cursor1 = cursor.find({email: sessionStorage.getItem("email")});
        for await (const doc of cursor1) {
            // check if password is correct or if account exists
            var preferencesList = doc.preferences.split(",")
            console.log(preferencesList);
            var ul = document.getElementById("preferenceList");
            for (var i=0; i<preferencesList.length;i++) {
                var li = document.createElement('li');
                li.innerHTML = excerciseList[preferencesList[i]];
                ul.appendChild(li);
            }

          }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
    }
}
}

function runComposition() {
  console.log("UserId:", window.userId);
  // Get reference to the wrapper div
var wrapperDiv = document.getElementById('q1'); // all the way to q10

// Get all radio buttons inside the wrapper div
var radioButtons = wrapperDiv.querySelectorAll('input[type="radio"][name="yes_no"]');

// Variable to store the selected value
var selectedValue;

// Loop through radio buttons to find the checked one
radioButtons.forEach(function(radioButton) {
  if (radioButton.checked) {
    selectedValue = radioButton.value;
  }
});

// Now selectedValue contains the value of the selected radio button
console.log(selectedValue);

}

function runPreference() {
  console.log("UserId:", window.userId);
  let chosen = new Array(0);

const excerciseList = ["Bridge", "Chair squat", "Knee pushup", "Stationary lunge", "Plank to Downward Dog", "Straight-leg donkey kick", "Bird Dog", "Forearm plank", "Side-lying hip abduction", "Bicycle crunch", "Single-leg bridge", "Squat", "Pushup", "Walking lunge", "Pike pushups", "Get-up squat", "Superman", "Plank with alternating leg lift", "situp", "Dead bug", "Bridge with leg extended", "Overhead squat", "One-legged pushup", "Jumping lunges", "Elevated pike pushups", "Get-up squat with jump", "Advanced Bird Dog", "One-leg or one-arm plank", "Side plank with hip abduction", "Hollow hold to jackknife"];

document.getElementById('submitButton').addEventListener("click", function() {
    onSubmit();
 });

async function onSubmit() {
    let checkboxes = document.getElementsByName('preference');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            chosen.push(i);
        }
    }
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const cursor = client.db("fitness-app-data").collection("logins");
        var userEmail = sessionStorage.getItem('email');
        await cursor.update(
            { email: userEmail },
            {
              $set: {
                preferences: chosen.toString()
              }
            }
         )
        console.log("successful");
        res.send("successful");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
    }
    document.location.href = "profile.html";
    do {
       updatePreference(chosen);
    } while(document.location.href !== "profile.html");
}

// things added to chosen is not carried over to profile.html (bottom function)

async function updatePreference(chosen) {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const cursor = client.db("fitness-app-data").collection("logins");
        var cursor1 = cursor.find({email: sessionStorage.getItem("email")});
        for await (const doc of cursor1) {
            // check if password is correct or if account exists
            var preferencesList = doc.preferences.split(",")
            console.log(preferencesList);
            var ul = document.getElementById("preferenceList");
            for (var i=0; i<preferencesList.length;i++) {
                var li = document.createElement('li');
                li.innerHTML = excerciseList[preferencesList[i]];
                ul.appendChild(li);
            }

          }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
    }
}
}


function forgotPassword() {
  // implement forgotPassword
}

function switchToSignup() {
    window.location.href="signup.html";
}

function switchToSignin() {
  window.location.href="index.html";
}
