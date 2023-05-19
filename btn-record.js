const { spawn, spawnSync } = require("child_process");

var recording = false
var recordPID

function recordFunc() {
 if (recording == false) {
     const ls = spawn("rosbag", ["record","-O", "bagfiles/images.bag", "/camera/rgb/image_raw"]);
  recordPID = ls.pid
    ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
    });
  recording = true
  recordElement.innerText = "Stop Recording"
  recordElement.style.backgroundColor = "#EE6347"
  statusElement.innerText = "Status: Recording Started"
  sshotElement.style.display = "none"
  console.log("Recording started (rosbag + images)")
    

 } else if (recording == true) {

  btncontainerElement.style.display = "none"
  loaderElement.style.display = "block"
  console.log("Recording stopped, saving...")
  statusElement.innerText = "Recording stopped. Saving might take a few moments, your patience is appreciated!"
  
  setTimeout(function() {
     
  const kill = spawn("kill", [recordPID])
  const bag2img = spawnSync("python", ["./bag_to_img.py", "./bagfiles/images.bag", "./output", "/camera/rgb/image_raw"], {stdio: 'inherit'})
  const video = spawnSync("ffmpeg", ["-framerate", "1", "-pattern_type", "glob","-y", "-i", "'./output/*.png'", "-c:v", "libx264", "-r", "30", "-pix_fmt", "yuv420p", "./output/output.mp4"], {stdio: 'inherit', shell: true})
    
  console.log("Recording saved!")
  console.log("Images can be found at ~/electron-quick-start/output/")
  console.log("RosBag can be found at ~/electron-quick-start/bagfiles/")
  console.log("Video saved at ~/electron-quick-start/output/output.mp4")
  
  statusElement.innerText = "Status: Recording saved! Path: ~/electron-quick-start/output/output.mp4"
  recordElement.innerText = "Start Recording"
  recordElement.style.backgroundColor = "#BBB"
     

  sshotElement.style.display = "inline"
  btncontainerElement.style.display = "block"
  loaderElement.style.display = "none"
  }, 500)
  recording = false
 }
}


const statusElement = document.getElementById("status-bar")
const recordElement = document.getElementById("btn-record")
const loaderElement = document.getElementById("loader")
const btncontainerElement = document.getElementById("btn-container")
recordElement.onclick = recordFunc

