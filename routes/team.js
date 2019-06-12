const fs = require('fs');
var lowerCase = require('lower-case');

module.exports = {
	addTeamPage: (req, res) => {
		res.render('team/add-team.ejs',{
			title : 'Welcome to Socka | Add a new team'
			,message : ''
		});
	},
	
	addTeam: (req, res) => {
		if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let team_name = req.body.team_name;
        let short_name = req.body.short_name;
        let country = req.body.country;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = lowerCase(short_name) + '.' + fileExtension;

        let teamnameQuery = "SELECT * FROM `teams` WHERE name = '" + team_name + "'";

        db.query(teamnameQuery, (err, result) => {
        	if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
            	message = 'Teamname already exists';
            	res.render('team/add-team.ejs', {
            		title: 'Welcome to Socka | Add a new team'
            		,message
            	});
            } else {
            	// check the filetype before uploading it
            	if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
					// upload the file to the /public/assets/img/teams directory
            		uploadedFile.mv(`public/assets/img/teams/${image_name}`, (err) => {
            			if (err) {
                            return res.status(500).send(err);
                        }

                        // send the teams's details to the database
                        let query = "INSERT INTO `teams` (name, short_name, image, country) VALUES ('" +
                            team_name + "', '" + short_name + "', '" + image_name + "', '" + country + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/team');
                        });

            		});
            	} else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('team/add-team.ejs', {
                        message,
                        title: "Welcome to Socka | Add a new team"
                    });
                }
            }
        });
	},

	editTeamPage: (req, res) => {
		let teamId = req.params.id;
        let query = "SELECT * FROM `teams` WHERE id = '" + teamId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('team/edit-team.ejs', {
                title: "Edit  Team"
                ,team: result[0]
                ,message: ''
            });
        });

	},

	editTeam: (req, res) => {
		let teamId = req.params.id;
        let team_name = req.body.team_name;
        let short_name = req.body.short_name;
        let country = req.body.country;

        let query = "UPDATE `teams` SET `name` = '" + team_name + "', `short_name` = '" + short_name + "', `country` = '" + country + "' WHERE `teams`.`id` = '" + teamId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/team');
        });
	},

	deleteTeam : (req, res) => {
		let teamId = req.params.id;
        let getImageQuery = 'SELECT image from `teams` WHERE id = "' + teamId + '"';
        let deleteTeamQuery = 'DELETE FROM teams WHERE id = "' + teamId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/teams/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteTeamQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/team');
                });
            });
        });
	}
}