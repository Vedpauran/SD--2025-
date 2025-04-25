import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TextEditor from "../../../../components/form-components/EditorComponent";
import FileInputComponent from "../../../file-manager/components/FileInputComponent";
import "../../../../css/style.css"
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

function Chalisacontent() {
    const navigate = useNavigate();
    const { id, lang } = useParams();
    const LanguageAdminName = lang;
    const editorInputHandler = (name, value) => {
        setPage((prevPage) => ({ ...prevPage, [name]: value }));
    };

    const PageModal = {
        Availablity: [],
        Media: [],
        title: "<p></p>",
        description: "<p></p>",
        innertitle: "<p></p>",
        innerdescription: "<p></p>",
        middledescription: "<p></p>",
        middletitle: "<p></p>",
        middleinfo: "<p></p>",
        audiodescription: "<p></p>",
        videodescription: "<p></p>",
        documentsdescription: "<p></p>",
        audio: [],
        video: [],
        documents: [],
        chapters: [
            { tabletitle: "", original: "", meaning: "" }
        ],
        Page: id,
        Language: lang,
    };

    const handleFileDelete = (arrayName, index) => {
        setPage((prevPage) => {
            const updatedArray = [
                ...prevPage[arrayName].filter((e) => e !== index),
            ];

            return {
                ...prevPage,
                [arrayName]: updatedArray,
            };
        });
    };
    const [Page, setPage] = useState(PageModal);
    const [AddAvailable, Availblearray] = useState([{}]);

    const AddAvailablity = (id, value) => {
        Availblearray({ ...AddAvailable, [id]: value });
        setPage({ ...Page, Availablity: AddAvailable });
        console.log(Page);
    };

    function addorRemove(value) {
        const index = Page.Media.indexOf(value); // Check if the value already exists in the AddLanguageay

        if (index !== -1) {
            // If the value exists, remove it
            Page.Media.splice(index, 1);
        } else {
            // If the value doesn't exist, add it
            Page.Media.push(value);
        }
        setPage({ ...Page, Availablity: AddAvailable });
    }

    const Savedata = async (e) => {
        e.preventDefault();
        try {
            const Api = `${process.env.REACT_APP_SERVER}page/chalisa`;
            await axios
                .post(Api, Page)
                .then((res) => {
                    console.log(res);
                    navigate(`/pages/edit/table/${res.data._id}/${lang}`);
                })
                .catch((error) => console.log(error));
        } catch (error) { }
    };

    const Submitdata = async (e) => {
        e.preventDefault();
        try {
            const Api = `${process.env.REACT_APP_SERVER}page/chalisa`;
            await axios
                .post(Api, Page)
                .then((res) => {
                    console.log(res);
                    navigate(`/pages`);
                })
                .catch((error) => console.log(error));
        } catch (error) { }
    };

    const [activeTab, setActiveTab] = useState("Front Page");
    const [openChapters, setOpenChapters] = useState({}); // store opened states

    const tabs = ["Front Page", "Inner Page", "Media", "Content"];

    const toggleOriginMeaning = (index) => {
        setOpenChapters((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // ✅ Add a new chapter
    const handleAddChapter = () => {
        setPage((prevPage) => ({
            ...prevPage,
            chapters: Array.isArray(prevPage.chapters)
                ? [...prevPage.chapters, { tabletitle: "", original: "", meaning: "" }]
                : [{ tabletitle: "", original: "", meaning: "" }], // Ensure default structure
        }));
    };

    // ✅ Handle chapter changes
    const handleChapterChange = (index, field, value) => {
        setPage((prevPage) => {
            const updatedChapters = [...prevPage.chapters];
            updatedChapters[index][field] = value;
            return { ...prevPage, chapters: updatedChapters };
        });
    };



    const handleDeleteChapter = async (index) => {
        try {
            // Make a DELETE request to the backend
            const Api = `${process.env.REACT_APP_SERVER}page/chalisa/${id}/chapter/${index}`;
            await axios.delete(Api);

            // Update the frontend state to reflect the deletion
            setPage((prevPage) => ({
                ...prevPage,
                chapters: prevPage.chapters.filter((_, i) => i !== index),
            }));

            toast.success("Chapter deleted successfully", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            toast.error("Failed to delete chapter", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };


    return (
        <div >
            <h1>Add Page (Content) {LanguageAdminName} Language</h1>
            <div className="Card">
                <div className="drop-col">
                    {" "}
                    <span className="drop-lable">Select Language</span>
                    <select name="Language" disabled>
                        <option value={LanguageAdminName}>
                            {LanguageAdminName}
                        </option>
                    </select>
                </div>
                <span className="drop-lable">Availablity</span>
                <div className="drop-group">
                    <label
                        className="drop-check"
                        style={{
                            background:
                                Page.Media.indexOf("pdf") !== -1
                                    ? "orange"
                                    : "transparent",
                            color:
                                Page.Media.indexOf("pdf") !== -1 ? "white" : "black",
                        }}>
                        <input
                            type="checkbox"
                            checked={
                                Page.Media.indexOf("pdf") !== -1 ? true : false
                            }
                            onChange={(e) => addorRemove("pdf")}
                            className="checkbox"
                        />
                        <span className="drop-lable">Pdf</span>
                    </label>
                    <div className="drop-col">
                        <select
                            className="drop"
                            onChange={(e) => AddAvailablity("Pdf", e.target.value)}>
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                            <option value="3">Hide</option>
                        </select>
                    </div>
                    <label
                        className="drop-check"
                        style={{
                            background:
                                Page.Media.indexOf("text") !== -1
                                    ? "orange"
                                    : "transparent",
                            color:
                                Page.Media.indexOf("text") !== -1 ? "white" : "black",
                        }}>
                        <input
                            type="checkbox"
                            checked={
                                Page.Media.indexOf("text") !== -1 ? true : false
                            }
                            onChange={(e) => addorRemove("text")}
                            className="checkbox"
                        />
                        <span className="drop-lable">Text</span>
                    </label>
                    <div className="drop-col">
                        <select
                            className="drop"
                            onChange={(e) =>
                                AddAvailablity("text", e.target.value)
                            }>
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                            <option value="3">Hide</option>
                        </select>
                    </div>
                    <label
                        className="drop-check"
                        style={{
                            background:
                                Page.Media.indexOf("audio") !== -1
                                    ? "orange"
                                    : "transparent",
                            color:
                                Page.Media.indexOf("audio") !== -1
                                    ? "white"
                                    : "black",
                        }}>
                        <input
                            type="checkbox"
                            checked={
                                Page.Media.indexOf("audio") !== -1 ? true : false
                            }
                            onChange={(e) => addorRemove("audio")}
                            className="checkbox"
                        />
                        <span className="drop-lable">Audio</span>
                    </label>
                    <div className="drop-col">
                        <select
                            className="drop"
                            onChange={(e) =>
                                AddAvailablity("audio", e.target.value)
                            }>
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                            <option value="3">Hide</option>
                        </select>
                    </div>
                    <label
                        className="drop-check"
                        style={{
                            background:
                                Page.Media.indexOf("video") !== -1
                                    ? "orange"
                                    : "transparent",
                            color:
                                Page.Media.indexOf("video") !== -1
                                    ? "white"
                                    : "black",
                        }}>
                        <input
                            type="checkbox"
                            checked={
                                Page.Media.indexOf("video") !== -1 ? true : false
                            }
                            onChange={(e) => addorRemove("video")}
                            className="checkbox"
                        />
                        <span className="drop-lable">Video</span>
                    </label>
                    <div className="drop-col">
                        <select
                            className="drop"
                            onChange={(e) =>
                                AddAvailablity("video", e.target.value)
                            }>
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                            <option value="3">Hide</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Tabs */}
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* Tab Content */}
            <div className="card">
                {activeTab === "Front Page" && (
                    <>
                        <h1>Front Page Description</h1>
                        {
                            new TextEditor(
                                Page.title,
                                (e) => editorInputHandler("title", e),
                                "Title"
                            )
                        }
                        {
                            new TextEditor(
                                Page.description,
                                (e) => editorInputHandler("description", e),
                                "Description"
                            )
                        }
                    </>
                )}

                {activeTab === "Inner Page" && (
                    <>
                        <h1>Inner Page Description</h1>
                        {
                            new TextEditor(
                                Page.innertitle,
                                (e) => editorInputHandler("innertitle", e),
                                "Inner Title"
                            )
                        }
                        {
                            new TextEditor(
                                Page.innerdescription,
                                (e) => editorInputHandler("innerdescription", e),
                                "Inner Description"
                            )
                        }
                    </>
                )}

                {activeTab === "Media" && (
                    <>
                        <div className="card tablecard">
                            <h1>Audio</h1>
                            {new TextEditor(Page.audiodescription, (e) => editorInputHandler("audiodescription", e), "")}
                            <FileInputComponent
                                title="Upload File or add link"
                                links={Page.audio}
                                onDelete={(i) => handleFileDelete("audio", i)}
                                onAdd={(file) => Page.audio.push(file)}
                                type="array"
                            />
                        </div>

                        <div className="card tablecard">
                            <h1>Video</h1>
                            {new TextEditor(Page.videodescription, (e) => editorInputHandler("videodescription", e), "")}
                            <FileInputComponent
                                title="Upload File or add link"
                                links={Page.video}
                                onDelete={(i) => handleFileDelete("video", i)}
                                onAdd={(file) => Page.video.push(file)}
                                type="array"
                            />
                        </div>

                        <div className="card tablecard">
                            <h1>Documents</h1>
                            {new TextEditor(Page.documentsdescription, (e) => editorInputHandler("documentsdescription", e), "")}
                            <FileInputComponent
                                title="Upload File or add link"
                                links={Page.documents}
                                onDelete={(i) => handleFileDelete("documents", i)}
                                onAdd={(file) => Page.documents.push(file)}
                                type="array"
                            />
                        </div>
                    </>
                )}

                {activeTab === "Content" && (
                    <>
                        <h1>Middle Page Description</h1>
                        {
                            new TextEditor(
                                Page.middletitle,
                                (e) => editorInputHandler("middletitle", e),
                                "Middle Title"
                            )
                        }
                        {
                            new TextEditor(
                                Page.middledescription,
                                (e) => editorInputHandler("middledescription", e),
                                "Middle Description"
                            )
                        }
                        <div className="searchitem">
                            <h1>Chalisa</h1>
                            <div className="blursearch">
                                <input
                                    className="search"
                                    placeholder="Search"
                                    type="search"
                                    name="searchbar"
                                    id="searchbar"
                                />
                                <img alt="" src="/icons/svg/search.svg" />
                            </div>
                        </div>


                        {(Page.chapters || []).map((chapter, index) => (
                            <div key={index} className="chapter-container">
                                <div className="column-list">
                                    <div className="column-item">
                                        <label htmlFor={`tabletitle-${index}`}>Table Title</label>
                                        <input
                                            type="text"
                                            id={`tabletitle-${index}`}
                                            value={chapter.tabletitle}
                                            onChange={(e) => handleChapterChange(index, "tabletitle", e.target.value)}
                                            placeholder="Enter Table Title"
                                        />
                                    </div>
                                </div>

                                <div className="column-section">
                                    <div className="column-list">
                                        <div className="column-item">
                                            <label htmlFor={`original-${index}`}>Chapter {index + 1} Original</label>
                                            <input
                                                type="text"
                                                id={`original-${index}`}
                                                value={chapter.original}
                                                onChange={(e) => handleChapterChange(index, "original", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="column-list">
                                        <div className="column-item">
                                            <label htmlFor={`meaning-${index}`}>Chapter {index + 1} Meaning</label>
                                            <input
                                                type="text"
                                                id={`meaning-${index}`}
                                                value={chapter.meaning}
                                                onChange={(e) => handleChapterChange(index, "meaning", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="button-group center">
                                        <button
                                            className="secondary"
                                            onClick={() => handleDeleteChapter(index)}
                                            disabled={Page.chapters.length === 1}
                                        >
                                            Delete
                                        </button>
                                        <button className="primary">Save</button>
                                    </div>
                                </div>
                            </div>
                        ))}



                        <div className="button-group center">
                            <button className="secondary" onClick={handleAddChapter}>Add More Chapter</button>
                            <button className="secondary">Save</button>
                            <button className="primary">Launch</button>
                        </div>

                        {Page.chapters.map((chapter, index) => (
                            <div className="chapter-container" key={index}>
                                <label className="chapter-label">Table Title</label>
                                <div className="chapter-input-wrapper">
                                    <input
                                        type="text"
                                        className="chapter-input"
                                        value={chapter.tabletitle}
                                        readOnly
                                    />
                                    <div className="chapter-icons">
                                        {/* Up and Down Buttons */}
                                        <div className="circle orange-circle">
                                            <button className="edit">
                                                <img alt="" src="/icons/svg/up-down.png" />
                                            </button>
                                            <button className="icon-btn"
                                            >
                                                <IoChevronDown className="icon orange" />
                                            </button>
                                        </div>

                                        {/* Checkmark Button */}
                                        <div className="circle pink-circle">
                                            <button className="icon-btn"
                                                onClick={() => toggleOriginMeaning(index)}>
                                                <FaCheck className="icon pink" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Show/hide Origin and Meaning */}
                                {openChapters[index] && (
                                    <div className="origin-meaning-section">
                                        <p><strong>Origin:</strong> {chapter.original || 'Sample origin text here'}</p>
                                        <p><strong>Meaning:</strong> {chapter.meaning || 'Sample meaning text here'}</p>
                                    </div>
                                )}
                            </div>
                        ))}

                    </>

                )}



            </div>

            <div className="center">
                {" "}
                <button className="addButton btnoutline" onClick={Savedata}>
                    Save
                </button>
                <button onClick={Submitdata} className="addButton">
                    Submit
                </button>
            </div>

            <div className="mb-10"></div>
        </div>

    );
}

export default Chalisacontent;
