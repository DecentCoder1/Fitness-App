// progress bar stuff done with https://codeconvey.com/semi-circle-progress-bar-css/

function animatePercentage(perc) {
    $(".progress").each(function(){
        var $bar = $(this).find(".bar");
        var $val = $(this).find("span");
        
        $({p:0}).animate({p:perc}, {
        duration: 1000,
        easing: "swing",
        step: function(p) {
            $bar.css({
            transform: "rotate("+ (45+(p*1.8)) +"deg)", // 100%=180° so: ° = % * 1.8
            // 45 is to add the needed rotation to have the green borders at the bottom
            });
            $val.text(p|0);
        }
        });
    }); 
}

$(document).ready(animatePercentage(10));


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
        }
        deleteBtn.disabled = true;
    });
}
setInterval(function() {animatePercentage((done/taskList.children.length)*100);}, 5000);