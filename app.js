const userInputPage = document.querySelector(".user-input")
const floors = document.querySelector('.floor-input');
const lifts = document.querySelector(".lift-input")
const simulateBtn = document.querySelector(".simulate-btn")
const simulatedLifts = document.querySelector(".simulated-lifts")

let isInputValid = false;
let liftsData = [];

function cleanupInputs(){
    floors.value = "";
    lifts.value = "";
}

simulateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Q-1  --> !
    //if value less than 1
    if(!Number(floors.value) || Number(floors.value) < 1){
        cleanupInputs();
        alert("Enter valid number of floors");
    }else if(!Number(lifts.value ) || Number(lifts.value) < 1){
        cleanupInputs();

        alert("Enter the valid no of lifts ")
    }

    //if floor only 1
    else if( Number(floors.value) ===1  ){
        cleanupInputs();
        alert("there should be at least 2 floors")

    }else if (Number(floors.value ) > 20){
        alert("max allowed floors 20")
    }else if(Number(lifts.value > 5)){
        alert("max allowed lifts : 5")
    }else if (Number(lifts.value) > Number(floors.value)){
        alert("lifts cant be more than number of floors")
    }
    else {
        isInputValid = true;
        simulatedLifts.innerHTML =`<button class = "btn back-btn"> Back </button>`
        userInputPage.style .display = "none";
        simulatedLifts.style.display = "block";
    }

    const backBtn = document.querySelector(".back-btn")
    backBtn.addEventListener("click" , (e) => {
        simulatedLifts.style.display = "none";
        userInputPage.style.display = "block";
        liftsData = [];
        cleanupInputs();
    })
     
    generateFloorsAndLifts(floors.value , lifts.value);
    

})

const findNearestIdleLift = (targetFloor) => {
    let nearestLift = null ;
    let shortestDistance = Infinity;

    for (const lift of liftsData){
        if(lift.state === "idle"){
            const distance = Math.abs(targetFloor - lift.currentFloor);
            if(distance < shortestDistance){
                shortestDistance = distance;
                //Q-2?
                nearestLift = lift.liftId;
            }
        }
    }
    console.log({nearestLift})
    return nearestLift;
}

function generateFloorsAndLifts (floorCount ,liftCount){
    const container = document.createElement("div");
    container.classList.add("container");

    generateLiftsData(liftCount);

    //Q-3 ?
    console.log("Data :", liftsData);

    for (let i = 0 ; i<= floorCount ; i++){
        const floorContainer = document.createElement("div");
        floorContainer.classList.add("floor-container");
        floorContainer.classList.add(`row-${i}`)
        if(i !== floorCount-1){
            floorContainer.style.height = "3.5rem";
        }

        const lineSplit = document.createElement("div");
        lineSplit.classList.add("line-split");
        floorContainer.appendChild(lineSplit);

        const floorNumber = floorCount -i ;

        if(i < floorCount){
            const floorContents = document.createElement("div");
            floorContents.classList.add("floor-contents");

            const btnContainer = document.createElement("div");
            const btnUp = document.createElement("button");
            btnUp.innerText = "UP"
            btnUp.classList.add("lift-btn")
            btnUp.addEventListener("click" ,() => {
                const nearestIdleLift = findNearestIdleLift(floorNumber);
                moveLiftToFloor(floorNumber , nearestIdleLift);
            })

            const btnDown = document.createElement("button")
            btnDown.innerText = "Down"
            btnDown.classList.add("lift-btn");
            btnDown.addEventListener("click" , () => {
                const nearestIdleLift = findNearestIdleLift(floorNumber);
                moveLiftToFloor(floorNumber , nearestIdleLift);
            })

            const floorLabel = document.createElement("p")
            floorLabel.innerText = `Floor ${floorNumber}`;
            floorLabel.classList.add("floor-label");

            btnContainer.appendChild(btnUp)
            btnContainer.appendChild(btnDown)
            floorContents.appendChild(btnContainer)

            for ( let j = 0 ; j< liftCount ; j++){
                const lift = document.createElement("div");
                lift.classList.add("lift")
                lift.id = `lift-${j+1}`;

                const leftDoor = document.createElement("div")
                leftDoor.classList.add("left-door")
                leftDoor.id = `leftDoor-${j+1}`
                
                const rightDoor = document.createElement("div")
                rightDoor.classList.add("right-door")
                rightDoor.id = `rightDoor-${j+1}`

                lift.appendChild(leftDoor)
                lift.appendChild(rightDoor)

                if(i === floorCount -1 ){
                    floorContents.appendChild(lift);
                }
            }
            floorContents.appendChild(floorLabel)

            floorContainer.appendChild(floorContents)
        }

        container.appendChild(floorContainer)
        simulatedLifts.appendChild(container);
    }
}

