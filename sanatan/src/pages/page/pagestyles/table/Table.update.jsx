import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TextEditor from "../../../../components/form-components/EditorComponent";
import FileInputComponent from "../../../file-manager/components/FileInputComponent";
import "../../../../css/style.css"

function Tablecontentupdate() {
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
        Page: id,
        Language: lang,
        tableName: "<p></p>",
        columns: [],
        values: {}, // Object for dynamic column values
        mediaOption: "<p></p>", // Default value
        tableaudiodescription: "<p></p>",
        tablevideodescription: "<p></p>",
        tabledocumentsdescription: "<p></p>",
        tableaudio: [],
        tablevideo: [],
        tabledocuments: [],
        faqtitle: "<p></p>",
        faqdescription: "<p></p>",
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
                `${process.env.REACT_APP_SERVER}page/table/${id}`
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
            const Api = `${process.env.REACT_APP_SERVER}page/table/${id}`;
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
            const Api = `${process.env.REACT_APP_SERVER}page/table/${id}`;
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

    const tabs = ["Front Page", "Inner Page", "Media", "Content", "FAQs"];


    const [columnCount, setColumnCount] = useState("");
    const [mediaOption, setMediaOption] = useState("");
    const [columns, setColumns] = useState([]);
    const [values, setValues] = useState({ tableName: "" }); // Always includes "Table Name"
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [faqs, setFaqs] = useState([]);
    // Handle column name changes
    const handleColumnChange = (index, value) => {
        const updatedColumns = [...columns];
        updatedColumns[index] = value;
        setColumns(updatedColumns);

        // Initialize input fields for new column names
        setValues((prevValues) => ({
            ...prevValues,
            [value]: prevValues[columns[index]] || "", // Keep old value if name changes
        }));
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

    // const handleSaveTable = () => {
    //     if (!values.tableName) return;

    //     setTables([...tables, { ...values }]);
    //     setValues({ tableName: "" });
    // };
    const handleSaveTable = async () => {
        if (!values.tableName) return;

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}page/table`, {
                ...values,
                Page: id,
                Language: lang,
            });
            setTables([...tables, response.data]); // Add the new table to the list
            setValues({ tableName: "" }); // Reset form
            toast.success("Table saved successfully!", {
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
            errormsg();
        }
    };
    const handleAddFaq = () => {
        if (Page.faqtitle.trim() && Page.faqdescription.trim()) {
            setFaqs([...faqs, { title: Page.faqtitle, description: Page.faqdescription }]);
            setPage({ faqtitle: "", faqdescription: "" }); // Reset input fields
        }
    };

    const handleDeleteFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
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
                                    {new TextEditor(Page.tableaudiodescription, (e) => editorInputHandler("tableaudiodescription", e), "")}
                                    <FileInputComponent
                                        title="Upload File or add link"
                                        links={Page.tableaudio}
                                        onDelete={(i) => handleFileDelete("audio", i)}
                                        onAdd={(file) => Page.tableaudio.push(file)}
                                        type="array"
                                    />
                                </div>
                            )}

                            {["video", "all"].includes(mediaOption) && (
                                <div className="card tablecard">
                                    <h1>Video</h1>
                                    {new TextEditor(Page.tablevideodescription, (e) => editorInputHandler("tablevideodescription", e), "")}
                                    <FileInputComponent
                                        title="Upload File or add link"
                                        links={Page.tablevideo}
                                        onDelete={(i) => handleFileDelete("video", i)}
                                        onAdd={(file) => Page.tablevideo.push(file)}
                                        type="array"
                                    />
                                </div>
                            )}

                            {["pdf", "all"].includes(mediaOption) && (
                                <div className="card tablecard">
                                    <h1>Documents</h1>
                                    {new TextEditor(Page.tabledocumentsdescription, (e) => editorInputHandler("tabledocumentsdescription", e), "")}
                                    <FileInputComponent
                                        title="Upload File or add link"
                                        links={Page.tabledocuments}
                                        onDelete={(i) => handleFileDelete("documents", i)}
                                        onAdd={(file) => Page.tabledocuments.push(file)}
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
                                        value={Page.faqtitle}
                                        onChange={(e) => editorInputHandler("faqtitle", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="column-list">
                                <div className="column-item">
                                    <label >Add Description</label>
                                    <textarea
                                        value={Page.faqdescription}
                                        onChange={(e) => editorInputHandler("faqdescription", e.target.value)}
                                        rows="5" cols="50" />

                                </div>
                            </div>
                            <div className="center">
                                <button className="addButton" onClick={handleAddFaq}>
                                    save
                                </button>
                            </div>
                            {/* Display Added FAQs */}
                            <div className="faq-list">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="faq-item">
                                        <div className="faq-content">
                                            <h3>{faq.title}</h3>
                                            <p>{faq.description}</p>
                                        </div>
                                        <div className="faq-actions">
                                            <button onClick={() => handleDeleteFaq(index)}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
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

export default Tablecontentupdate;
