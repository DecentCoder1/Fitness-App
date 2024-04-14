let chosen = new Array(0);

const excerciseList = ["Bridge", "Chair squat", "Knee pushup", "Stationary lunge", "Plank to Downward Dog", "Straight-leg donkey kick", "Bird Dog", "Forearm plank", "Side-lying hip abduction", "Bicycle crunch", "Single-leg bridge", "Squat", "Pushup", "Walking lunge", "Pike pushups", "Get-up squat", "Superman", "Plank with alternating leg lift", "situp", "Dead bug", "Bridge with leg extended", "Overhead squat", "One-legged pushup", "Jumping lunges", "Elevated pike pushups", "Get-up squat with jump", "Advanced Bird Dog", "One-leg or one-arm plank", "Side plank with hip abduction", "Hollow hold to jackknife"];

document.getElementById('submitButton').addEventListener("click", function() {
    onSubmit();
 });

function onSubmit() {
    let checkboxes = document.getElementsByName('preference');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            chosen.push(i);
        }
    }
    document.location.href = "profile.html";
    do {
       updatePreference(chosen);
    } while(document.location.href !== "profile.html");
}

// things added to chosen is not carried over to profile.html (bottom function)

function updatePreference(chosen) {
    ul = document.getElementById("preferenceList");
    for (var i=0; i<chosen.length;i++) {
        var li = document.createElement('li');
        li.innerHTML = excerciseList[chosen[i]];
        ul.appendChild(li);
    }
}