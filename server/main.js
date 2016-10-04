import { Meteor } from 'meteor/meteor';
var cheerio = Meteor.npmRequire('cheerio');
var Persons = new Meteor.Collection('persons');

Meteor.publish('persons', function(who){

  console.log(Persons.find({}).fetch());
  return Persons.find({});
});

function getPublications(id, yearToPaper)
{
  result = Meteor.http.get("https://lirias.kuleuven.be/cv?u="+ id);
  $ = cheerio.load(result.content);

  $('.item').each(function(i){
    var itemText = "";
    var date = "";
    var title = "";
     $(this).children("font").each(function(j){
       itemText += $(this).text();
       if($(this).attr("name") == "date")
         date = $(this).text();
         if($(this).attr("name") == "title")
           title = $(this).text();
     })
     if(yearToPaper[date] == undefined)
       yearToPaper[date] = [];
     if(yearToPaper[date].indexOf(itemText) < 0)
      yearToPaper[date].push(itemText);

  })

}

Meteor.methods({
  scrapeLirias: function()
  {
        var yearToPaper = {};
        getPublications("U0040828", yearToPaper);
        getPublications("U0016838", yearToPaper);
         return yearToPaper;

  }
});


Meteor.startup(() => {

});
