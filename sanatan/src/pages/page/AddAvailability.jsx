import React, { useEffect, useState } from "react";
import LanguageDropDownComponent from "../../components/form-components/LanguageDropDown.component";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import notifyError from "../../components/toasts/Err.toast";
import { ToastContainer } from "react-toastify";
import notifySuccess from "../../components/toasts/Success.toast";

function AddAvailability() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [languages, setLanguages] = useState({});
	const [Langs, Setlangs] = useState([]);
	const [Page, setPage] = useState({
		Availability: {},
		defaultLanguage: "",
		pagestyle: "",
	});

	async function fetchdata() {
		try {
			setLoading(true);
			const [pageResponse, langResponse] = await Promise.all([
				axios.get(`${process.env.REACT_APP_SERVER}pages/get-availability/${id}`),
				axios.get(`${process.env.REACT_APP_SERVER}languages/`)
			]);

			const pageData = pageResponse.data.pageAvailability || {};

			setPage({
				Availability: pageData.Availability || {},
				defaultLanguage: pageData.defaultLanguage || "",
				pagestyle: pageData.pagestyle || "",  // ✅ Ensure pagestyle is set
			});

			setLanguages(pageData.Availability || {});
			Setlangs(langResponse.data || []);

			console.log("Fetched Page Data:", pageData);
		} catch (error) {
			console.error("Fetch error:", error);
			notifyError("Failed to load page data");
		} finally {
			setLoading(false);
		}
	}

	async function submitHandler() {
		try {
			const response = await axios.patch(
				`${process.env.REACT_APP_SERVER}pages/update-availability/${id}`,
				{ ...Page, Availability: languages }
			);

			if (response.data._id) {
				notifySuccess("Availability updated successfully");
			}
		} catch (e) {
			notifyError("Error saving changes");
		}
	}

	async function pageRedirector(language, style) {
		try {
			if (!Page.pagestyle) {
				notifyError("Page style is missing!");
				return;
			}

			const updatedPage = {
				...Page,
				Availability: languages,
				pagestyle: style || Page.pagestyle  // ✅ Ensure pagestyle is not undefined
			};

			await axios.patch(
				`${process.env.REACT_APP_SERVER}pages/update-availability/${id}`,
				updatedPage
			);

			const res = await axios.get(
				`${process.env.REACT_APP_SERVER}page/${updatedPage.pagestyle}/${id}/${language}`
			);

			navigate(res.data._id
				? `/pages/edit/${updatedPage.pagestyle}/${res.data._id}/${language}`
				: `/pages/add/${updatedPage.pagestyle}/${id}/${language}`
			);
		} catch (error) {
			console.error("Redirect error:", error);
			notifyError("Failed to redirect");
		}
	}

	useEffect(() => {
		if (id) fetchdata();
	}, [id]);

	useEffect(() => {
		setPage(prev => ({ ...prev, Availability: languages }));
	}, [languages]);

	return (
		<div>
			<h1>Language Availability</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<LanguageDropDownComponent
						items={Langs}
						setLanguages={setLanguages}
						languages={languages}
						pageRedirector={(language) =>
							pageRedirector(language, Page.pagestyle)
						}
						setdefaultLanguage={(value) =>
							setPage(prev => ({ ...prev, defaultLanguage: value }))
						}
						defaultLanguage={Page.defaultLanguage}
					/>

					<ToastContainer />
					<div className="center mb-10">
						<button className="addButton" onClick={submitHandler}>
							Save
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export default AddAvailability;
