var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.post('/accesstoken', async function(req, res, next) {
    let body = {
        code:req.body.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: req.body.redirect_uri
      }
      console.log(body);
    axios.post(process.env.GITHUB_URL+'/access_token', body,{headers:{
        "Accept":"application/json"
    }}).then(response => {
        console.log(response.data);
        res.send(response.data)
    }).catch(err => res.send(err))
  ;
});

module.exports = router;
