export function exportHR(set) {
  let exportWidth = set.exportSize[0];
  let exportHeight = set.exportSize[1];
  let canvasWidth = set.canvasSize[0];
  let canvasHeight = set.canvasSize[1];

  let fileName = set.fileName;
  let exportButton = set.exportButton;
  let modal = set.modal;

  let camera = set.camera;
  let renderer = set.renderer;
  let scene = set.scene;

  // hide modal
  if (modal) {
    modal.style.display = "none";
  }

  function exportTiles(width, height) {
    // create tiles of max 5000 x 5000 px
    let widthD = width / 5000;
    let heightD = height / 5000;

    // calculate count, width and height
    let tileCount = widthD * heightD;
    let tileWidth = width / widthD;
    let tileHeight = height / heightD;

    // save tile offset
    let tileOffsetX = 0;
    let tileOffsetY = 0;

    // show modal
    if (modal) {
      modal.style.display = "block";
    }

    // update camera aspect
    camera.aspect = tileWidth / tileHeight;

    let counter = 0;
    let interval = setInterval(downloadTile, 1000);

    function downloadTile() {
      counter++;

      renderer.setSize(tileWidth, tileHeight);
      camera.setViewOffset(
        width,
        height,
        tileOffsetX,
        tileOffsetY,
        tileWidth,
        tileHeight
      );
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      let data = renderer.domElement.toDataURL();

      const link = document.createElement("a");
      link.href = data;
      link.download = fileName + "-" + counter.toString() + ".png";

      // link.click() does not work on the latest firefox
      // for Firefox it is necessary to delay revoking the ObjectURL
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);

      // shift tile offset
      tileOffsetX = tileOffsetX + tileWidth;
      if (tileOffsetX >= width) {
        tileOffsetY = tileOffsetY + tileHeight;
        tileOffsetX = 0;
      }

      // when all tiles are downloaded, clear timeout and reset canvas
      if (counter == tileCount) {
        camera.aspect = canvasWidth / canvasHeight;
        camera.setViewOffset(
          canvasWidth,
          canvasHeight,
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.render(scene, camera);

        // hide modal
        if (modal) {
          modal.style.display = "none";
        }

        // clear interval
        clearInterval(interval);
      }
    }
  }

  if (exportButton) {
    exportButton.onclick = function () {
      exportTiles(exportWidth, exportHeight);
    };
  }
}
