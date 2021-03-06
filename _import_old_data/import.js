import mysql from 'mysql';
import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import readDir from 'readdir';

const config = yaml.safeLoad(fs.readFileSync('./.config.yaml', 'utf8'));

const local_settings = config.local;
const local = mysql.createConnection(_.extend(local_settings, {multipleStatements: true}));

let files = [];

//fs.copyFile('./../docker/mysql/sql/z_99_demo_data.sql', './sql/z_99_demo_data.sql', (err) => {
//	if (err) throw err;
//	console.log('source.txt was copied to destination.txt');

	readDir.read('./sql/', ['z_**.sql', 'inno_**.sql', 'v_view_**.sql'], function(err, filesArray) {
		if (err) {
			reject({'action': 'dir', 'stack': err.stack});
		} else {
			_.each(filesArray, (file) => {
				files.push(file);
			});
			files.sort();
			console.log('added files to execute: ', files);

			promiseConnect().then(() => {
				files.reduce(function(p, item) {
					return p.then(function() {
						return promiseQuery(item).then((res) => {
							console.log(res.substring(0, 100));
						});
					});
				}, Promise.resolve()).then(function() {
					// all done here
					// update some stuff (eg maxVisitors for Event
					return updates();
				}).then(function() {
					local.end();
				}).catch(function(err) {
					// error here
					console.log(err.action);
					console.log(err.stack);
					local.end();
				});
			}).catch((err) => {
				console.log('connect');
				console.log(err);
			});

			/*
			Promise.all(promises).then((results => {
				console.log(results);
			})).catch((err) => {
				console.log(err);
			});
			*/
		}
	});

//});

function updates() {
	var promises = [];
	var events = {};
	return new Promise((resolve, reject) => {
		local.query("SELECT * FROM viewOrderTicket WHERE TicketType = 'ticket'", '*', function(err, resTicket) {
			if (err) {
				console.log(err);
			} else {
				_.each(resTicket, function(rowTicket) {
					if (!events[rowTicket.TicketEventID]) {
						events[rowTicket.TicketEventID] = 0;
					}
					events[rowTicket.TicketEventID] += rowTicket.TicketContingent;
				});
				_.each(events, function(event, index) {
					promises.push(new Promise((resolveArray, rejectArray) => {
						var sql = "UPDATE innoEvent SET EventMaximumVisitors = " + event + " WHERE EventID = '" + index + "'";
						console.log(sql);
						local.query(sql, function(err, res) {
							if (err) {
								console.log(err);
								rejectArray();
							} else {
								resolveArray();
							}
						});
					}));
					Promise.all(promises).then(function(res) {
						resolve();
					}).catch(function(err) {
						console.log(err);
						resolve();
					});
				});
			}
		});
	});
}

function promiseConnect() {
	return new Promise((resolve, reject) => {
		local.connect(function(err) {
			if (err) {
				reject({'action': 'connect', 'stack': err.stack});
			} else {
				console.log('connected');
				resolve('connected');
			}
		});

	});
}

function promiseQuery(file) {
	return new Promise((resolve, reject) => {
		let sql = fs.readFileSync('./sql/' + file, 'utf8');
		sql = sql.replace(/\t?\r?\n|\r/g, ' ');
		if (sql) {
			console.log('file: ' + file);
			local.query(sql, function(err, res) {
				if (err) {
					console.log(err);
					reject({'action': 'query', 'stack': err.stack});
				} else {
					resolve(sql);
				}
			});
		} else {
			resolve('');
		}
	});
}

