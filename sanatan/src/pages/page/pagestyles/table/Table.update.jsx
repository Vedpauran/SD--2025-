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
            setTables(response.data.tables);
            setFaq(response.data.faqs);
        } catch (error) {
            errormsg();
        }
    }

    useEffect(() => {
        fetchdata();
    }, []);

    const [Page, setPage] = useState(PageModal);
    const [AddAvailable, Availblearray] = useState([{}]);
    // const AddAvailablity = (id, value) => {
    //     Availblearray({ ...AddAvailable, [id]: value });
    //     setPage({ ...Page, Availablity: AddAvailable });
    //     console.log(Page);
    // };

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
    // function addorRemove(value) {
    //     const index = Page.Media.indexOf(value); // Check if the value already exists in the AddLanguageay

    //     if (index !== -1) {
    //         // If the value exists, remove it
    //         Page.Media.splice(index, 1);
    //     } else {
    //         // If the value doesn't exist, add it
    //         Page.Media.push(value);
    //     }
    //     setPage({ ...Page, Availablity: AddAvailable });
    // }
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
    const [activeTableIndex, setActiveTableIndex] = useState(null); // which one is selected

    // Handle column name changes
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

        const cleanedValues = {};
        columns.forEach((col) => {
            if (col && values[col]) {
                cleanedValues[col] = values[col];
            }
        });

        const newTable = {
            tableName: values.tableName,
            columns: columns,
            values: cleanedValues,
            mediaOption: mediaOption,
            ...tableMedia,
        };

        try {
            const api = `${process.env.REACT_APP_SERVER}page/table/save`;
            const res = await axios.post(api, {
                Page: Page.Page,       // ObjectId of the page
                Language: Page.Language,
                table: newTable        // only the new table object
            });

            console.log("Saved table only:", res.data);
            toast.success("Table data saved successfully");

            // Update local state if needed
            setTables((prev) => [...prev, newTable]);
            setPage((prev) => ({
                ...prev,
                tables: [...prev.tables, newTable],
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to save table");
        }

        // Reset UI inputs
        setValues({ tableName: "" });
        setColumns([]);
        setColumnCount("");
        setTableMedia({
            tableaudiodescription: "<p></p>",
            tablevideodescription: "<p></p>",
            tabledocumentsdescription: "<p></p>",
            tableaudio: [],
            tablevideo: [],
            tabledocuments: [],
        });
    };

    const handleDeleteTable = async (index) => {
        const tableToDelete = tables[index];

        try {
            // Send a DELETE request to the backend
            const api = `${process.env.REACT_APP_SERVER}page/table/delete`;
            await axios.post(api, {
                Page: Page.Page,
                Language: Page.Language,
                tableName: tableToDelete.tableName,
            });

            // Remove the table from the frontend state
            setTables((prevTables) => prevTables.filter((_, i) => i !== index));
            setPage((prevPage) => ({
                ...prevPage,
                tables: prevPage.tables.filter((_, i) => i !== index),
            }));

            // Clear table fields
            setColumns([]);
            setValues({ tableName: "" });
            setColumnCount("");
            setMediaOption("");
            setTableMedia({
                tableaudiodescription: "<p></p>",
                tablevideodescription: "<p></p>",
                tabledocumentsdescription: "<p></p>",
                tableaudio: [],
                tablevideo: [],
                tabledocuments: [],
            });
        } catch (err) {
            console.error(err);

        }
    };

    const handleAddTable = () => {
        // Reset all input fields for a new table
        setValues({ tableName: "" });
        setColumns([]);
        setColumnCount("");
        setMediaOption("");
        setActiveTableIndex(null); // No table selected yet

        setTableMedia({
            tableaudiodescription: "<p></p>",
            tablevideodescription: "<p></p>",
            tabledocumentsdescription: "<p></p>",
            tableaudio: [],
            tablevideo: [],
            tabledocuments: [],
        });
    };

    const [faq, setFaq] = useState({
        faqtitle: "<p></p>",
        faqdescription: "<p></p>",
    });

    const handleFaqChange = (key, value) => {
        setFaq((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveFaq = async () => {
        try {
            const api = `${process.env.REACT_APP_SERVER}page/table/savefaq`;
            const res = await axios.post(api, {
                Page: Page.Page,
                Language: Page.Language,
                faq: faq // Correct key for backend
            });

            setPage((prev) => ({
                ...prev,
                faqs: [...prev.faqs, faq], // Append new faq to local state
            }));

            // Reset input fields
            setFaq({
                faqtitle: "",
                faqdescription: "",
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFaq = async (index) => {
        const faqtitleToDelete = faq[index].faqtitle;
        try {
            const api = `${process.env.REACT_APP_SERVER}page/table/deletefaq`;
            await axios.post(api, {
                Page: Page.Page,
                Language: Page.Language,
                faqtitle: faqtitleToDelete,
            });

            setPage((prev) => ({
                ...prev,
                faqs: prev.faqs.filter((_, i) => i !== index), // Remove from local state
            }));
        } catch (err) {
            console.error(err);
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
                {/* <div className="drop-group">
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
                </div> */}
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
                            {/* Table view seaction */}
                            <div className="table-viewer-container">
                                <div className="table-buttons-wrapper">

                                    {tables.map((table, index) => (
                                        <button
                                            key={index}
                                            className={`table-button ${activeTableIndex === index ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveTableIndex(index);
                                                const selected = tables[index];

                                                setValues({
                                                    tableName: selected.tableName,
                                                    ...selected.values,
                                                });

                                                setColumns(selected.columns);
                                                setColumnCount(selected.columns.length);
                                                setMediaOption(selected.mediaOption || "");

                                                setTableMedia({
                                                    tableaudiodescription: selected.tableaudiodescription || "<p></p>",
                                                    tablevideodescription: selected.tablevideodescription || "<p></p>",
                                                    tabledocumentsdescription: selected.tabledocumentsdescription || "<p></p>",
                                                    tableaudio: selected.tableaudio || [],
                                                    tablevideo: selected.tablevideo || [],
                                                    tabledocuments: selected.tabledocuments || [],
                                                });
                                            }}
                                        >
                                            {table.tableName || `Table ${index + 1}`}
                                        </button>
                                    ))}

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
                                <button
                                    className="addButton"
                                    onClick={handleAddTable}
                                >
                                    Add
                                </button>
                                <button
                                    className="addButton btnoutline"
                                    onClick={() => {
                                        if (activeTableIndex !== null) {
                                            handleDeleteTable(activeTableIndex);
                                        } else {
                                            toast.error("Please select a table to delete");
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                                {/* <button
                                    className="addButton btnoutline"
                                    disabled={activeTableIndex === null}
                                >
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

                        <div className="searchitem">
                            <h1>FAQs</h1>
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
                        <div className="faq-container">
                            {Page.faqs.map((faq, index) => (
                                <div className="faq-wrapper" key={index}>
                                    <div className="faq-card">
                                        <div className="faq-header">
                                            <h2 className="faq-title">{faq.faqtitle}</h2>
                                            <button className="chevron">
                                                <img alt="" src="/icons/svg/arrow-down.png" />
                                            </button>
                                        </div>
                                        <p className="faq-description">{faq.faqdescription}</p>
                                    </div>

                                    {/* Positioned outside the card */}
                                    <div className="faq-floating-actions">
                                        <button className="edit">
                                            <img alt="" src="/icons/svg/up-down.png" />
                                        </button>
                                        <button className="delete"
                                            onClick={() => handleDeleteFaq(index)}>
                                            <img alt="" src="/icons/svg/delete.png" />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
