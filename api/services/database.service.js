"use strict";
const { conn } = require("../db.js");
const { User } = require("../db");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "database",

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		conn.sync(/*{force:true}*/).then(() => {});
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		await User.create({
			email: "cce_user@gmail.com",
			password: "1234567",
			role: "CCE",
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
