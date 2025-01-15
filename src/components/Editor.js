import React, { useEffect, useRef , useState} from 'react';
import * as fabric from 'fabric';
import { useScreenId } from '../context/ScreenIdContext'; //useScreenId hook
import { saveContent } from '../services/api';
import ContentList from "../components/ContentList";
import '../styles/mainPageStyles.css';

const Editor = ({ shapeToDraw, imageUrl, handleImageUpload }) => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [canvasSize, setCanvasSize] = useState(600); // State for dynamic resizing
  const { screenId } = useScreenId();  // Get the screenId from context

  // Ensure screenId is available
  if (!screenId) {
      alert("No screenId found. Please register a screen first.");
      return null;
  }

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: canvasSize,
      width: canvasSize,
      backgroundColor: 'white',
      selection: false,
    });
    canvasInstance.current = canvas;
    
    // Load content from localStorage immediately if available
    if (localStorage.getItem("canvasState")) {
        loadCanvasFromLocalStorage();
    } else {
        // If there's no saved state, render the blank canvas initially
        canvas.renderAll();
    }

    return () => {
      canvas.dispose();
    };
  }, [canvasSize]);

  // Canvas adjustment handlers
  const increaseCanvasSize = () => setCanvasSize((prevSize) => prevSize + 100);
  const decreaseCanvasSize = () => setCanvasSize((prevSize) => Math.max(300, prevSize - 100));

  //handler for loaction marker
  const handleAddLocationMarker = () => {
    fabric.Image.fromURL('public/images/locationMarker.webp', (img) => {
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
    const imageUrl = '/images/transparentBg.png'; // Path to the image file

    // Load the image into the canvas
    fabric.Image.fromURL(imageUrl, (img) => {
        if (img) {
            console.log('Image loaded successfully:', img);

            // Customize image properties
            img.set({
                left: (canvasInstance.current.getWidth() - img.width) / 2 || 200, // Center horizontally
                top: (canvasInstance.current.getHeight() - img.height) / 2 || 200, // Center vertically
                selectable: true, // Make the image draggable
                hasControls: true, // Allow resizing
                hasBorders: true, // Show borders
            });

            // Optional: Scale image if it's too large
            const maxWidth = 300;
            const maxHeight = 300;
            if (img.width > maxWidth || img.height > maxHeight) {
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                img.scale(scale);
            }

            // Add the image to the canvas
            canvasInstance.current.add(img);

            // Center the image on the canvas
            canvasInstance.current.centerObject(img);
            canvasInstance.current.setActiveObject(img);

            // Render the canvas
            canvasInstance.current.renderAll();
        } else {
            console.error('Failed to load the image.');
        }
    }, 
    {
        crossOrigin: 'anonymous', // Enable cross-origin for external images
    });
};

  const handleAddGif = () => {
    fabric.Image.fromURL('/images/earth.gif', (img) => {
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

    //preventing canvas to save empty canvas 
    if (!canvasInstance.current || !canvasInstance.current.getObjects().length) {
      alert('Canvas is empty, nothing to save.');
      return;
    }  

    // Convert the canvas content to JSON
    const canvasData = JSON.stringify(canvasInstance.current.toJSON());

    // Save to localStorage
    localStorage.setItem('canvasState', canvasData);
    console.log('Canvas content saved to localStorage.');

    try {
         const response = await saveContent(screenId, canvasData); // Send the stringified data
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

  //load the saved canvasData from localStorage
  const loadCanvasFromLocalStorage = () => {
    const savedCanvasData = localStorage.getItem('canvasState');
    if (savedCanvasData && canvasInstance.current) {
      canvasInstance.current.loadFromJSON(savedCanvasData, () => {
        console.log('Canvas content loaded from localStorage.');
        canvasInstance.current.renderAll();//explicit render after loading state
      });
    } else {
      console.log('No canvas content found in localStorage.');
    }
  };

  // Draw shape based on shapeToDraw prop
  useEffect(() => {
    if (shapeToDraw) {
      switch (shapeToDraw) {
        case 'Marker': handleAddLocationMarker(); break;
        case 'Text': handleAddText(); break;
        case 'Line': handleAddLine(); break;
        case 'Triangle': handleAddTriangle(); break;
        case 'Circle': handleAddCircle(); break;
        case 'Square': handleAddSquare(); break;
        case 'Arrow': handleAddArrow(); break;
        case 'Image': handleAddImage(); break;
        case 'GIF': handleAddGif(); break;
        case 'Iframe': handleAddIframeSimulated(); break;
        default: break;
      }
    }
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


  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      // Add the uploaded image to the canvas
      const canvas = canvasRef.current.canvasInstance;

      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: (canvas.getWidth() - img.width) / 2 || 200,
          top: (canvas.getHeight() - img.height) / 2 || 200,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });

        // Optional: Scale image if too large
        const maxWidth = 300;
        const maxHeight = 300;
        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          img.scale(scale);
        }

        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    }
  }, [imageUrl]);

  
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