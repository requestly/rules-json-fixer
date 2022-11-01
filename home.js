function processFile() {
  let outputData = [];

  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  if (!file.type) {
    alert("It doesn't seem to be a valid Requestly Firebase Export file!");
  } else {
    reader.onload = function (event) {
      let rawInput = event.target.result;

      let rawData = JSON.parse(rawInput);

      if (rawData.id) {
        outputData.push(rawData);
      } else {
        for (const child in rawData) {
          if (
            /Cancel|Redirect|Replace|Script|Headers|UserAgent|QueryParam|Response|Request|Delay/.test(
              child
            )
          ) {
            outputData.push(rawData[child]);
          }
        }
      }

      let newFileContent = JSON.stringify(outputData);

      // Download new file content as Requestly JSON Text
      function download(data, filename, type) {
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob)
          // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
        else {
          // Others
          var a = document.createElement("a"),
            url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      }
      download(newFileContent, "rq-export-fixed", "txt");
    };
  }
  reader.readAsText(file);
}
