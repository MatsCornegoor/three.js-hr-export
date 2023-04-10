## three.js-hr-export
This is a minimal high resolution image export script that is easy to implement in a existing three.js sketch. Instead of rendering the high resolution image directly in the browser, this script exports a set of tiles that can be stitched together in a program like photoshop or using a simple python script. This approach has no limits in export size.


## Installation

### Node Modules
Install the image exporter using npm.
```
npm install three.js-hr-export
```
Import the module in your main.js file.
```javascript
import { exportHR } from 'three.js-hr-export';
```

### CDN
``` html
<script type="module" src="https://unpkg.com/three.js-hr-export/dist/export.js"><script>
```


## Usage

Add the exportHR function to your main js file and pass an object with the following parameters:
- canvasSize (array)
- exportSize (array)
- filename (string)
- exportButton (html element)
- modal (html element)
- camera (THREE.PerspectiveCamera)
- renderer (THREE.WebGLRenderer)
- scren (THREE.scene)


### example
```javascript
exportHR({
    canvasSize: [window.innerWidth, window.innerHeight],
    exportSize: [15000, 15000],
    fileName: "test",
    exportButton: document.querySelector(".exportButton"),
    modal: document.querySelector(".modal"),
    camera: camera,
    renderer: renderer,
    scene: scene
});
```


## Stitching images with python

Add the exported images to "stitch/src". Make sure there are no other images in this folder. In order to stitch the images we need to calulate the square root of the total of exported images and pass this number with the -r argument to the python script. 

### example for 9 images
```python
python3 stitch.py -r 3
```

