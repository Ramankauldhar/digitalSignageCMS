import React, { useEffect, useState } from "react";
import { fetchContents } from "../services/api";
import * as fabric from 'fabric';
import '../styles/contentListStyles.css';

const ContentList = ({ canvasInstance }) => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        const getContents = async () => {
            try {
                const data = await fetchContents();
                console.log('Fetched contents:', data);
                setContents(data);
                setLoading(false);
            } catch (error) {
                setError(error.message || "Failed to load contents.");
                setLoading(false);
            }
        };
        getContents();
    }, []);

    const handleViewContent = (data) => {
        if (!canvasInstance.current) return;
        let parsedData;
        try {
            if (typeof data.data === 'string') {
                parsedData = JSON.parse(data.data);
                console.log('Parsed data:', parsedData);
            } else {
                parsedData = data.data;
            }

            setPreviewData(parsedData);

            if (canvasInstance.current) {
                canvasInstance.current.clear(); // Ensure the canvas is cleared before loading new content
                canvasInstance.current.loadFromJSON(parsedData, () => {
                    canvasInstance.current.renderAll();
                });
            }

            setShowPreview(true);
        } catch (error) {
            console.error("Error parsing or loading content data:", error);
            alert("Failed to load content.");
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
    };

    const renderPreviewCanvas = () => {
        if (!previewData || !canvasInstance.current) return;

        canvasInstance.current.clear();
        canvasInstance.current.loadFromJSON(previewData, () => {
            canvasInstance.current.renderAll();
        });
    };

    useEffect(() => {
        if (showPreview && previewData) {
            renderPreviewCanvas();
        }
    }, [showPreview, previewData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="contentList">
            <h2>Saved Contents</h2>
            {contents.length > 0 ? (
                <ul>
                    {contents.map((content, index) => (
                        <li key={index}>
                            <p>Saved Content {index + 1}</p>
                            <button onClick={() => handleViewContent(content)}>
                                Preview Content
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Content available.</p>
            )}

            {showPreview && (
                <div className="previewScreen">
                    <div className="previewContent">
                        <h2>Preview Content</h2>
                        <div className="canvasPreview">
                            <canvas id="previewCanvas" width="600" height="600"></canvas>
                        </div>
                        <button onClick={handleClosePreview}>Close Preview</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentList;