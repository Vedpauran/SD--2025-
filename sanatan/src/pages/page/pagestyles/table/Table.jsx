import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../../../components/form-components/EditorComponent";
import FileInputComponent from "../../../file-manager/components/FileInputComponent";
import "../../../../css/style.css"

function Tablecontent() {
    const navigate = useNavigate();
    const { id, lang } = useParams();
    const LanguageAdminName = lang;
    const editorInputHandler = (name, value) => {
        setPage((prevPage) => ({ ...prevPage, [name]: value }));
    };


    const [columnCount, setColumnCount] = useState("");
    const [mediaOption, setMediaOption] = useState("");
    const [columns, setColumns] = useState([]);
    const [values, setValues] = useState({ tableName: "" }); // Always includes "Table Name"
    const [tables, setTables] = useState([]);

    const handleColumnChange = (index, newColumnName) => {
        const oldColumnName = columns[index];
        const updatedColumns = [...columns];
        updatedColumns[index] = newColumnName;
        setColumns(updatedColumns);

        setValues((prevValues) => {
            const updatedValues = { ...prevValues };

            // If the old column had a value, move it to the new column
            if (oldColumnName && updatedValues[oldColumnName]) {
                updatedValues[newColumnName] = updatedValues[oldColumnName];
            }

            // Delete the old key
            if (oldColumnName && oldColumnName !== newColumnName) {
                delete updatedValues[oldColumnName];
            }

            return updatedValues;
        });
    };


    // Handle column count changes
    const handleColumnCountChange = (e) => {
        const value = e.target.value;

        if (value === "") {
            setColumnCount("");
            setColumns([]);
            setValues({ tableName: "" }); // Reset but keep "Table Name"
            return;
        }

        const count = parseInt(value, 10);
        if (!isNaN(count)) {
            setColumnCount(count);
            setColumns(
                count > columns.length
                    ? [...columns, ...new Array(count - columns.length).fill("")]
                    : columns.slice(0, count)
            );
        }
    };

    // Handle dynamic input field values
    const handleValueChange = (key, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const [tableMedia, setTableMedia] = useState({
        tableaudiodescription: "<p></p>",
        tablevideodescription: "<p></p>",
        tabledocumentsdescription: "<p></p>",
        tableaudio: [],
        tablevideo: [],
        tabledocuments: [],
    });

    const handleSaveTable = async () => {
        if (!values.tableName) return;

        // ✅ Clean values to only include current column keys
        const cleanedValues = {};
        columns.forEach((col) => {
            if (col && values[col]) {
                cleanedValues[col] = values[col];
            }
        });

        // ✅ Build new table object with correct schema structure
        const newTable = {
            tableName: values.tableName,
            columns: columns, // should be array of strings
            values: cleanedValues, // should be object { key: value }
            mediaOption: mediaOption,
            ...tableMedia,
        };

        const updatedTables = [...tables, newTable];

        setPage((prev) => ({
            ...prev,
            tables: updatedTables,
        }));

        // setTables(updatedTables); // save in local state
        setValues({ tableName: "" }); // reset inputs
        setColumns([]); // clear columns
        setColumnCount(""); // reset count
        setTableMedia({ // reset media
            tableaudiodescription: "<p></p>",
            tablevideodescription: "<p></p>",
            tabledocumentsdescription: "<p></p>",
            tableaudio: [],
            tablevideo: [],
            tabledocuments: [],
        });

        // const updatedPage = {
        //     ...Page,
        //     tables: updatedTables,
        // };

        // try {
        //     const response = await axios.post(`${process.env.REACT_APP_SERVER}page/table`, updatedPage);
        //     console.log("Page saved successfully", response.data);
        // } catch (error) {
        //     console.error("Error saving page:", error);
        // }
    };

    const [faq, setFaq] = useState({
        faqtitle: "",
        faqdescription: "",
    });

    const handleFaqChange = (key, value) => {
        setFaq((prev) => ({ ...prev, [key]: value }));
    };

    // const handleSaveFaq = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // Create new FAQ object
    //         const newFaq = {
    //             faqtitle: faq.faqtitle,
    //             faqdescription: faq.faqdescription
    //         };

    //         // Make API call to save the updated page
    //         const api = `${process.env.REACT_APP_SERVER}page/table`;
    //         const res = await axios.post(api, {
    //             ...Page,
    //             faqs: [...(Page.faqs || []), newFaq]
    //         });

    //         if (res && res.data) {
    //             // Update page state with response data
    //             setPage(prev => ({
    //                 ...prev,
    //                 faqs: res.data.faqs || [...(prev.faqs || []), newFaq]
    //             }));

    //             // Reset FAQ form
    //             setFaq({
    //                 faqtitle: "",
    //                 faqdescription: "",
    //             });
    //         } else {
    //             console.error("Invalid response from server");
    //         }

    //     } catch (err) {
    //         console.error("Error saving FAQ:", err);
    //         if (err.response && err.response.data) {
    //             console.error("Server error:", err.response.data);
    //         }
    //     }
    // }
    const handleSaveFaq = (e) => {
        e.preventDefault();

        // Create new FAQ object
        const newFaq = {
            faqtitle: faq.faqtitle,
            faqdescription: faq.faqdescription,
        };

        // Update the Page state with the new FAQ
        setPage((prev) => ({
            ...prev,
            faqs: [...(prev.faqs || []), newFaq],
        }));

        // Reset FAQ form
        setFaq({
            faqtitle: "",
            faqdescription: "",
        });

        console.log("FAQ added locally:", newFaq);
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
        Page: id,
        Language: lang,
        tables: [
            {
                tableName: "",
                columns: [],
                values: {}, // Object for dynamic column values
                mediaOption: "", // Default value
                tableaudiodescription: "<p></p>",
                tablevideodescription: "<p></p>",
                tabledocumentsdescription: "<p></p>",
                tableaudio: [],
                tablevideo: [],
                tabledocuments: [],
            }
        ],
        faqs: [
            {
                faqtitle: "<p></p>",
                faqdescription: "<p></p>",
            }
        ]
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
            const Api = `${process.env.REACT_APP_SERVER}page/table`;
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
            const Api = `${process.env.REACT_APP_SERVER}page/table`;
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

    const tabs = ["Front Page", "Inner Page", "Media", "Content", "FAQs"];


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
                        <div className="table-details">
                            <h1 className="title">Table Details</h1>

                            <div className="form-group">
                                {/* Column Count Input */}
                                <div className="input-group">
                                    <label htmlFor="column-count">How Many Columns you want?</label>
                                    <input
                                        type="number"
                                        id="column-count"
                                        value={columnCount}
                                        onChange={handleColumnCountChange}
                                    />
                                </div>

                                {/* Media Option Dropdown */}
                                <div className="input-group">
                                    <label htmlFor="audio-video">Do you want to add Audio & Video?</label>
                                    <select
                                        id="audio-video"
                                        value={mediaOption}
                                        onChange={(e) => setMediaOption(e.target.value)}
                                    >
                                        <option value="">Select Option (Audio, Video, PDF, All)</option>
                                        <option value="audio">Audio</option>
                                        <option value="video">Video</option>
                                        <option value="pdf">PDF</option>
                                        <option value="all">All</option>
                                    </select>
                                </div>
                            </div>

                            {/* Column Name Inputs */}
                            <div className="column-section">
                                <h2 className="subtitle">Table - Column Names</h2>
                                <div className="column-list">
                                    {columns.map((column, index) => (
                                        <div key={index} className="column-item">
                                            <label htmlFor={`column-${index}`}>{`Column ${index + 1}`}</label>
                                            <input
                                                type="text"
                                                id={`column-${index}`}
                                                value={column}
                                                onChange={(e) => handleColumnChange(index, e.target.value)}
                                                placeholder={`Column ${index + 1} Name`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="searchitem">
                                <h1>Table</h1>
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

                            {/* Enter Values Section */}
                            <div className="column-section">
                                <h2 className="subtitle">Enter Values</h2>
                                <div className="column-list">
                                    {/* Table Name Input (Always Visible) */}
                                    <div className="column-item">
                                        <label>Table Name</label>
                                        <input
                                            type="text"
                                            value={values.tableName}
                                            onChange={(e) => handleValueChange("tableName", e.target.value)}
                                            placeholder="Enter Table Name"
                                        />
                                    </div>

                                    {/* Dynamic Column Inputs */}
                                    {columns
                                        .filter((column) => column.trim() !== "") // Only show for non-empty column names
                                        .map((column, index) => (
                                            <div key={index} className="column-item">
                                                <label>{column}</label>
                                                <input
                                                    type="text"
                                                    value={values[column] || ""}
                                                    onChange={(e) => handleValueChange(column, e.target.value)}
                                                    placeholder={`Enter ${column} value`}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>


                            {/* Conditionally Rendered Media Sections */}
                            {["audio", "all"].includes(mediaOption) && (
                                <div className="card tablecard">
                                    <h1>Audio</h1>
                                    {new TextEditor(
                                        tableMedia.tableaudiodescription,
                                        (e) => setTableMedia((prev) => ({ ...prev, tableaudiodescription: e })),
                                        ""
                                    )}
                                    <FileInputComponent
                                        title="Upload File or add link"
                                        links={tableMedia.tableaudio}
                                        onDelete={(i) =>
                                            setTableMedia((prev) => ({
                                                ...prev,
                                                tableaudio: prev.tableaudio.filter((_, index) => index !== i),
                                            }))
                                        }
                                        onAdd={(file) =>
                                            setTableMedia((prev) => ({
                                                ...prev,
                                                tableaudio: [...prev.tableaudio, file],
                                            }))
                                        }
                                        type="array"
                                    />
                                </div>
                            )}

                            {["video", "all"].includes(mediaOption) && (
                                <div className="card tablecard">
                                    <h1>Video</h1>
                                    {new TextEditor(
                                        tableMedia.tablevideodescription,
                                        (e) => setTableMedia((prev) => ({ ...prev, tablevideodescription: e })),
                                        ""
                                    )}
                                    <FileInputComponent
                                        title="Upload File or add link"
                                        links={tableMedia.tablevideo}
                                        onDelete={(i) =>
                                            setTableMedia((prev) => ({
                                                ...prev,
                                                tablevideo: prev.tablevideo.filter((_, index) => index !== i),
                                            }))
                                        }
                                        onAdd={(file) =>
                                            setTableMedia((prev) => ({
                                                ...prev,
                                                tablevideo: [...prev.tablevideo, file],
                                            }))
                                        }
                                        type="array"
                                    />
                                </div>
                            )}

                            {["pdf", "all"].includes(mediaOption) && (
                                <div className="card tablecard">
                                    <h1>Documents</h1>
                                    {new TextEditor(
                                        tableMedia.tabledocumentsdescription,
                                        (e) => setTableMedia((prev) => ({ ...prev, tabledocumentsdescription: e })),
                                        ""
                                    )}
                                    <FileInputComponent
                                        title="Upload File or add link"
                                        links={tableMedia.tabledocuments}
                                        onDelete={(i) =>
                                            setTableMedia((prev) => ({
                                                ...prev,
                                                tabledocuments: prev.tabledocuments.filter((_, index) => index !== i),
                                            }))
                                        }
                                        onAdd={(file) =>
                                            setTableMedia((prev) => ({
                                                ...prev,
                                                tabledocuments: [...prev.tabledocuments, file],
                                            }))
                                        }
                                        type="array"
                                    />
                                </div>
                            )}


                            <div className="center">
                                {" "}
                                {/* <button className="addButton btnoutline" >
                                    Delete
                                </button> */}
                                <button className="addButton" onClick={handleSaveTable}>Save</button>
                            </div>

                        </div>
                    </>
                )}

                {activeTab === "FAQs" && (
                    <>
                        <div className="searchitem">
                            <h1>Add FAQ</h1>
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
                        <div className="column-section">
                            <div className="column-list">
                                <div className="column-item">
                                    <label >Add Title</label>
                                    <input
                                        type="text"
                                        value={faq.faqtitle}
                                        onChange={(e) => handleFaqChange("faqtitle", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="column-list">
                                <div className="column-item">
                                    <label >Add Description</label>
                                    <textarea
                                        value={faq.faqdescription}
                                        onChange={(e) => handleFaqChange("faqdescription", e.target.value)}
                                        rows="5" cols="50" />

                                </div>
                            </div>
                            <div className="center">
                                <button className="addButton" onClick={handleSaveFaq}>
                                    save
                                </button>
                            </div>
                        </div>
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

export default Tablecontent;
