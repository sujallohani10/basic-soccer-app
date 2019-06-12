module.exports = {
	getTeamPage: (req, res) => {
		let query = "SELECT * FROM `teams` ORDER BY ID ASC";

		db.query(query, (error, result) => {
			if(error) {
				res.redirect('/team');
			}
			res.render('team/index.ejs',{
                title: "Welcome to Socka | View Teams"
                ,teams: result
            })
		});
	}
};