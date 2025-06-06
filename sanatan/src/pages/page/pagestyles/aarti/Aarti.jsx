import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../../../components/form-components/EditorComponent";
import FileInputComponent from "../../../file-manager/components/FileInputComponent";

function Aarticontent() {
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
	// const AddAvailablity = (id, value) => {
	// 	Availblearray({ ...AddAvailable, [id]: value });
	// 	setPage({ ...Page, Availablity: AddAvailable });
	// 	console.log(Page);
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
	// 	const index = Page.Media.indexOf(value); // Check if the value already exists in the AddLanguageay

	// 	if (index !== -1) {
	// 		// If the value exists, remove it
	// 		Page.Media.splice(index, 1);
	// 	} else {
	// 		// If the value doesn't exist, add it
	// 		Page.Media.push(value);
	// 	}
	// 	setPage({ ...Page, Availablity: AddAvailable });
	// }

	const Savedata = async (e) => {
		e.preventDefault();
		try {
			const Api = `${process.env.REACT_APP_SERVER}page/aarti`;
			await axios
				.post(Api, Page)
				.then((res) => {
					console.log(res);
					navigate(`/pages/edit/aarti/${res.data._id}/${lang}`);
				})
				.catch((error) => console.log(error));
		} catch (error) { }
	};

	const Submitdata = async (e) => {
		e.preventDefault();
		try {
			const Api = `${process.env.REACT_APP_SERVER}page/aarti`;
			await axios
				.post(Api, Page)
				.then((res) => {
					console.log(res);
					navigate(`/pages`);
				})
				.catch((error) => console.log(error));
		} catch (error) { }
	};

	return (
		<div>
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
								<span className="drop-lable">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
							</label>

							<div className="drop-col">
								<select
									className="drop"
									value={Page.Availablity?.[type] || "2"}
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

			<div className="Card">
				<h1>Front Page Details</h1>
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
			</div>
			<div className="Card">
				<h1>Inner Page Details</h1>
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
			</div>
			<div className="Card">
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
			</div>
			<div className="Card">
				{
					new TextEditor(
						Page.middleinfo,
						(e) => editorInputHandler("middleinfo", e),
						"Middle Info"
					)
				}
			</div>
			<div className="Card tablecard">
				<h1>Audio</h1>
				{
					new TextEditor(
						Page.audiodescription,
						(e) => editorInputHandler("audiodescription", e),
						""
					)
				}
				<FileInputComponent
					title="Upload File or add link"
					links={Page.audio}
					onDelete={(i) => handleFileDelete("audio", i)}
					onAdd={(file) => Page.audio.push(file)}
					type={"array"}
				/>
			</div>
			<div className="Card tablecard">
				<h1>Video</h1>
				{
					new TextEditor(
						Page.videodescription,
						(e) => editorInputHandler("videodescription", e),
						""
					)
				}
				<FileInputComponent
					title="Upload File or add link"
					links={Page.video}
					onDelete={(i) => handleFileDelete("video", i)}
					onAdd={(file) => Page.video.push(file)}
					type={"array"}
				/>
			</div>
			<div className="Card tablecard">
				<h1>Documents</h1>
				{
					new TextEditor(
						Page.documentsdescription,
						(e) => editorInputHandler("documentsdescription", e),
						""
					)
				}
				<FileInputComponent
					title="Upload File or add link"
					links={Page.documents}
					onDelete={(i) => handleFileDelete("documents", i)}
					onAdd={(file) => Page.documents.push(file)}
					type={"array"}
				/>
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

export default Aarticontent;
