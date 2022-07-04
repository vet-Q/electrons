// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require('electron');
const crawler = require('./medicrawler');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld(
  "api", {
      send: (channel, data) => {
          let validChannels = ["toMain"]; // IPC채널들 추가
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
        },
      openWindow: (channel, data) => {
          let validChannels = ["openWindow"]; // IPC채널들 추가
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
      },
      handle: (channel,func) => {
          let validChannels = ["fromMain"]; // IPC채널들 추가
          if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event,...args)=>func(...args))
          };
      },
  }
);