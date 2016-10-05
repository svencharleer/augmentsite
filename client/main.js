import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

Template.persons.onCreated(function() {
  this.subscribe("persons",function(){});
  Meteor.call("scrapeLirias", function(error, result){
    var publicationsByYear = {};
    var yearTest = []
    var years = [];
    Object.keys(result).forEach(function(l){
      result[l].forEach(function(p){
        if(publicationsByYear[l] == undefined)
          publicationsByYear[l] = [];
        publicationsByYear[l].push({year:l, text: p});
        if(yearTest.indexOf(l) < 0)
        {
          yearTest.push(l);
          years.push({year:l});
        }
      })

    })

    Session.set("publications", publicationsByYear);
    Session.set("years", years);

  })
});

Template.publications.helpers({
  publications(year) {
    var publications = Session.get("publications");
    return publications[year];
  },
  years()
  {
    var years = Session.get("years");
    if(years == undefined) return [];
    years.sort(function(a,b){
      if(a.year > b.year) return -1;
      if(a.year < b.year) return 1;
      return 0;
    });
    return years;
  }

})

Template.persons.helpers({
  persons(role) {
    console.log(Persons.find({role:role}).fetch());
    return Persons.find({role:role, disabled:{$ne:true}}, {sort:{sortforce:1,name:1}});
  },
});

Template.menu.events({
  'click #btnContact'(event, instance) {

    $('#persons').hide();
    $('#publications').hide();
    $('#contact').show();
    $('#btnPeople').removeClass("selected");
    $('#btnPublications').removeClass("selected");
    $('#btnContact').addClass("selected");
  },
  'click #btnPeople'(event, instance) {

    $('#persons').show();
    $('#publications').hide();
    $('#contact').hide();
    $('#btnPeople').addClass("selected");
    $('#btnPublications').removeClass("selected");
    $('#btnContact').removeClass("selected");
  },
  'click #btnPublications'(event, instance) {
    $('#persons').hide();
    $('#publications').show();
    $('#contact').hide();
    $('#btnPeople').removeClass("selected");
    $('#btnPublications').addClass("selected");
    $('#btnContact').removeClass("selected");
  },
});




Persons = new Meteor.Collection('persons');
