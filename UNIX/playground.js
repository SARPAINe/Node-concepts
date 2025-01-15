const { spawn, exec } = require("node:child_process");

//we use spawn to run processes
const subprocess = spawn("ls", ["-l"], {
    cwd: "../",
});

subprocess.stdout.on("data", (data) => {
    console.log(data.toString("utf-8"));
});

exec("echo 'something stupid bolod' | tr ' ' '\n'", (error, stdout, stderr) => {
    if (error) {
        console.error(error);
    }
    console.log(stdout);
    console.log("🚀 ~ exec ~ stderr:", stderr);
});
