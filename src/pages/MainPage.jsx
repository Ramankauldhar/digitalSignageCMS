import { useState } from "react";
import '../styles/mainPageStyles.css';

import Editor from "../components/Editor";

const MainPage = () => {
    const [inputValue, setInputValue] = useState('');
    // State to hold selected shape type
    const [shapeToDraw, setShapeToDraw] = useState(null); 
    //state to track visibiity of options for each widget group
    const [visibleWidgets, setVisibleWidgets] = useState({
      wid1: true,
      wid2: true,
      wid3: true,
      wid4: true,
      wid5: true,
      wid6: true,
      wid7: true,
    });

    const toggleVisibility = (widgetKey) =>{
      setVisibleWidgets((prevState) => ({
          ...prevState,
          [widgetKey]: !prevState[widgetKey],
      }));
    };

    return(
        <>
          <div>
            <div className="header"><h1>Digital Signage CMS</h1></div>
            <div className="topContainer">
                <p>React Design Editor</p>
                <div className="icons">
                     <i className="fas fa-file-arrow-down"></i>
                     <i className="fas fa-file-arrow-up"></i>
                     <i className="fas fa-message-image"></i>
                </div>
            </div>
            <div className="mainContainer">
                <div className="widgetsLeftContainer">
                    <div className="SearchBarWithMenuIcon">
                        <i className="fas fa-chevrons-left"></i>
                        <input
                             type="text"
                             placeholder="Search List"
                             value={inputValue}
                             className="searchBar"
                             onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <div className="widgetsContainer">
                        <div className="widgetGroup">
                            <div className="widgets wid1" onClick={() => toggleVisibility('wid1')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid1 ? 'down' : 'right'}`}></i>
                                 <span>MARKER</span>
                            </div>
                            {visibleWidgets.wid1 && (
                              <div className="options opt1">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <button onClick={() => setShapeToDraw('Marker')}>Marker</button>
                              </div>
                            )}
                            <hr></hr>
                        </div>
                        <div className="widgetGroup">
                            <div className="widgets wid2" onClick={() => toggleVisibility('wid2')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid2 ? 'down' : 'right'}`}></i>
                                 <span>TEXT</span>
                            </div>
                            {visibleWidgets.wid2 && (
                                <div className="options opt2">
                                    <i className="fas fa-font"></i>
                                    <button onClick={() => setShapeToDraw('Text')}>Text</button>
                                </div>
                            )}
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid3" onClick={() => toggleVisibility('wid3')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid3 ? 'down' : 'right'}`}></i>
                                 <span>IMAGE</span>
                            </div>
                            {visibleWidgets.wid3 && (
                                <>
                                    <div className="options opt3">
                                        <i className="fas fa-image"></i>
                                        <button onClick={() => setShapeToDraw('Image')}>Image</button>
                                    </div>
                                    <div className="options opt3">
                                        <i className="fas fa-image"></i>
                                        <button onClick={() => setShapeToDraw('GIF')}>GIF</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid4" onClick={() => toggleVisibility('wid4')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid4 ? 'down' : 'right'}`}></i>
                                 <span>SHAPE</span>
                            </div>
                            {visibleWidgets.wid4 && (
                                <>
                                    <div className="options opt4">
                                        <i className="fas fa-caret-up triangle"></i>
                                        <button onClick={() => setShapeToDraw('Triangle')}>Triangle</button>
                                    </div>
                                    <div className="options opt4">
                                        <i className="fas fa-stop"></i>
                                        <button onClick={() => setShapeToDraw('Square')}>Rectangle</button>
                                    </div>
                                    <div className="options opt4">
                                        <i className="fas fa-circle"></i>
                                        <button onClick={() => setShapeToDraw('Circle')}>Circle</button>
                                    </div>
                         
                                </>
                              )}
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid5" onClick={() => toggleVisibility('wid5')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid5 ? 'down' : 'right'}`}></i>
                                 <span>DRAWING</span>
                            </div>
                            {visibleWidgets.wid5 && (
                                <>
                                    <div className="options opt5">
                                        <i className="fas fa-draw-polygon"></i>
                                        <button>Polygon</button>
                                    </div>
                                    <div className="options opt5">
                                        <i className="fas fa-minus"></i>
                                        <button onClick={() => setShapeToDraw('Line')}>Line</button>
                                    </div>
                                    <div className="options opt5">
                                        <i className="fas fa-arrow-right"></i>
                                        <button onClick={() => setShapeToDraw('Arrow')}>Arrow</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid6" onClick={() => toggleVisibility('wid6')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid6 ? 'down' : 'right'}`}></i>
                                 <span>ELEMENT</span>
                            </div>
                            {visibleWidgets.wid6 && (
                                <>
                                    <div className="options opt6">
                                        <i className="fas fa-chart-line"></i>
                                        <button>Chart</button>
                                    </div>
                                    <div className="options opt6">
                                        <i className="fab fa-html5"></i>
                                        <button onClick={() => setShapeToDraw('Iframe')}>Element</button>
                                    </div>
                                    <div className="options opt6">
                                        <i className="fas fa-window-maximize"></i>
                                        <button onClick={() => setShapeToDraw('Iframe')}>Iframe</button>
                                    </div>
                                    <div className="options opt6">
                                        <i className="fas fa-video"></i>
                                        <button>Video</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid7" onClick={() => toggleVisibility('wid7')}>
                                 <i className={`fas fa-angle-${visibleWidgets.wid7 ? 'down' : 'right'}`}></i>
                                 <span>SVG</span>
                            </div>
                            {visibleWidgets.wid7 && (
                                <div className="options opt7">
                                    <i className="fas fa-thin fa-sitemap"></i>
                                    <button>Default</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="editorAreaContainer">
                          <Editor shapeToDraw={shapeToDraw}/>
                </div>
            </div>
          </div>
        </>
    )
}

export default MainPage;