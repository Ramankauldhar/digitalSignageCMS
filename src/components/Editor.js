import React, { useEffect, useRef, useState} from 'react';
import * as fabric from 'fabric';
import { useScreenId } from '../context/ScreenIdContext'; //useScreenId hook
import { saveContent } from '../services/api';
import ContentList from "../components/ContentList";
import '../styles/mainPageStyles.css';

const Editor = ({ shapeToDraw }) => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const canvasSize = useRef(400); // Track the canvas size
  const { screenId } = useScreenId();  // Get the screenId from context
  const [previewImage, setPreviewImage] = useState(null); // State to hold the preview image
  const [shapeList, setShapeList] = useState([]); // State to hold the list of shapes
  const [isShapeListVisible, setIsShapeListVisible] = useState(false); // State to toggle shape list visibility
  const [showTooltip, setShowTooltip] = useState(false);
  // State to hold the uploaded image URL
  const [imageUrl, setImageUrl] = useState(null); 
 
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

  useEffect(() => {
    // Ensure screenId is available
    if (!screenId) {
       alert("No screenId found. Please register a screen first.");
       return null;
    }
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: canvasSize.current,
      width: canvasSize.current,
      backgroundColor: 'white',
      selection: false,
    });
    canvasInstance.current = canvas; //store canvas instance in ref
    
    // Load content from localStorage immediately if available
    if (localStorage.getItem("canvasState")) {
        loadCanvasFromLocalStorage();
    } else {
        // If there's no saved state, render the blank canvas initially
        canvas.renderAll();
    }

    // Event listeners for shape changes
    canvas.on('object:added', updateShapeList);
    canvas.on('object:removed', updateShapeList)

    return () => {
      canvas.dispose(); // cleanup canvas when comp unmounts
    };
  }, [screenId]);

  // This hook runs when shapeToDraw changes
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
  

  //clear the canvas function
  const clearCanvas = () => {
    const canvas = canvasInstance.current; // Ensure canvasInstance is initialized
    // Clear all objects from the canvas
    canvas.clear();
    // Set background color
    canvas.backgroundColor = 'white';
    canvas.renderAll(); // Re-render the canvas to apply the changes

    // Remove the canvas state from localStorage
    localStorage.removeItem('canvasState');
    console.log('Canvas cleared and localStorage content removed.');
  };

  // Canvas adjustment handlers
  // Increase canvas size
  const increaseCanvasSize = () => {
    const newSize = canvasSize.current + 100;
    canvasSize.current = newSize; // Update ref

    if (canvasInstance.current) {
      canvasInstance.current.setWidth(newSize);
      canvasInstance.current.setHeight(newSize);
      canvasInstance.current.renderAll(); // Re-render to apply the new size
    }
  };

  // Decrease canvas size
  const decreaseCanvasSize = () => {
    const newSize = Math.max(300, canvasSize.current - 100);
    canvasSize.current = newSize; // Update ref

    if (canvasInstance.current) {
      canvasInstance.current.setWidth(newSize);
      canvasInstance.current.setHeight(newSize);
      canvasInstance.current.renderAll(); // Re-render to apply the new size
    }
  };

  const handleAddLocationMarker = () => {
    // Check if the image URL is valid
    const imageUrl = "";
    fabric.Image.fromURL(imageUrl, (img) => {
      if (!img) {
        console.error("Failed to load image from URL:", imageUrl);
        return;
      }
      img.set({
        left: 150,
        top: 150,
        scaleX: 0.1,
        scaleY: 0.1,
      });
      canvasInstance.current.add(img);
    }, { crossOrigin: 'anonymous' });  // Add CORS header if needed
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

  //handler for addimage
  const handleAddImage = (imgURL) => {
    // Load the image into the canvas
    fabric.Image.fromURL(imgURL, (img) => {
      img.set({ left: 50, top: 50 });
      img.scaleToWidth(300);
      img.scaleToHeight(300);
      canvasInstance.current.add(img);
    });
  }

 //handler for addimage
 const handleAddGif = (gifURL) => {
    fabric.Image.fromURL(gifURL, (img) => {
      img.set({ left: 50, top: 50 });
      img.scaleToWidth(300);
      img.scaleToHeight(300);
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

  // Function to handle canvas preview
  const handlePreviewCanvas = () => {
    if (!canvasInstance.current) {
      alert('Canvas is not ready to preview.');
      return;
    }
    // Check if there are any objects on the canvas
    if (!canvasInstance.current.getObjects().length) {
       alert('Canvas is empty, no content to preview.');
       return;
    }
    // Convert canvas to an image URL
    const dataUrl = canvasInstance.current.toDataURL({
      format: 'png',
      quality: 1,
    });
    setPreviewImage(dataUrl); // Update state with the generated image URL
  };

  // Update the shape list based on current objects on the canvas
  const updateShapeList = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const shapes = canvas.getObjects().map((obj, index) => {
        return `${index + 1}. ${obj.type || 'Unknown Shape'}`;
      });
      setShapeList(shapes);
    }
  };
  
  // Handle Image Upload and Add to Canvas
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const imageURL = event.target.result; // Get the image data URL
        // Update the image URL state for preview
        setImageUrl(imageURL);
        // Create an image element to load the file
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;
  
        imageElement.onload = () => {
          const image = new fabric.Image(imageElement); // Create a Fabric.js image object
          canvasInstance.current.add(image);
          canvasInstance.current.centerObject(image); // Center the image on the canvas
          canvasInstance.current.setActiveObject(image); // Set the added image as active
          canvasInstance.current.renderAll(); // Re-render the canvas
        };
      };
    }
  };
  

  return (
  <div className='canvMainContainer'>
    <div className='canvasContainer'>
      <div className='topBarInCanvasEditor'>
         <span>
             <div className='listContainer'>
                 <button onClick={() => setIsShapeListVisible(!isShapeListVisible)} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                     <i className={isShapeListVisible ? 'fas fa-times' : 'fas fa-layer-group'}></i>
                 </button>
                 {showTooltip && ( <div className="tooltip">View shapes</div>)}
                 {/* Render the list of shapes on canvas */}
                 {isShapeListVisible && (
                     <div className="shapeList">
                         <h4>Shapes on Canvas:</h4>
                         <ul>
                            {shapeList.length > 0 ? (
                               shapeList.map((shape, index) => (
                                  <li key={index}>{shape}</li>
                               ))
                             ) : (
                                <li>No shapes on the canvas</li>
                             )}
                         </ul>
                     </div>
                  )}
             </div>
             <div className='buttonContainer'>
                 <button onClick={handleSaveCanvas}><i className="fas fa-save"></i></button>
                 <button onClick={handleDeleteObject}><i className="fas fa-trash-alt"></i></button>
                 <button onClick={clearCanvas}>Clear Canvas</button>
             </div>
         </span>
      </div>
      <canvas ref={canvasRef} />
      <div className='bottomButtonsContainer'>
        <button onClick={increaseCanvasSize}>+</button>
        <button onClick={decreaseCanvasSize}>-</button>
        <button onClick={handlePreviewCanvas}>Preview</button>
      </div>
      {/* Render the preview modal or section */}
      {previewImage && (
        <div className="previewModal">
          <img src={previewImage} alt="Canvas Preview" />
          <button onClick={() => setPreviewImage(null)}><i className='fas fa-times'></i></button>
        </div>
      )}
      <ContentList canvasInstance={canvasInstance} />
    </div>
    <div className="rightContainer">
      <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="imageUploadInput"
       />
      {imageUrl && (
        <div>
            <p>Image Preview:</p>
            <img src={imageUrl} alt="Uploaded" style={{ width: "100%", maxHeight: "300px" }} />
        </div>
      )}
  </div>
</div>
);
};

export default Editor;