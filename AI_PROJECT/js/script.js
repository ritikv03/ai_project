// Load OpenCV
const cv = require('opencv4nodejs');

// Create a video capture object
const capture = new cv.VideoCapture(0);

// Create a background subtractor object to subtract the background from each frame
const bgSubtractor = new cv.BackgroundSubtractorMOG2(500, 16, false);

// Initialize variables for counting vehicles
let vehicleCount = 0;
let vehicleCrossedLine = false;

// Get a reference to the canvas element
const canvas = document.getElementById('canvas');

// Set the canvas size to match the video frame size
const frameSize = new cv.Size(capture.get(cv.CAP_PROP_FRAME_WIDTH), capture.get(cv.CAP_PROP_FRAME_HEIGHT));
canvas.width = frameSize.width;
canvas.height = frameSize.height;

// Create a canvas context object
const ctx = canvas.getContext('2d');

// Set up a loop to process each frame from the video stream
function processVideo() {
  // Read a frame from the video stream
  const frame = capture.read();

  // Convert the frame to grayscale
  const gray = frame.cvtColor(cv.COLOR_BGR2GRAY);

  // Apply a Gaussian blur to the grayscale image to reduce noise
  const blurred = gray.gaussianBlur(new cv.Size(7, 7), 0);

  // Apply adaptive thresholding to the blurred image to create a binary mask
  const thresh = blurred.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

  // Apply the background subtractor to the binary mask
  const fgMask = bgSubtractor.apply(thresh);

  // Find contours (i.e. connected regions) in the foreground mask
  const contours = fgMask.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Loop through the contours and check if they cross a horizontal line
  for (let i = 0; i < contours.length; i++) {
    // Get the bounding box of the contour
    const rect = contours[i].boundingRect();

    // Check if the center of the bounding box is below the line
    if (rect.y + rect.height > 200 && rect.y + rect.height < 220) {
      // If the vehicle hasn't already crossed the line, increment the vehicle count
      if (!vehicleCrossedLine) {
        vehicleCount++;
        vehicleCrossedLine = true;
      }
    } else {
      vehicleCrossedLine = false;
    }

    // Draw the bounding box on the frame
    frame.drawRectangle(rect, new cv.Vec3(0, 255, 0), 2);
  }

  // Draw the counting line on the canvas
  ctx.drawImage(frame.toBuffer(), 0, 0);
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(canvas.width, 200);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Display the vehicle count on the page
  document.getElementById('vehicle-count').textContent = vehicleCount;

  // Call this function again
  requestAnimationFrame(processVideo);
}

// Start the video stream
capture.readAsync().then(() => {
  // Call the processVideo function to start processing frames
  processVideo();
});
