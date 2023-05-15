//const { spawn, spawnSync } = require("child_process");

var lights = false
var lightPID

function lightFunc() {
 if (lights == false) {
  const ls = spawn("python", ["lights.py"]);
  lights = true
  console.log(ls.pid)
  lightPID = ls.pid
  statusElement.innerText = "Status: Lights turned on"

  lightElement.style.color = "white"
  lightElement.style.backgroundColor = "#333333"
  console.log("Lights turned on")
    
  ls.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });

  ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
  });

  ls.on("close", code => {
    console.log(`child process exited with code ${code}`);
  });

 } else if (lights == true) {
  const kill = spawn("kill", [PID])
  
  statusElement.innerText = "Status: Lights turned off"
  console.log("Lights turned off")
  lightElement.style.backgroundColor = "#FFFACD"
  lightElement.style.color = "black"
  lights = false
  
     
 }
}



const lightElement = document.getElementById("btn-light")
lightElement.onclick = lightFunc

