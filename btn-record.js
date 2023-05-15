const { spawn, spawnSync } = require("child_process");

var recording = false
var PID

function myfunc() {
 if (recording == false) {
  const ls = spawn("rosbag", ["record", "-O", "bagfiles/images.bag", "/camera/rgb/image_raw"]);
  recording = true
  console.log(ls.pid)
  PID = ls.pid
  recordElement.innerText = "Stop Recording"
  recordElement.style.backgroundColor = "#EE6347"
  statusElement.innerText = "Status: Recording Started"

  console.log("Recording started (rosbag + images)")
    
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

 } else if (recording == true) {
  const kill = spawn("kill", [PID])
  
  statusElement.innerText = "Status: Recording stopped, saving..."
  console.log("Recording stopped, saving...")

  const bag2img = spawnSync("python", ["./bag_to_img.py", "./bagfiles/images.bag", "./output", "/camera/rgb/image_raw"], {stdio: 'inherit'})
  const video = spawnSync("ffmpeg", ["-framerate", "1", "-pattern_type", "glob","-y", "-i", "'./output/*.png'", "-c:v", "libx264", "-r", "30", "-pix_fmt", "yuv420p", "./output/output.mp4"], {stdio: 'inherit', shell: true})
    

  console.log("Recording saved!")
  console.log("Images can be found at ~/electron-quick-start/output/")
  console.log("RosBag can be found at ~/electron-quick-start/bagfiles/")
  console.log("Video saved at ~/electron-quick-start/output/output.mp4")
  recording = false
  
  statusElement.innerText = "Status: Recording Saved at electron-quick-start/output/output.mp4"
  recordElement.innerText = "Start Recording"
  recordElement.style.backgroundColor = "#90EE90"
     
 }
}

//myfunc()

const statusElement = document.getElementById("status-bar")
const recordElement = document.getElementById("btn-record")
recordElement.onclick = myfunc