function generateLiftsData(liftCount){
    for(let i = 0 ; i<liftCount ; i++){
        let liftData = {
            liftId : i+1,
            state : "idle",
            currentFloor: 1
        }
        liftsData.push(liftData);
    }
}

function moveLiftToFloor(targetFloor, liftNumber) {  //5,3
    const lift = document.querySelector(`#lift-${liftNumber}`);
    const leftDoor = document.querySelector(`#leftDoor-${liftNumber}`);
    const rightDoor = document.querySelector(`#rightDoor-${liftNumber}`);
    const liftHeight = 3.5; // Height of each floor container
    const currentFloor = liftsData[liftNumber-1].currentFloor;

    if(targetFloor > currentFloor) {
        liftsData[liftNumber-1].state = "up"
    }else {
        liftsData[liftNumber-1].state = "down"
    }

    if (isInputValid && liftsData.length > 0) {
        const distance = Math.abs(currentFloor - targetFloor) * liftHeight;
        const animationDuration = 2; // 2 seconds per floor

        const floorDistance = Math.abs(currentFloor - targetFloor);
        const totalAnimationDuration = floorDistance * animationDuration;

        let translateYDistance = -((targetFloor - 1) * liftHeight);

        lift.style.transition = `transform ${totalAnimationDuration}s ease-in-out`;
        lift.style.transform = `translateY(${translateYDistance}rem)`;
        liftsData[liftNumber-1].currentFloor = targetFloor;
        

        setTimeout(() => {
                lift.style.transition = "";
                lift.classList.add("opened-door")
                leftDoor.classList.add("closed-door");
                rightDoor.classList.add("closed-door");
                openLeftDoor();
                openRightDoor();
        }, totalAnimationDuration * 1000);

        function openLeftDoor() {
            leftDoor.style.transform = `translateX(-1.25rem)`;
            leftDoor.style.transition = `transform 2.5s ease-in-out`;
            closeLeftDoor();
        }

        function openRightDoor() {
            rightDoor.style.transform = `translateX(1.25rem)`;
            rightDoor.style.transition = `transform 2.5s ease-in-out`;
            closeRightDoor();
        }

        function closeLeftDoor() {
            setTimeout(() => {
                leftDoor.style.transform =`translateX(0)`;
                leftDoor.style.transition = `transform 2.5s ease-in-out`;

                // Add transitionend listener for closing left door
                leftDoor.addEventListener("transitionend", () => {
                    // Remove the opened-door class and reset the left door transition
                    lift.classList.remove("opened-door");
                    leftDoor.classList.remove("closed-door");
                    leftDoor.style.transition = "";
                    liftsData[liftNumber-1].state = "idle"
                });
            },2500)
        }

        function closeRightDoor() {
            setTimeout(() => {
                rightDoor.style.transform = `translateX(0)`;
                rightDoor.style.transition = `transform 2.5s ease-in-out`;

                // Add transitionend listener for closing right door
                rightDoor.addEventListener("transitionend", () => {
                    // Reset the right door transition
                    rightDoor.classList.remove("closed-door");
                    rightDoor.style.transition = "";
                });
            },2500)
        }

    }

    console.log("From moveLiftToFloor: ", liftsData)

}
