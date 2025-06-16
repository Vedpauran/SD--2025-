import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TextEditor from "../../../../components/form-components/EditorComponent";
import FileInputComponent from "../../../file-manager/components/FileInputComponent";
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';
import "../../../../css/style.css"

function Chalisacontentupdate() {
    const navigate = useNavigate();
    const { id, lang } = useParams();
    const LanguageAdminName = lang;
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
            {
                tabletitle: "",
                verses: [
                    { original: "", meaning: "" }
                ]
            }
        ],
        Page: id,
        Language: lang,
    };

    const errormsg = () =>
        toast.error("Unexpected Error ouccured", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    async function fetchdata() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER}page/chalisa/${id}`
            );
            setPage(response.data);
            Availblearray(response.data.Availablity);
        } catch (error) {
            errormsg();
        }
    }

    useEffect(() => {
        fetchdata();
    }, []);

    const [Page, setPage] = useState(PageModal);
    const [AddAvailable, Availblearray] = useState([{}]);

    const AddAvailablity = (id, value) => {
        const updatedAvailability = { ...Page.Availablity, [id]: value };
        let updatedMedia = [...Page.Media];

        // Sync checkbox with dropdown
        if (value === "1") {
            if (!updatedMedia.includes(id)) {
                updatedMedia.push(id);
            }
        } else if (value === "2") {
            updatedMedia = updatedMedia.filter((item) => item !== id);
        }

        setPage({
            ...Page,
            Availablity: updatedAvailability,
            Media: updatedMedia,
        });
    };

    const addorRemove = (value) => {
        const updatedMedia = [...Page.Media];
        const updatedAvailability = { ...Page.Availablity };

        if (updatedMedia.includes(value)) {
            // Uncheck -> Remove from Media and set to Inactive (2)
            const newMedia = updatedMedia.filter((item) => item !== value);
            updatedAvailability[value] = "2";
            setPage({
                ...Page,
                Media: newMedia,
                Availablity: updatedAvailability,
            });
        } else {
            // Check -> Add to Media and set to Active (1)
            updatedMedia.push(value);
            updatedAvailability[value] = "1";
            setPage({
                ...Page,
                Media: updatedMedia,
                Availablity: updatedAvailability,
            });
        }
    };


    const editorInputHandler = (name, value) => {
        setPage((prevPage) => ({ ...prevPage, [name]: value }));
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
    const Savedata = async (e) => {
        e.preventDefault();
        try {
            const Api = `${process.env.REACT_APP_SERVER}page/chalisa/${id}`;
            await axios
                .put(Api, Page)
                .then((res) => {
                    const notify = () =>
                        toast.success("Successfully Updated", {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    notify();
                })
                .catch((error) => errormsg());
        } catch (error) {
            errormsg();
        }
    };

    const Submitdata = async (e) => {
        e.preventDefault();
        try {
            const Api = `${process.env.REACT_APP_SERVER}page/chalisa/${id}`;
            await axios
                .put(Api, Page)
                .then((res) => {
                    console.log(res);
                    navigate(`/pages`);
                })
                .catch((error) => errormsg());
        } catch (error) {
            errormsg();
        }
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
    // const handleAddChapter = () => {
    //     setPage((prevPage) => ({
    //         ...prevPage,
    //         chapters: Array.isArray(prevPage.chapters)
    //             ? [...prevPage.chapters, { tabletitle: "", verses: [{ original: "", meaning: "" }] }]
    //             : [{ tabletitle: "", verses: [{ original: "", meaning: "" }] }],
    //     }));
    // };

    const handleAddChapter = () => {
        setPage((prevPage) => ({
            ...prevPage,
            chapters: [
                ...(Array.isArray(prevPage.chapters) ? prevPage.chapters : []),
                { tabletitle: "", verses: [{ original: "", meaning: "" }] }
            ]
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

    const handleAddVerse = (chapterIndex) => {
        setPage(prevPage => {
            const updatedChapters = prevPage.chapters.map((chapter, index) => {
                if (index === chapterIndex) {
                    return {
                        ...chapter,
                        verses: [...chapter.verses, { original: "", meaning: "" }]
                    }
                }
                return chapter;
            });
            return { ...prevPage, chapters: updatedChapters };
        });
    };


    // Remove a verse from a chapter
    const handleDeleteVerse = async (chapterIndex, verseIndex) => {
        try {
            // Call backend API to delete the verse
            const Api = `${process.env.REACT_APP_SERVER}page/chalisa/${id}/chapter/${chapterIndex}/verse/${verseIndex}`;
            await axios.delete(Api);

            // Update frontend state
            setPage((prevPage) => {
                const updatedChapters = [...prevPage.chapters];
                updatedChapters[chapterIndex].verses = updatedChapters[chapterIndex].verses.filter((_, i) => i !== verseIndex);
                return { ...prevPage, chapters: updatedChapters };
            });

            toast.success("Verse deleted successfully", {
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
            toast.error("Failed to delete verse", {
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

    // Handle verse changes
    const handleVerseChange = (chapterIndex, verseIndex, field, value) => {
        setPage((prevPage) => {
            const updatedChapters = [...prevPage.chapters];
            updatedChapters[chapterIndex].verses[verseIndex][field] = value;
            return { ...prevPage, chapters: updatedChapters };
        });
    };

    useEffect(() => {
        if (!Array.isArray(Page.chapters) || Page.chapters.length === 0) {
            setPage((prevPage) => ({
                ...prevPage,
                chapters: [{ tabletitle: "", verses: [{ original: "", meaning: "" }] }],
            }));
        } else {
            const updatedChapters = Page.chapters.map(ch =>
                ch.verses ? ch : { ...ch, verses: [{ original: "", meaning: "" }] }
            );

            // Only update if chapters were actually missing verses
            if (JSON.stringify(updatedChapters) !== JSON.stringify(Page.chapters)) {
                setPage((prevPage) => ({
                    ...prevPage,
                    chapters: updatedChapters
                }));
            }
        }
    }, [Page.chapters]);



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
                    {["pdf", "text", "audio", "video"].map((type) => (
                        <React.Fragment key={type}>
                            <label
                                className="drop-check"
                                style={{
                                    background: Page.Media.includes(type) ? "orange" : "transparent",
                                    color: Page.Media.includes(type) ? "white" : "black",
                                }}>
                                <input
                                    type="checkbox"
                                    checked={Page.Media.includes(type)}
                                    onChange={() => addorRemove(type)}
                                    className="checkbox"
                                />
                                <span className="drop-lable">
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </span>
                            </label>

                            <div className="drop-col">
                                <select
                                    className="drop"
                                    value={
                                        Page.Availablity && Page.Availablity[type]
                                            ? Page.Availablity[type]
                                            : Page.Media.includes(type)
                                                ? "1"
                                                : "2"
                                    }
                                    onChange={(e) => AddAvailablity(type, e.target.value)}>
                                    <option value="1">Active</option>
                                    <option value="2">Inactive</option>
                                    <option value="3">Hide</option>
                                </select>
                            </div>
                        </React.Fragment>
                    ))}

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



                        {(Page.chapters || []).map((chapter, chapterIndex) => (
                            <div key={chapterIndex} className="chapter-container">
                                <div className="column-list">
                                    <div className="column-item">
                                        <label htmlFor={`tabletitle-${chapterIndex}`}>Table Title</label>
                                        <input
                                            type="text"
                                            id={`tabletitle-${chapterIndex}`}
                                            value={chapter.tabletitle}
                                            onChange={(e) => handleChapterChange(chapterIndex, "tabletitle", e.target.value)}
                                            placeholder="Enter Table Title"
                                        />
                                    </div>
                                </div>

                                {chapter.verses.map((verse, verseIndex) => (
                                    <div className="column-section" key={verseIndex}>
                                        <div className="column-list">
                                            <div className="column-item">
                                                <label htmlFor={`original-${chapterIndex}-${verseIndex}`}>Original</label>
                                                <input
                                                    type="text"
                                                    id={`original-${chapterIndex}-${verseIndex}`}
                                                    value={verse.original}
                                                    onChange={(e) => handleVerseChange(chapterIndex, verseIndex, "original", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="column-list">
                                            <div className="column-item">
                                                <label htmlFor={`meaning-${chapterIndex}-${verseIndex}`}>Meaning</label>
                                                <input
                                                    type="text"
                                                    id={`meaning-${chapterIndex}-${verseIndex}`}
                                                    value={verse.meaning}
                                                    onChange={(e) => handleVerseChange(chapterIndex, verseIndex, "meaning", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="button-group center">
                                            <button
                                                className="secondary"
                                                onClick={() => handleAddVerse(chapterIndex)}
                                            >
                                                Add More Verse
                                            </button>
                                            <button
                                                className="secondary"
                                                onClick={() => handleDeleteVerse(chapterIndex, verseIndex)}
                                                disabled={chapter.verses.length === 1}
                                            >
                                                Delete
                                            </button>
                                            <button className="primary">Save</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="button-group center">
                            <button className="secondary" onClick={handleAddChapter}>Add More Chapter</button>
                            <button className="secondary">Save</button>
                            <button className="primary"
                                onClick={() => handleDeleteChapter(0)} // Change 0 to the chapter index you want to delete
                                disabled={Page.chapters.length === 0}
                            >Launch</button>
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
                                            <button className="icon-btn">
                                                <img alt="" src="/icons/svg/up-down.png" />
                                            </button>
                                        </div>
                                        {/* Checkmark Button */}
                                        <div className="circle pink-circle">
                                            <button className="icon-btn"
                                                onClick={() => toggleOriginMeaning(index)}>
                                                <img alt="" src="/icons/svg/arrow-down.png" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Show/hide all Origins and Meanings */}
                                {openChapters[index] && chapter.verses && chapter.verses.length > 0 && (
                                    <div className="origin-meaning-section">
                                        {chapter.verses.map((verse, vIdx) => (
                                            <div key={vIdx}>
                                                <p><strong>Origin {vIdx + 1}:</strong> {verse.original || 'Sample origin text here'}</p>
                                                <p><strong>Meaning {vIdx + 1}:</strong> {verse.meaning || 'Sample meaning text here'}</p>
                                                <hr />
                                            </div>
                                        ))}
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

export default Chalisacontentupdate;
