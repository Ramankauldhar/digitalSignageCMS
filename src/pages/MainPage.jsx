import { useState } from "react";
import '../styles/mainPageStyles.css';

const MainPage = () => {
    const [inputValue, setInputValue] = useState('');

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
                            <div className="widgets wid1">
                                 <i className="fas fa-angle-down"></i>
                                 <span>MARKER</span>
                            </div>
                            <div className="options opt1">
                                 <i className="fas fa-map-marker-alt"></i>
                                 <button>Marker</button>
                            </div>
                            <hr></hr>
                        </div>
                        <div className="widgetGroup">
                            <div className="widgets wid2">
                                 <i className="fas fa-angle-down"></i>
                                 <span>TEXT</span>
                            </div>
                            <div className="options opt2">
                                 <i className="fas fa-font"></i>
                                 <button>Text</button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid3">
                                 <i className="fas fa-angle-down"></i>
                                 <span>IMAGE</span>
                            </div>
                            <div className="options opt3">
                                 <i className="fas fa-image"></i>
                                 <button>Image</button>
                            </div>
                            <div className="options opt3">
                                 <i className="fas fa-image"></i>
                                 <button>GIF</button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid4">
                                 <i className="fas fa-angle-down"></i>
                                 <span>SHAPE</span>
                            </div>
                            <div className="options opt4">
                                 <i className="fas fa-duotone fa-regular fa-caret-up triangle"></i>
                                 <button>Triangle</button>
                            </div>
                            <div className="options opt4">
                                 <i className="fas fa-stop"></i>
                                 <button>Rectangle</button>
                            </div>
                            <div className="options opt4">
                                 <i className="fas fa-solid fa-circle"></i>
                                 <button>Circle</button>
                            </div>
                            <div className="options opt4">
                                 <i className="fas fa-cube"></i>
                                 <button>Cube</button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="widgetGroup">
                            <div className="widgets wid5">
                                 <i className="fas fa-angle-down"></i>
                                 <span>DRAWING</span>
                            </div>
                            <div className="options opt5">
                                 <i className="fas fa-draw-polygon"></i>
                                 <button>Polygon</button>
                            </div>
                            <div className="options opt5">
                                 <i className="fas fa-solid fa-minus"></i>
                                 <button>Line</button>
                            </div>
                            <div className="options opt5">
                                 <i className="fas fa-light fa-arrow-right"></i>
                                 <button>Arrow</button>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                </div>

                <div className="editorAreaContainer"> </div>
                <div className="rightContainer"></div>
            </div>
          </div>
        </>
    )
}

export default MainPage;