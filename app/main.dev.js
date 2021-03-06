/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { execFile } from 'child_process';
import fsExtra from 'fs-extra';
import last from 'lodash/last';

import testGamesData from './testData';

import MenuBuilder from './menu';

const romsPath = 'EmuSauce/roms';
const exokitPath = path.resolve(__dirname, '../node_modules/exokit/index.js');
const acceptedExtensions = ['z64', 'zip'];

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('launch-exokit-url', (evt, url) => {
    const params = [url];
    // execFile(exokitPath, params, (err, data) => {
    //   console.log(err);
    //   console.log(data);
    // });
  });

  ipcMain.on('games-data-requested', (evt) => {
    setTimeout(() => {
      evt.sender.send('games-data-loaded', testGamesData);
    }, 2000);
  });

  ipcMain.on('roms-upload-requested', (evt, file, type, name) => {
    if (type !== 'application/zip') {
      const ext = last(name.split('.'));
      if (!acceptedExtensions.includes(ext)) {
        return evt.sender.send('roms-uploaded', false);
      }
    }

    const fileName = `${romsPath}/${name}`;
    const appDataPath = app.getPath('appData');
    const fullPath = path.join(appDataPath, fileName);

    fsExtra.outputFile(fullPath, file).then(() => {
      return evt.sender.send('roms-uploaded', true);
    }).catch(err => console.log(err));
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
