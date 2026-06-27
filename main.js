const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let serverProcess;

function startBackendServer() {
  const serverPath = path.join(__dirname, "server", "index.js");
  
  // Fork the Express backend as a separate process using Electron's Node runtime
  serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT: "5000",
      CLIENT_ORIGIN: app.isPackaged ? "http://localhost:5000" : "http://localhost:5173",
      NODE_ENV: app.isPackaged ? "production" : "development"
    }
  });

  serverProcess.on("exit", (code, signal) => {
    console.log(`Backend server exited with code ${code} and signal ${signal}`);
  });

  serverProcess.on("error", (err) => {
    console.error("Backend server failed to start:", err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Case Lens",
    icon: path.join(__dirname, "client", "public", "icon-192.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Remove the default menu bar
  mainWindow.removeMenu();

  // Load the appropriate URL based on packaging status
  if (app.isPackaged) {
    // In production, the backend server serves the client dist folder statically on port 5000
    mainWindow.loadURL("http://localhost:5000");
  } else {
    // In development, load the Vite dev server with hot reload
    mainWindow.loadURL("http://localhost:5173");
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Clean up process execution on application startup & exit
app.on("ready", () => {
  startBackendServer();
  // Give the backend server a short moment to bind to port 5000 before opening the window
  setTimeout(createWindow, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
