var createHTML = require('../utils/createHTML');
var request = require('request');
var _ = require('underscore');
const cheerio = require('cheerio')


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();

  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var id = getParameterByName('jk', url);

  if(!id) {
    res.status(400).send(id);
    return;
  }

  // URL request to Indeed job posting
  var response = request({
    url: 'https://www.indeed.com/viewjob?jk=' + encodeURIComponent(id),
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    // Use cheerio to parse HTML
    html = response.body;
    const $ = cheerio.load(html);

    // Get scraped information about job position
    title = $('#job-content td > div > .jobtitle').text();
    company = $('#job-content td > div > .company').text();
    location = $('#job-content td > div > .location').text();
    summary = $('#job-content .summary').text().substring(0,500)+"...";
    // Get company logo
    var imageResponse = request( {
      url: 'https://autocomplete.clearbit.com/v1/companies/suggest?query=' + company,
      json: true,
      timeout: 15 * 1000
    }, function(err, response, body) {
      if (err) {
        res.status(500).send('Error');
        return;
      }
      if(body) {
        imageUrl = body[0].logo;
      }
      res.json({
        // Build HTML with job position information
        body: createHTML(title, company, location, summary, imageUrl)
      });
    })
  });
};