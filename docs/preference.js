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