import React, { useEffect, useRef , useState} from 'react';
import * as fabric from 'fabric';
import { saveContent } from '../services/api';
import ContentList from "../components/ContentList";
import '../styles/mainPageStyles.css';

const Editor = ({  shapeToDraw}) => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [canvasSize, setCanvasSize] = useState(600); // State for dynamic resizing

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: canvasSize,
      width: canvasSize,
      backgroundColor: 'white',
      selection: false,
    });
    canvasInstance.current = canvas;
    canvas.renderAll(); //forcing canvas to render initially

    return () => {
      canvas.dispose();
    };
  }, [canvasSize]);

  // Canvas adjustment handlers
  const increaseCanvasSize = () => setCanvasSize((prevSize) => prevSize + 100);
  const decreaseCanvasSize = () => setCanvasSize((prevSize) => Math.max(300, prevSize - 100));

  //handler for loaction marker
  const handleAddLocationMarker = () => {
    fabric.Image.fromURL('images/locationMarker.webp', (img) => {
      img.set({
        left: 150,
        top: 150,
        scaleX: 0.1,
        scaleY: 0.1,
      });
      canvasInstance.current.add(img);
    });
  };

  //handler for text
  const handleAddText = () => {
    const textbox = new fabric.Textbox('New Text', {
      left: 150,
      top: 150,
      width: 200,
      fontSize: 20,
      fill: 'black',
    });
    canvasInstance.current.add(textbox);
  };
  
  //handler for line
  const handleAddLine = () => {
    const line = new fabric.Line([50, 100, 200, 100], {
      stroke: 'black',
      strokeWidth: 2,
    });
    canvasInstance.current.add(line);
  };

  //handler for Triangle
  const handleAddTriangle = () => {
    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      fill: 'black',
      left: 100,
      top: 100,
    });
    canvasInstance.current.add(triangle);
  };

  //handler for Circle
  const handleAddCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: 'black',
      left: 150,
      top: 150,
    });
    canvasInstance.current.add(circle);
  };

  //handler for square
  const handleAddSquare = () => {
    const square = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'black',
      left: 200,
      top: 200,
    });
    canvasInstance.current.add(square);
  };


  //handler for arrow
  const handleAddArrow = () => {
    const line = new fabric.Line([50, 50, 150, 50], {
      stroke: 'black',
      strokeWidth: 2,
    });

    const triangle = new fabric.Triangle({
      width: 20,
      height: 20,
      fill: 'black',
      left: 150,
      top: 48,
      angle: 90,
    });
    canvasInstance.current.add(line, triangle);
  };

  const handleAddImage = () => {
    fabric.Image.fromURL('/images/transparentBg.png', (img) => {
      if (img) {
        console.log('Image loaded successfully:', img);
        img.set({ left: 200, top: 200 });
        canvasInstance.current.add(img);
      } else {
        console.error('Failed to load the image.');
      }
    });
  };
  const handleAddGif = () => {
    fabric.Image.fromURL('images/earth.gif', (img) => {
      img.set({ left: 200, top: 200 });
      canvasInstance.current.add(img);
    }, (error) => {
      console.error('Error loading GIF:', error);
    });
  };

  //handler for Iframe add
  const handleAddIframeSimulated = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 200,
      width: 400,
      height: 300,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
    });
  
    const text = new fabric.Text('', {
      left: 250,
      top: 300,
      fontSize: 20,
      fill: 'black',
    });
  
    canvasInstance.current.add(rect, text);
  };

  //save canvas state
  const handleSaveCanvas = async () => {
    if(!canvasInstance.current) return;

    // Convert the canvas content to JSON
    const canvasData = JSON.stringify(canvasInstance.current.toJSON());
    try {
         const response = await saveContent({ data: canvasData }); // Send the stringified data
         console.log('Content saved successfully:', response);
         alert('Canvas content saved!');
    } catch (error) {
         console.error('Error saving canvas content:', error);
         alert('Failed to save content');
    }
  };

  //delete the selected object from canvas
  const handleDeleteObject=() => {
    const canvas = canvasInstance.current;
    if(canvas){
      const activeObject = canvas.getActiveObject();
      if(activeObject){
        canvas.remove(activeObject); //remove the selected object
        canvas.renderAll(); //re-render the canvas
      }else{
        alert('No Object selected to delete');
      }
    }
  }

  // Draw shape based on shapeToDraw prop
  useEffect(() => {
    if (shapeToDraw === 'Marker') handleAddLocationMarker();
    if (shapeToDraw === 'Text') handleAddText();
    if (shapeToDraw === 'Line') handleAddLine();
    if (shapeToDraw === 'Triangle') handleAddTriangle();
    if (shapeToDraw === 'Circle') handleAddCircle();
    if (shapeToDraw === 'Square') handleAddSquare();
    if (shapeToDraw === 'Arrow') handleAddArrow();
    if (shapeToDraw === 'Image') handleAddImage();
    if (shapeToDraw === 'GIF') handleAddGif();
    if (shapeToDraw === 'Iframe') handleAddIframeSimulated();
  }, [shapeToDraw]);

  //perform the delete object func from canvas when user pree "delete" or backspace key from keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        handleDeleteObject();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  

  return (
    <div>
      <div className='topBarInCanvasEditor'>
        <span>
             <button onClick={handleSaveCanvas}>Save</button>
             <button onClick={handleDeleteObject}>Delete</button>
        </span>
      </div>
      <canvas ref={canvasRef} />
      <button onClick={increaseCanvasSize}>+</button>
      <button onClick={decreaseCanvasSize}>-</button>
      <ContentList canvasInstance={canvasInstance} />
    </div>
  );
};

export default Editor;