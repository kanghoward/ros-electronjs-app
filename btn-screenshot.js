//const { spawn, spawnSync } = require("child_process");

const rostopicHz = 1000 * 2 
var running = false

function sshotFunc() {
  if (running == false) {
    running = true
     
  const ls = spawn("rosbag", ["record","-O", "bagfiles/images.bag", "/camera/rgb/image_raw"]);
  console.log(ls.pid)
  var sshotPID = ls.pid
  statusElement.innerText = "Status: Screenshot captured, saving..."
  console.log("Screenshot captured, saving ...")
  videoElement.classList.add("flash-animation")


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

  }
  
  setTimeout(function() {
     
  const kill = spawn("kill", [sshotPID])
  const bag2img = spawnSync("python", ["./bag_to_img.py", "./bagfiles/images.bag", "./output", "/camera/rgb/image_raw"], {stdio: 'inherit'})
  videoElement.classList.remove("flash-animation")
  statusElement.innerText = "Status: Screenshot saved at ~/electron-quick-start/output/"
  running = false
  }, 2000)

 
}

const videoElement = document.getElementById("video-feed")
const sshotElement = document.getElementById("btn-screenshot")
sshotElement.onclick = sshotFunc

