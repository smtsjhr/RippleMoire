function record(record_animation, canvas, name, total_frames, frame, loop) {
    if(record_animation) {
        if (frame + 1 === total_frames) {
            loop += 1;
        }

        if (loop === 1) { 
            let frame_number = frame.toString().padStart(total_frames.toString().length, '0');
            download(name+frame_number+'.png', canvas);
        }

        if (loop === 2) { stop_animation = true }
    }
}

function download(filename, canvas) {
    dataURL = canvas.toDataURL();
    var element = document.createElement('a');
    element.setAttribute('href', dataURL);
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  
    console.log('Downloaded ' + filename);
  }
