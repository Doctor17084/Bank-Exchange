const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('geotalkDesktop', {
  platform: process.platform,
  isElectron: true,
})
