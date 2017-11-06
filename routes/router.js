const express = require('express');
const router = express.Router();

const sf = require('node-salesforce');
const conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env. 
  loginUrl : 'https://login.salesforce.com' 
});
conn.login(process.env.SF_USERNAME, process.env.SF_PWD, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information. 
  // Save them to establish connection next time. 
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property 
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ... 
});


router.get('/api', function(req, res){
	console.log('hi');
	var records = [];
	conn.query("SELECT Id, Name FROM Lead where Status LIKE '%Open%' ")
	  .on("record", function(record) {
	    records.push(record);
	  })
	  .on("end", function(query) {
	    console.log("total in database : " + query.totalSize);
	    console.log("total fetched : " + query.totalFetched);
	    res.send(records);
	  })
	  .on("error", function(err) {
	    console.error(err);
	  })
	  .run({ autoFetch : true, maxFetch : 4000 }); // synonym of Query#execute(); 
	
});

module.exports = router;