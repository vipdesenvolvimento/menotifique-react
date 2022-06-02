const PORT = 8000;
const express = require("express");
const path = require("path");
const oracledb = require("oracledb");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const authConfig = require("./src/config/auth.json");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB });
const mysql = require("mysql");

require("dotenv").config()

const options = {
	user: process.env.ORACLE_USER,
	password: process.env.ORACLE_PASSWORD,
	connectString: process.env.ORACLE_URL,
};

var db = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_DATABASE || "",
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/api.html"));
});

app.post("/api/getActivation", async (req, res) => {
	try {
		const { contract, tag } = req.body;

		// consulta para 1 contrato
		await axios({
			method: "get",
			url: `https://extranet.vipbrtelecom.com.br/apifacil/v2/erp/contrato_extra.php?contrato=${contract}`,
			headers: {
				Authorization: "Bearer "+process.env.TOKEN_NG,
			},
		})
			.then(function (response) {
				

				if(response.data.variables.status === 404) {
					return res.status(404).send({ message: "Contrato não encontrado."});
				}

				const { cep, localidade, logradouro, bairro } =
					response.data.variables.return.enderecoInstalacao;

				const query = "SELECT * FROM activation WHERE tag = ? AND date_init <= NOW() AND date_end >= NOW() AND is_active = 1";
				db.query(query, [tag], (err, result) => {
					if (result.length === 0) {
						return res
							.status(404)
							.send({ error: "Nenhuma ativação com essa tag" });
					}

					var dentroRegra = 0;

					result.forEach(index => {
						const {
							id,
							is_active,
							date_end,
							date_init,
							description,
							id_category,
						} = index;
						
						const queryCep = `SELECT count(id) as total FROM cep WHERE number = ? AND id_activation = ?`;
						db.query(queryCep, [cep, id], (err, result) => { 
							let data = JSON.parse(JSON.stringify(result));
							if(data > 0) {
								dentroRegra = 1;
							} 
						})

						const queryDistrict = "SELECT count(id) as total, exception FROM district WHERE name = ? AND city = ? AND id_activation = ?";
						db.query(queryDistrict, [bairro, localidade, id], (err, result) => { 
							console.log(result[0].total);
						})
					})

					// if (!result[0].is_active) {
					// 	return res
					// 		.status(404)
					// 		.send({ error: "Nenhuma tag ativa encontrada" });
					// }

					// const {
					// 	id,
					// 	is_active,
					// 	date_end,
					// 	date_init,
					// 	description,
					// 	id_category,
					// } = result[0];

					// const dateNow = new Date().getTime();
					// const dateEnd = new Date(date_end).getTime();

					// if (dateEnd >= dateNow && is_active === 1) {
					// 	let query = "";
					// 	query +=
					// 		"SELECT cep.number as cep, district.name as district, district.exception as district_exp, city.name as city ";
					// 	query +=
					// 		"FROM activation LEFT JOIN cep ON cep.id_activation = activation.id LEFT JOIN district ON ";
					// 	query +=
					// 		"district.id_activation = activation.id LEFT JOIN city ON city.id_activation = activation.id WHERE activation.id = ?";
					// 	db.query(query, [id], (err, result) => {
					// 		var cepVerify = 0;
					// 		var districtVerify = 0;
					// 		var cityVerify = 0;

					// 		result.forEach((option) => {
					// 			if (option.cep === cep) {
					// 				cepVerify++;
					// 			}

					// 			if (option.city === localidade) {
					// 				cityVerify++;
					// 			}

					// 			if (option.district === bairro) {
					// 				if (!option.district_exp) {
					// 					districtVerify++;
					// 				} else {
					// 					cityVerify--;
					// 				}
					// 			}
					// 		});

					// 		const sum = cepVerify + districtVerify + cityVerify;
					// 		if (sum >= 1) {
					// 			const response = async () => {
					// 				return axios.get(
					// 					`http://localhost:8000/api/message/tag/${tag}`
					// 				);
					// 			};

					// 			response()
					// 				.then((resp) => {
					// 					return res.status(200).send({
					// 						tag: tag,
					// 						description: description,
					// 						category: id_category,
					// 						date_init: date_init,
					// 						date_end: date_end,
					// 						messages: resp.data.result,
					// 					});
					// 				})
					// 				.catch((err) => {
					// 					console.log(err);
					// 					return res
					// 						.status(400)
					// 						.send({
					// 							message:
					// 								"Nenhuma menssagem encontrada para esse contrato.",
					// 						});
					// 				});
					// 		} else {
					// 			console.log(err);
					// 			return res
					// 				.status(400)
					// 				.send({
					// 					message:
					// 						"Nenhuma menssagem encontrada para esse contrato.",
					// 				});
					// 		}
					// 	});
					// } else {
					// 	return res.status(404).send({ message: "Nenhuma ativação encontrada"})
					// }
				});
			})
			.catch(function (error) {
				console.log(error);
			});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/users/findbyusername/:username", (req, res) => {
	try {
		const username = req.params.username;

		const query =
			"SELECT id, first_name, last_name, username, is_admin, passwd FROM users WHERE username= ? ";
		db.query(query, [username], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			if (result.length === 0)
				return res
					.status(400)
					.send({ message: "Usuario não encontrado" });

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.put("/api/users/:id/update", (req, res) => {
	try {
		const id = req.params.id;
		const user = req.body;

		const query =
			"SELECT first_name, last_name, passwd FROM users WHERE id = ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			if (result.length === 0)
				return res
					.status(400)
					.send({ error: "Usuario não encontrado" });
			if (user.password !== "" && user.password.length >= 8) {
				db.query(
					"UPDATE users SET first_name = ?, last_name = ?, passwd = ? WHERE id = ?",
					[user.first_name, user.last_name, user.password, id],
					(err, result) => {
						if (err)
							return res.status(400).json({
								error: "Ocorreu um problema no processo",
							});
					}
				);
			} else {
				db.query(
					"UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
					[user.first_name, user.last_name, id],
					(err, result) => {
						if (err)
							return res.status(400).json({
								error: "Ocorreu um problema no processo",
							});
					}
				);
			}

			return res
				.status(200)
				.send({ message: "Atualização realizada com sucesso" });
		});
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

app.get("/api/users/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query =
			"SELECT id, first_name, last_name, username, is_admin FROM users WHERE id= ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/users", (req, res) => {
	try {
		const query =
			"SELECT id, first_name, last_name, username, is_admin FROM users WHERE is_active <> 0 ";
		db.query(query, (err, result) => {
			console.log(err);
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/category/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT id, name, is_active  FROM category WHERE id= ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/category", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT id, name, is_active  FROM category";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.post("/api/category/create", (req, res) => {
	const { name } = req.body;

	try {
		db.query("START TRANSACTION");

		const query = "INSERT INTO category (name) VALUES ?";
		db.query(query, [name.map((item) => [item])], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel registar categoria" });
			return res
				.status(201)
				.json({ message: result.message.substring(1) });
		});
	} catch (err) {
		console.log(err);
		db.query("ROLLBACK TRANSACTION");
	}
});

app.put("/api/category/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT id, is_active FROM category WHERE id = ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			if (result.length === 0)
				return res
					.status(400)
					.send({ error: "Message não encontrada" });
			const action = !result[0].is_active;

			db.query(
				"UPDATE category SET is_active = ? WHERE id = ?",
				[action, id],
				(err, result) => {
					if (err)
						return res
							.status(400)
							.json({ error: "Ocorreu um problema no processo" });

					return res.status(200).send({
						id: id,
						status: action,
						message: "Atualização realizada com sucesso",
					});
				}
			);
		});
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

app.delete("/api/category/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT id, is_active FROM category WHERE id = ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			if (result.length === 0)
				return res
					.status(400)
					.send({ error: "Categoria não encontrada" });

			db.query(
				"DELETE FROM category WHERE id = ?",
				[id],
				(err, result) => {
					if (err)
						return res
							.status(400)
							.json({ error: "Ocorreu um problema no processo" });

					return res.status(200).send({
						id: id,
						message: "Categoria deletar com sucesso",
					});
				}
			);
		});
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

app.delete("/api/message/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT id, is_active FROM message WHERE id = ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			if (result.length === 0)
				return res
					.status(400)
					.send({ error: "Message não encontrada" });
					
			db.query(
				"DELETE FROM message WHERE id = ?",
				[id],
				(err, result) => {
					if (err)
						return res
							.status(400)
							.json({ error: "Ocorreu um problema no processo" });

					return res
						.status(200)
						.send({
							message: "Mensagem deletarda com sucesso",
						});
				}
			);
		});
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

app.put("/api/message/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT id, is_active FROM message WHERE id = ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			if (result.length === 0)
				return res
					.status(400)
					.send({ error: "Message não encontrada" });
			const action = !result[0].is_active;

			db.query(
				"UPDATE message SET is_active = ? WHERE id = ?",
				[action, id],
				(err, result) => {
					if (err)
						return res
							.status(400)
							.json({ error: "Ocorreu um problema no processo" });

					return res.status(200).send({
						id: id,
						status: action,
						message: "Atualização realizada com sucesso",
					});
				}
			);
		});
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

app.get("/api/message/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query =
			"SELECT id, name, texto, texto_fonetico, description, hangup, action, tag, is_active, id_audio, created_at  FROM message WHERE id= ? ";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			result.updated_at = undefined;
			result.created_at = undefined;

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/message/tag/:tag", (req, res) => {
	try {
		const tag = req.params.tag;

		const query =
			"SELECT id, tag, name, texto, texto_fonetico, description, hangup, id_audio, is_active FROM message WHERE tag = ? AND is_active = 1 ";
		db.query(query, [tag], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });

			result.updated_at = undefined;
			result.created_at = undefined;

			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/message", (req, res) => {
	try {
		const query = "SELECT * FROM message ";
		db.query(query, (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });
			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/activation/tag/:tag", (req, res) => {
	try {
		const tag = req.params.tag;

		const query = "SELECT * FROM activation WHERE tag = ?";
		db.query(query, [tag], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });
			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/activation/:id", (req, res) => {
	try {
		const id = req.params.id;

		const query = "SELECT * FROM activation WHERE id = ?";
		db.query(query, [id], (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });
			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.put("/api/activation/:id", (req, res) => {
	try {
		const id = req.params.id;
		db.query(
			"SELECT * FROM activation WHERE id = ?",
			[id],
			(err, result) => {
				if (err) throw err;
				if (result.length === 0)
					return res
						.status(400)
						.send({ error: "Ativação não encontrada" });
				const action = !result[0].is_active;

				db.query(
					"UPDATE activation SET is_active = ? WHERE id = ?",
					[action, id],
					(err, result) => {
						if (err)
							return res.status(400).json({
								error: "Não foi possivel carregar dados",
							});

						return res.status(200).send({ status: action });
					}
				);
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ error: err.message });
	}
});

app.put("/api/activation/close/:id", (req, res) => {
	try {
		const id = req.params.id;
		db.query(
			"SELECT * FROM activation WHERE id = ?",
			[id],
			(err, result) => {
				if (err) throw err;
				if (result.length === 0)
					return res
						.status(400)
						.send({ error: "Ativação não encontrada" });

				const action = 0;
				const date_end = new Date();

				db.query(
					"UPDATE activation SET is_active = ?, date_end = ? WHERE id = ?",
					[action, date_end, id],
					(err, result) => {
						if (err)
							return res.status(400).json({
								error: "Não foi possivel encerrar ativação",
							});

						return res.status(200).send({
							date_end: date_end,
							message: "Ativação encerrada com sucesso",
						});
					}
				);
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ error: err.message });
	}
});

app.get("/api/activation", (req, res) => {
	try {
		const query = "SELECT * FROM activation ";
		db.query(query, (err, result) => {
			if (err)
				return res
					.status(400)
					.json({ error: "Não foi possivel carregar dados" });
			return res.status(200).send({ result });
		});
	} catch (err) {
		console.log(err);
	}
});

app.post("/api/customer/create", (req, res) => {
	const { id_activation, name } = req.body;

	try {
		db.query("START TRANSACTION");

		const query =
			"INSERT INTO custom_options (id_activation, name) VALUES ?";
		db.query(
			query,
			[name.map((item) => [id_activation, item])],
			(err, result) => {
				if (err)
					return res.status(400).json({
						error: "Não foi possivel registro personalizado",
					});
				return res
					.status(201)
					.json({ message: result.message.substring(1) });
			}
		);
	} catch (err) {
		console.log(err);
		db.query("ROLLBACK TRANSACTION");
	}
});

app.post("/api/city/create", (req, res) => {
	const { id_activation, name } = req.body;

	try {
		db.query("START TRANSACTION");

		const query = "INSERT INTO city (id_activation, name) VALUES ?";
		db.query(
			query,
			[name.map((item) => [id_activation, item])],
			(err, result) => {
				if (err)
					return res
						.status(400)
						.json({ error: "Não foi possivel registar bairros" });
				return res
					.status(201)
					.json({ message: result.message.substring(1) });
			}
		);
	} catch (err) {
		console.log(err);
		db.query("ROLLBACK TRANSACTION");
	}
});

app.post("/api/district/create", (req, res) => {
	const { id_activation, exception, name, city } = req.body;
	try {
		db.query("START TRANSACTION");

		let item = [];
		if(name.length > 0) {
			for (let index = 0; index < name.length; index++) {
				item.push([id_activation, exception, name[index], city[index]]);
			}
		}

		const query =
			"INSERT INTO district (id_activation, exception, name, city) VALUES ?";
		db.query(
			query,
			[item],
			(err, result) => {
				if (err)
					return res
						.status(400)
						.json({ error: "Não foi possivel registar bairros" });
				return res
					.status(201)
					.json({ message: result.message.substring(1) });
			}
		);
	} catch (err) {
		db.query("ROLLBACK TRANSACTION");
	}
});

app.post("/api/cep/create", (req, res) => {
	const { id_activation, exception, number } = req.body;

	try {
		db.query("START TRANSACTION");

		const query =
			"INSERT INTO cep (id_activation, exception, number) VALUES ?";
		db.query(
			query,
			[number.map((item) => [id_activation, exception, item])],
			(err, result) => {
				if (err)
					return res
						.status(400)
						.json({ error: "Não foi possivel registar cep" });
				return res
					.status(201)
					.json({ message: result.message.substring(1) });
			}
		);
	} catch (err) {
		console.log(err);
		db.query("ROLLBACK TRANSACTION");
	}
});

app.post("/api/activation", async (req, res) => {
	const {
		tag,
		description,
		category,
		date_init,
		date_end,
		cep,
		district,
		city,
		custom,
	} = req.body;

	try {
		db.query("START TRANSACTION");

		const query =
			"INSERT INTO activation (tag, description, id_category, date_init, date_end) VALUES (?, ?, ?, ?, ?)";
		db.query(
			query,
			[tag, description, category, date_init, date_end],
			(err, result) => {
				if (err)
					return res
						.status(400)
						.json({ error: "Não foi possível registrar" });

				let idActivation = result.insertId;
				if (result.affectedRows) {
					if (cep.ceps.length > 0) {
						axios.post("http://localhost:8000/api/cep/create", {
							id_activation: idActivation,
							exception: false,
							number: cep.ceps,
						});
					}

					if (city.length > 0) {
						axios.post("http://localhost:8000/api/city/create", {
							id_activation: idActivation,
							name: city,
						});
					}

					if (district.districts.length > 0) {
						axios.post(
							"http://localhost:8000/api/district/create",
							{
								id_activation: idActivation,
								exception: district.exception,
								name: district.districts,
								city: district.districtsCity,
							}
						);
					}

					if (custom.length > 0) {
						axios.post(
							"http://localhost:8000/api/customer/create",
							{
								id_activation: idActivation,
								name: custom,
							}
						);
					}
				}

				return res.status(201).json({
					id: idActivation,
					message: "Registrar com sucesso",
				});
			}
		);
	} catch (err) {
		db.query("ROLLBACK");
		console.log(err);
	}
});

// servidor java
// app.post("/message/create", (req, res) => {
// 	const {
// 		name,
// 		description,
// 		texto,
// 		texto_fonetico,
// 		action,
// 		is_active,
// 		hangup,
// 		tag,
// 		id_audio,
// 	} = req.body;

// 	const options = {
// 		method: "POST",
// 		url: `http://localhost:8080/message`,
// 		headers: {
// 			apikey: "token",
// 			"Content-Type": "application/json",
// 		},
// 		data: {
// 			name,
// 			description,
// 			texto,
// 			texto_fonetico,
// 			action,
// 			is_active,
// 			hangup,
// 			tag,
// 			id_audio,
// 		},
// 	};

// 	try {
// 		axios
// 			.request(options)
// 			.then((response) => {
// 				res.status(201).json({
// 					message: "Mensagem registrada com sucesso!",
// 				});
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 				if (error.response?.status === 404) {
// 					res.status(409).json({
// 						message: "Não foi possivel registrar messagem",
// 					});
// 				}
// 			});
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

app.post("/message/create", (req, res) => {
	const {
		name,
		description,
		texto,
		texto_fonetico,
		action,
		hangup,
		tag,
		id_audio,
	} = req.body;

	try {
		db.query("START TRANSACTION");

		const query =
			"INSERT INTO message (name, texto, texto_fonetico, description, hangup, action, tag, id_audio, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		db.query(
			query,
			[
				name,
				texto,
				texto_fonetico,
				description,
				hangup,
				action,
				tag,
				id_audio,
				1,
			],
			(err, result) => {
				if (err)
					return res
						.status(400)
						.json({ error: "Não foi possível registrar" });

				if (result.affectedRows) {
					return res.status(201).json({
						message: "Mensagem registrada com sucesso!",
					});
				}
			}
		);
	} catch (err) {
		db.query("ROLLBACK");
		console.log(err);
		return res.status(400).send({ error: err.message });
	}
});

app.post("/login", (req, res) => {
	try {
		const { username, password } = req.body;

		axios
			.get(`http://localhost:8000/api/users/findbyusername/${username}`)
			.then((response) => {
				if (response.status === 400) {
					return res.status(401).send({
						status: 401,
						message: "Usuário não encontrado",
					});
				}

				const user = response.data.result[0];

				if (user.passwd !== password) {
					return res.status(401).send({
						status: 401,
						message: "Sem permissão",
					});
				}

				return res.status(200).send({
					id: user.id,
					auth: true,
					message: "Usuário encontrado",
				});
			})
			.catch((err) => {
				return res.status(401).send({
					status: 401,
					message: "Usuário não encontrado",
				});
			});
	} catch (err) {
		console.log(err);
	}
});

// login servidor java
// app.post("/login", (req, res) => {
// 	const { username, password } = req.body;

// 	const options = {
// 		method: "POST",
// 		url: `http://localhost:8080/auth`,
// 		headers: {
// 			apikey: "token",
// 			"Content-Type": "application/json",
// 		},
// 		data: {
// 			username: username,
// 			passwd: password,
// 		},
// 	};

// 	try {
// 		axios
// 			.request(options)
// 			.then((response) => {
// 				res.json(response.data);
// 			})
// 			.catch((error) => {
// 				if (error.response.status === 404) {
// 					res.json({
// 						auth: false,
// 						message: "Usuário não encontrado",
// 					});
// 				}
// 			});
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

app.get("/cep/:uid", (req, res) => {
	const cepNumber = req.params.uid;

	const provider = [
		`https://brasilapi.com.br/api/cep/v1/${cepNumber}`,
		`https://viacep.com.br/ws/${cepNumber}/json/`,
	];

	const options = {
		method: "GET",
		url: provider[0],
		headers: {
			"Content-Type": "application/json",
		},
	};

	axios
		.request(options)
		.then((response) => {
			if (response.data.erro) {
				res.json({ message: "CEP não encontrado", status: false });
			}

			res.json(response.data);
		})
		.catch((error) => {
			res.json({ message: error.message, status: false });
		});
});

app.get("/neighborhood/:city", (req, res) => {
	const nameCity = req.params.city;

	async function checkConnection() {
		let connection;
		let result;

		try {
			connection = await oracledb.getConnection(options);

			result = await connection.execute(
				`SELECT BAIRRO FROM VIP.VW_CONTRATOS WHERE CIDADE = :city GROUP BY BAIRRO`,
				[nameCity]
			);
		} catch (err) {
			return res.send(err.message);
		} finally {
			if (connection) {
				try {
					// Always close connections
					await connection.close();
					console.log("close connection success");
				} catch (err) {
					console.error(err.message);
				}
			}

			if (result.rows.length === 0) {
				return res.send("query send no rows");
			} else {
				return res.json({ status: 200, data: result.rows });
			}
		}
	}

	checkConnection();
});

app.get("/city", (req, res) => {
	async function checkConnection() {
		let connection;
		let result;

		try {
			connection = await oracledb.getConnection(options);

			result = await connection.execute(
				`SELECT CIDADE FROM VIP.VW_CONTRATOS GROUP BY CIDADE`
			);
		} catch (err) {
			return res.send(err.message);
		} finally {
			if (connection) {
				try {
					// Always close connections
					await connection.close();
					console.log("close connection success");
				} catch (err) {
					console.error(err.message);
				}
			}

			if (result.rows.length === 0) {
				return res.send("query send no rows");
			} else {
				return res.json({ status: 200, data: result.rows });
			}
		}
	}
	checkConnection();
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
