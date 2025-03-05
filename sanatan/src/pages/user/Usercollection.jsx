import React, { Component, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import DataTable from "./components/Users.table";

function Usercollection({ id }) {
	var Api = `${process.env.REACT_APP_SERVER}users/find/collections/${id}`;
	const [data, Setdata] = useState([]);

	async function fetchdata() {
		try {
			const res = await axios.get(Api);

			Setdata(res.data);
		} catch (error) { }
	}

	useEffect(() => {
		fetchdata();
	}, []);

	const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

	const columns = [
		{
			header: "No.",
			cell: ({ row }) => row.index + 1,
		},
		{
			header: "Name",
			accessorKey: "itemName",
			cell: (props) => stripHtml(props.getValue() || ""),
		},
		{
			header: "Category",
			accessorKey: "category",
			cell: (props) => stripHtml(props.getValue() || ""),
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (props) => props.getValue(),
		},
	];


	return (
		<div>
			{" "}
			<div>{DataTable(data, columns, "Collections")}</div>
		</div>
	);
}

export default Usercollection;
