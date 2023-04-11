window.onload = function() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("img");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.drawImage(img, 0, 0,600,600);
  };
    const img = document.getElementById('img');
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    cocoSsd.load().then(model => {
  model.detect(img).then(predictions => {
        console.log('Predictions: ', predictions);
        predictions.forEach(function(p) {
      ctx.beginPath();
      ctx.font = "bold 30px Arial";
      ctx.strokeStyle = "#000";
      ctx.rect(p.bbox[0], p.bbox[1],p.bbox[2],p.bbox[3]);
      ctx.strokeStyle="#FFFF00";
      ctx.stroke();
      ctx.fillStyle = "#FFFF00";
      ctx.fillText(p.class, (p.bbox[0]), p.bbox[1]);
        });
      });
    });