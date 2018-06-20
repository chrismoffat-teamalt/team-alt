var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../testbot-teamalt.zip');
var kuduApi = 'https://testbot-teamalt.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$testbot-teamalt';
var password = 'LXRXQpvjpXl5r2wruKmbxuwR0s57iiWYbsiQdPmzdtpuqfvAb8tbZYKKK50z';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('testbot-teamalt publish');
  } else {
    console.error('failed to publish testbot-teamalt', err);
  }
});