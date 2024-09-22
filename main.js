const {
  app,
  BrowserWindow,
  Notification,
  ipcMain,
  Tray,
  Menu,
  shell,
} = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 480,
    frame: false,
    resizable: false,
    transparent: true,
    icon: path.join(path.join(__dirname, "/icon.ico")),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      setAppDetails: {
        appId: "com.pomodoro.altaskur",
      },
    },
  });

  mainWindow.loadFile(__dirname + "/app/index.html");

  // mainWindow.removeMenu()


  mainWindow.on("minimize", function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  const tray = new Tray(path.join(__dirname, "/app/assets/img/pomodoro.jpeg"));

  tray.on("double-click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mostrar",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Ocultar",
      click: function () {
        mainWindow.hide();
      },
    },
    {
      label: "Silenciar/Reactivar",
      click: function () {
        mainWindow.webContents.send('silence');
      },
    },
    {
      label: "Parar/Reanudar",
      click: function () {
        mainWindow.webContents.send('stopResume');
      },
    },
    { type: "separator" },
    {
      label: "Acerca de",
      click: function () {
        const notification = new Notification({
          title: "🍅 Pomodoro",
          body: "Una aplicación con 🤍 por Altaskur",
        });
        notification.show();
        shell.openExternal("https://altaskur.github.io");
      },
    },
    {
      label: "Salir",
      click: function () {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Pomodoro");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('minimize', () => {
    BrowserWindow.getFocusedWindow().minimize();
  });

  ipcMain.handle('showNotification', (event, message) => {

    const notification = new Notification({
      title: message.title,
      body: message.body
    });

    notification.show();
  });

  ipcMain.handle('openLink', (event, link) => {
    shell.openExternal(link);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
