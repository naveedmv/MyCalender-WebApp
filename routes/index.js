/**
 * Created by Navii on 11/3/2015.
 */

var _ = require('underscore');
var express = require('express');
var router = express.Router();
var Event = require('../model/event');
var User = require('../model/user');

var AllEvents=[];

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport){

	router.get('/', function(req, res) {
		res.render('index',{});
	});

	router.post('/login', passport.authenticate('login', { // home view
		successRedirect: '/userFound',
		failureRedirect: '/userNotFound',
		failureFlash : true
	}));

	router.get('/userFound', function(req, res){
		res.json({"success":true, "url":'/home'});
	});

	router.get('/userNotFound', function(req, res){
		res.json({"success":false, "message": req.flash('message')});
	});

	router.get('/signup', function(req, res){
		//console.log("------")
		res.json({"url":'/register'});
	});

	router.get('/register', function(req, res){
		res.render('register',{});
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/userRegistered',
		failureRedirect: '/userNotRegistered',
		failureFlash : true
	}));

	router.get('/userRegistered', function(req, res){
		res.json({"success":true, "url":'/home'});
	});

	router.get('/userNotRegistered', function(req, res){
		res.json({"success":false, "message": req.flash('message')});
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/home', isAuthenticated, function(req, res){
		//console.log("------");
		//console.log("------"+req.user);
		res.render('home',{});
	});

	router.get('/search', isAuthenticated, function(req, res) {
		res.render('search',{});
	});

	router.get('/google', isAuthenticated, function(req, res) {
		res.render('google',{});
	});

	router.get('/calendarview', isAuthenticated, function(req, res) {
		res.render('calendarview',{});
	});

	router.get('/test', function(req, res) {
		res.render('test',{});
	});

//EVENT----------------------------------------------
	/*
	 * GET to eventlist.
	 */
	router.get('/eventlist', isAuthenticated, function(req, res){
		/*console.log("------");
		console.log("------"+req.user);*/
		Event.find({user: req.user}).sort({'from_date': 'asc'}).where('from_date').gte(new Date().toISOString()).exec(function(e,docs){
			//console.log(docs);
			AllEvents=docs;
			res.json({"user": req.user,"events" : docs});
		});
	});

	/*
	 * POST to addevent.
	 */
	router.post('/addevent', isAuthenticated, function(req, res) {

		var event2add = new Event();
		event2add.from_date = req.body.from_date;
		event2add.to_date = req.body.to_date;
		event2add.start_time = req.body.start_time;
		event2add.end_time = req.body.end_time;
		event2add.location = req.body.location;
		event2add.description = req.body.description;
		event2add.user = req.user;
		if(req.body.google_id) {event2add.google_id = req.body.google_id};

		//$.getJSON( '/eventlist', function( data ) {
		var savedEvents= AllEvents;
		//console.log("xxxxxxxxxxxxxx");
		//console.log(event2add);
		//console.log("yyyyyyyyyyyyyy");
		//console.log(savedEvents);
		//console.log(savedEvents.length);
		var flag=0;
		for (i = 0; i < savedEvents.length; i++){
			//console.log("zzzzzzzzzzz");
			//$.each(savedEvents, function(){
			//console.log("loop "+i);
			if(event2add.from_date==savedEvents[i].from_date && event2add.to_date==savedEvents[i].to_date && event2add.start_time==savedEvents[i].start_time
				&& event2add.end_time==savedEvents[i].end_time && event2add.location==savedEvents[i].location && event2add.description==savedEvents[i].description) {
				console.log('Event Exists!');
				flag=1;
			}
		}

		if(flag===0) { //event does not exist
			event2add.save(function(err) {
				if (err) {
					console.log('Error in Saving New Event: '+err);
					throw err;
				}
				console.log('Event Added!');
				console.log(event2add);
				res.json(event2add);
			});
		}
		else if (flag===1) {
			res.json({"exists":true});
		}
	});

	/*
	 * DELETE to deleteevent.
	 */
	router.delete('/deleteevent/:id', isAuthenticated, function(req, res) {
		Event.findByIdAndRemove(req.params.id,function(err) {
			if (err) throw err;

			//console.log('Event with ID:'+req.params.id+' is deleted!');
			//res.send('Event with ID:'+ req.params.id+ ' is deleted!');
			res.json('Event with ID:'+ req.params.id+ ' is deleted!');
		});
	});

	/*
	 * GET to editevent.
	 */
	router.get('/edit/:id', isAuthenticated, function(req, res){
		Event.findById(req.params.id).exec(function(e,event) {

			console.log('Event found and Send for update');
			console.log(event);
			res.json({"user": req.user,"event" : event,"eventID":req.params.id, "url":'/editevent/'});
		});
	});

	router.get('/editevent/:id', isAuthenticated,function(req, res){
		res.render('edit',{"eventID":req.params.id});
	});

	router.get('/editsearchedevent/:id', isAuthenticated,function(req, res){
		res.render('edit2',{"eventID":req.params.id});
	});

	/*
	 * PUT to updateevent.
	 */
	router.put('/updateevent/:id', isAuthenticated, function(req,res) {
		var options = {};
		if (req.body.from_date)  _.extend(options,{from_date : req.body.from_date});
		if (req.body.to_date)  _.extend(options,{to_date : req.body.to_date});
		if (req.body.start_time) _.extend(options,{start_time : req.body.start_time});
		if (req.body.end_time) _.extend(options,{end_time : req.body.end_time});
		if (req.body.location) _.extend(options,{location : req.body.location});
		if (req.body.description) _.extend(options,{description : req.body.description});
		if (req.body.google_id) _.extend(options,{google_id : req.body.google_id});
		Event.findByIdAndUpdate(req.params.id,options,function(err) {
			if (err) throw err;

			console.log('Event with ID:'+req.params.id+' is updated!');
			res.json('Event with ID:'+req.params.id+' is updated!');
		});
	});

	/*
	 * GET to searchevent.
	 */
	router.get('/searchevent', isAuthenticated, function(req, res){
		var options = {};
		options={user : req.user};
		if (req.query.location) _.extend(options,{location : {$regex:req.query.location, $options: 'i'}});
		if (req.query.description) _.extend(options,{description : {$regex:req.query.description, $options: 'i'}});
		//console.log(options);

		var Sresult = Event.find(options);
		//console.log(Sresult);
		if(req.query.start_date) Sresult.where('from_date').gte(req.query.start_date);
		if(req.query.end_date) Sresult.where('from_date').lte(req.query.end_date);
		if(req.query.start_time) Sresult.where('start_time').gte(req.query.start_time);
		if(req.query.end_time) Sresult.where('end_time').lte(req.query.end_time);
		Sresult.exec(function(e,docs){
			console.log(docs);
			res.json(docs);
		});
	});


//USER----------------------------------------------
	/*
	 * GET to userinfo.
	 */
	router.get('/userinfo', function(req, res) {
		User.find({username: req.user.username}).exec(function(e,docs){
			console.log(docs);
			res.json(docs);
		});
	});

	/*
	 * PUT to updateuser.
	 */
	router.put('/updateuser', function(req,res) {
		User.findByIdAndUpdate({username:req.user.username},{username:req.body.username, password:req.body.password},function(err) {
			if (err) throw err;

			console.log('User info is  Updated!');
			res.send('User info is  Updated!');
		});
	});

	/*
	 * POST to adduser.
	 */
	router.post('/adduser', function(req, res) {
		var user = new User() ;
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if (err) {
				console.log('Error in Saving New User: '+err);
				throw err;
			}
			console.log('User Added!');
			res.send(user);
		});
	});


  return router;
}