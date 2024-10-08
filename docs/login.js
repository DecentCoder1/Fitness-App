document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;
  console.log(currentPath);

  if (currentPath.endsWith("/")) {
    runIndex();
  } else if (currentPath.endsWith("signup.html")) {
    runSignup();
  } else if (currentPath.endsWith("/progress")) {
    runProgress();
  } else if (currentPath.endsWith("/profile")) {
    runProfile();
  } else if (currentPath.endsWith("/composition")) {
    runComposition();
  } else if (currentPath.endsWith("preference.html")) {
    runPreference();
  } else if (currentPath.endsWith("/scheduling")) {
    runScheduling();
  }
});

const secretKey = 'dakjlnqewuoizxvmkajlqiuoy';

  function fetchUserId(callback) {
    const token = localStorage.getItem('token');
  
    fetch('/getUserId', {
      headers: {
        'Authorization': `Bearer ${token}`
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

  function onUserIdFetched() {
    console.log('User ID fetched successfully:', window.userId);
  
    // You can now perform any actions that require the user ID
    // For example, fetching user-specific data, updating the UI, etc.
  }
  
  // Call the fetchUserId function and pass the callback
  function getId() {
    fetchUserId(onUserIdFetched);
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
  console.log(getId());

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
  let total = 0;

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
      console.log();
      deleteBtn.addEventListener("click", () => {
          deleteBtn.innerHTML="&#10003;"
          taskItem.classList.add("delete");
          done -= 1;
          animatePercentage(100*(total-done)/total);
      });

      total += 1;
      done += 1;
      animatePercentage(100*(total-done)/total);
  }
}

function runProfile() {
  console.log(getId());
  let chosen = new Array(0);
  console.log('here');

  document.getElementById('scheduling').addEventListener("click", () => {
    window.location.href = '/scheduling';
  });
}

function runComposition() {
  console.log(getId());
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
  console.log(getId());
  let chosen = new Array(0);

const excerciseList = ["Bridge", "Chair squat", "Knee pushup", "Stationary lunge", "Plank to Downward Dog", "Straight-leg donkey kick", "Bird Dog", "Forearm plank", "Side-lying hip abduction", "Bicycle crunch", "Single-leg bridge", "Squat", "Pushup", "Walking lunge", "Pike pushups", "Get-up squat", "Superman", "Plank with alternating leg lift", "situp", "Dead bug", "Bridge with leg extended", "Overhead squat", "One-legged pushup", "Jumping lunges", "Elevated pike pushups", "Get-up squat with jump", "Advanced Bird Dog", "One-leg or one-arm plank", "Side plank with hip abduction", "Hollow hold to jackknife"];

document.getElementById('submitButton').addEventListener("click", function() {
    onSubmit();
 });
}

async function onSubmit() {
    let checkboxes = document.getElementsByName('preference');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            chosen.push(i);
        }
    }
    fetch('/save-exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getId(), excerciseList: chosen.toString() })
  })
  .then(response => response.json())
  .then(data => console.log('Success for list1:', data))
  .catch(error => console.error('Error for list1:', error));
}

// things added to chosen is not carried over to profile.html (bottom function)

