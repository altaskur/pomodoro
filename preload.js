const { contextBridge,ipcRenderer, webContents  } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('minimize'),
    sendNotification: (message) => ipcRenderer.invoke('showNotification', message),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    openLink: (link) => ipcRenderer.invoke('openLink', link)
    
       
});



