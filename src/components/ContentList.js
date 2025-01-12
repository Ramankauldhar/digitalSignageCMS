import React, {useEffect, useState} from "react";
import { fetchContents } from "../services/api";
import '../styles/contentListStyles.css';

const ContentList = () => {
    const [contents, setContents] = useState([]); //state to hold fetched content's array
    const [loading, setLoading] = useState(true); //state to show loading staus of content list
    const [error, setError] = useState(null); //state to handle errors

    useEffect(() => {
        const getContents = async () => {
            try{
                const data = await fetchContents();
                setContents(data);
                setLoading(false);
            }catch(error){
                setError(error.message || "Failed to load contents.");
                setLoading(false);
            }
        };
        getContents();
    }, []);

    if(loading) return <p>Loading...</p>; //show loading status
    if(error) return <p>Error: {error}</p>; //show error message

    return(
        <div className="contentList">
            <h2>Saved Contents</h2>
            {contents.length>0 ? (
                <ul>
                    {contents.map((content, index) => (
                        <li key={index}>
                            <pre>{JSON.stringify(content, null,2)}</pre>
                        </li>
                    ))}
                </ul>
            ): (
                <p>No Content available.</p>
            )}
        </div>
    );

};
export default ContentList;