async function updatePreference(chosen) {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const cursor = client.db("fitness-app-data").collection("logins");
        const oid = getId();
        const objectId = new ObjectId(oid);
        var cursor1 = cursor.find({ _id: objectId });
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

function runScheduling() {
  console.log(getId());
  async function checkIfCoach() {
  try {
    const response = await fetch('/getUserType', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const coachList = data.coachList; // Get the list of coaches' userIds

    const currentUserId = window.userData.userId; // Assuming you have user's userId stored

    // Check if current user is in the coach list
    if (coachList.includes(currentUserId)) {
      // Apply CSS changes for coach
      document.querySelector('.right-sidebar').style.display = 'none';
      document.getElementById('compare').style.display = 'none';
    }

  } catch (error) {
    console.error('Error fetching user type:', error);
  }
}

checkIfCoach();



  const calendar = document.querySelector('.calendar');

        // Days of the week for data-day attribute
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Initialize the nested array to track active cells
        const activeCells = Array.from({ length: 7 }, () => []);

        let isMouseDown = false;

        // Function to handle toggling cell active state
        function toggleCellActive(cell) {
            // Get day and hour
            const day = cell.getAttribute('data-day');
            const hour = cell.getAttribute('data-hour');
            const dayIndex = daysOfWeek.indexOf(day);

            // Toggle the 'active' class to light up the cell
            cell.classList.toggle('active');

            // Update the nested array based on the active state
            if (cell.classList.contains('active')) {
                activeCells[dayIndex].push(hour);
            } else {
                activeCells[dayIndex] = activeCells[dayIndex].filter(h => h !== hour);
            }

            // Sort times from earliest to latest
            activeCells[dayIndex].sort((a, b) => {
                const [startA] = a.split(':');
                const [startB] = b.split(':');
                return Number(startA[0]) - Number(startB[0]);
            });
        }

        // Loop through 24 hours and 7 days to create cells
        for (let hour = 0; hour < 24; hour++) {
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'clickable');
                cell.setAttribute('data-day', daysOfWeek[day]);
                cell.setAttribute('data-hour', `${hour}:00-${hour + 1}:00`);
                cell.textContent = `${hour}:00-${hour + 1}:00`;
                calendar.appendChild(cell);

                // Add event listener to handle click event
                cell.addEventListener('mousedown', function() {
                    isMouseDown = true;
                    toggleCellActive(this);
                });

                cell.addEventListener('mouseover', function() {
                    if (isMouseDown) {
                        toggleCellActive(this);
                    }
                });
            }
        }
        
        const cardContainer = document.getElementById('card-container');
        cardContainer.style.maxHeight = "600px";
        cardContainer.style.overflowY = "auto";

        function createCard(title, content) {
            const card = document.createElement('div');
            card.classList.add('card');
            const button = document.createElement('button');
            button.classList.add('cardButton')
            button.textContent = "submit";

            const cardTitle = document.createElement('h2');
            cardTitle.textContent = title;

            const cardContent = document.createElement('p');
            cardContent.textContent = content;

            card.appendChild(cardTitle);
            card.appendChild(button)
            card.appendChild(cardContent);

            return card;
        }

        async function fetchAndDisplayCoaches() {
          try {
            const response = await fetch('/get-coaches-list', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            // Assuming `data` is an array of arrays where each sub-array contains [name, description]
            const cardContainer = document.getElementById('card-container'); // Ensure you have an element with this ID
              data.cards.forEach(([name, description]) => {
                const card = createCard(name, description)
                cardContainer.appendChild(card);
              });
          } catch (error) {
            console.error('Error for list1:', error);
          }
        }

        fetchAndDisplayCoaches();


        // Example usage
        // const card1 = createCard('coach1', 'My name is coach1. I excel at ... ');
        // const card2 = createCard('coach2', 'My name is coach2. I excel at ... ');
        // const card3 = createCard('coach3', 'My name is coach3. I excel at ... ');
        // const card4 = createCard('coach4', 'My name is coach4. I excel at ... ');
        // const card5 = createCard('coach5', 'My name is coach5. I excel at ... ');
        // const card6 = createCard('coach6', 'My name is coach6. I excel at ... ');
        // const card7 = createCard('coach7', 'My name is coach7. I excel at ... ');
        // const card8 = createCard('coach8', 'My name is coach8. I excel at ... ');

        // cardContainer.appendChild(card1);
        // cardContainer.appendChild(card2);
        // cardContainer.appendChild(card3);
        // cardContainer.appendChild(card4);
        // cardContainer.appendChild(card5);
        // cardContainer.appendChild(card6);
        // cardContainer.appendChild(card7);
        // cardContainer.appendChild(card8);
          

        // Add event listeners to handle mouse up event
        document.addEventListener('mouseup', function() {
            isMouseDown = false;
        });
        console.log(getId());
        // Function to get the nested array of active cells
        async function getActiveCells() {
          fetch('/save-scheduling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: window.userId, schedulingList: activeCells})
        })
        .then(response => response.json())
        .then(data => console.log('Success for list1:', data))
        .catch(error => console.error('Error for list1:', error));
          return activeCells;
        }
        async function findOverlap() {
          fetch('/find-overlap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId1: window.userId, userId2: "6615485e1ea08306c60ea415"})
            })
            .then(response => response.json())
            .then(data => console.log('Success for comparing', data))
            .catch(error => console.error('Error for list1:', error));
        }

        // for reading from string in database
        // const parsedList = JSON.parse(schedulingList);

        // Add event listener to the button to log the active cells
        // document.getElementById('get-active-cells').addEventListener('click', function() {
        //     console.log(getActiveCells());
        // });

        document.getElementById('compare').addEventListener('click', function() {
          console.log(getActiveCells());
          setTimeout(function() {
            findOverlap();
          }, 0);
        })
}