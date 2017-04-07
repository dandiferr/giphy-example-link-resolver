// This is the Demo API key from https://github.com/giphy/GiphyAPI and not meant to be used
// for production traffic.
// module.exports = 'dc6zaTOxFJmzC';

module.exports = function(title, company, location, summary, imageUrl) {

  html =  '<div>'+
            '<div style="float:left;margin-bottom:10px;margin-right:10px;">'+
              '<img style="max-width:100%;border:1px solid black;" src="' + imageUrl + '" width="100px"/>'+
            '</div>'+
            '<div style="float:left;">'+
              '<b>'+title+'</b><br>'+
              '<span>'+company+' - '+location+'</span>'+
            '</div>'+
            '<div style="clear:left">'+
              '<p>'+summary+'</p>'+
            '</div>'+
          '</div>'
  return html;
}
