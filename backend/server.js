import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
const app = express();

app.use(cors());

dotenv.config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let postsDB;
let profileDB;

async function start() {
	await client.connect();

	console.log("Connected to MongoDB");

	postsDB = client.db("Posts");
	profileDB = client.db("Profile");

	/*
	  GET ALL WRITEUPS
	*/
	app.get("/writeups", async (req, res) => {
		try {
			const writeups = await postsDB
				.collection("Write_ups")
				.find({})
				.toArray();

			res.json(writeups);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch writeups" });
		}
	});

	/*
	  GET SINGLE PROFILE
	*/
	app.get("/profile", async (req, res) => {
		try {
			const profile = await profileDB
				.collection("profile")
				.findOne({});

			res.json(profile);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch profile" });
		}
	});

	app.get("/skills", async (req, res) => {
		try {
			const profile = await profileDB
				.collection("skills")
				.findOne({});

			res.json(profile);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch skills" });
		}
	});

	app.get("/achievements", async (req, res) => {
		try {
			const profile = await profileDB
				.collection("achievements")
				.findOne({});

			res.json(profile);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch achievements" });
		}
	});

	app.get("/projects", async (req, res) => {
		try {
			const profile = await profileDB
				.collection("projects")
				.find({})
				.toArray();

			res.json(profile);
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to fetch projects" });
		}
	});


	app.listen(3000, () => {
		console.log("Server running on port 3000");
	});
}

start();
