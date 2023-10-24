var express = require('express');
var router = express.Router();

var Post = require('../models/Post');
var Category = require('../models/Category');
var Image = require('../models/Image');
var Commons = require('../commons/Authentication');
var CommonsImage = require('../commons/Image');





// =================================== Admin site =====================================

/**
 * Create a new Post for Admin
 */
router.get('/create', Commons.isAuthenticated, async function(req, res, next){
	try {
		const categories = await Category.find({}).exec();
		const images = await Image.find({}).exec();

		let post = await Post.findOne({ active: false }).populate('image').exec();

		if(!post) {
			post = new Post();
		}

		await post.save();

		res.render('post_create', {
			title: 'Create new post',
			tab: 'blog',
			user: req.user,
			categories: categories,
			images: images,
			post: post
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
});

router.post('/save_ajax', Commons.isAuthenticated, async function(req, res, next){
	try {
		let post = await Post.findOne({ active: false }).exec();

		console.log('title: ', req.body.title);
		console.log('categories: ', req.body.categories);
		console.log('image_url: ', req.body.image_url);

		post.title = req.body.title;
		post.content = req.body.content;
		post.categories = req.body.categories;
		post.image_url = req.body.image_url;

		await post.save();
		
		res.status(200).send(post);
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
});

router.post('/upload_image', CommonsImage.upload_config, async function(req, res, next){
	try {
		const STATIC_URL = "/uploads/";

		let post = await Post.findOne({ active: false }).exec();
		// Check doesn't exist post active false
		if(!post){
			return res.redirect('/post/create');
		}

		let image = new Image({
			url: STATIC_URL + req.files[0].filename,
			path: req.files[0].path,
			post: post._id
		});
		await image.save();

		post.image = image._id;
		await post.save();

		res.redirect('/post/create');
	} catch (err) {
		console.log('[ERR]: ' + err);
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
});

router.post('/create', Commons.isAuthenticated, async function(req, res, next){
	try {
		let post = await Post.findOne({ active: false }).exec();

		post.active = true;
		post.dateOfCreate = Date.now();

		await post.save();
		
		res.redirect('/post/show/'+ post._id);
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
});

router.post('/delete/:id', Commons.isAuthenticated, async function(req, res, next){
	try {
		let post = await Post.findOne({ _id: req.params.id }).exec();

		// await post.remove();
		// res.redirect('/');

		res.send(post);
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
});

/**
 * Update a post
 */
 router.get('/update/:id', Commons.isAuthenticated, async function(req, res, next){
	try {
		var categories = await Category.find({}).exec();

		Post.findById(req.params.id).exec(function(err, post) {
			if(err) return res.send(err);

			if(!post) return res.send("404 not found for update");
			console.log("===============>>>>>>>>>>>>>>", post);
			res.render('post_update', { 
				title: 'Post',
				tab: 'blog',
				user: req.user,
				categories: categories,
				post: post

			});
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
	
});

router.post('/update', Commons.isAuthenticated, function(req, res, next){
	console.log("===============>>>>>>>>>>", req.body.id);
	console.log("===============>>>>>>>>>>", req.body.title);
	Post.findById(req.body.id).exec(function(err, post) {
		if(err) return res.send(err);
		if(!post) return res.send("404 not found post to update");
		post.title = req.body.title;
		post.image_url = req.body.image_url;
		post.content = req.body.content;
		post.categories = req.body.categories;
		post.dateOfUpdate = Date.now();

		post.save(function(err, newPost){
			if(err) res.send(err);

			res.redirect('/post/show/'+newPost._id);
		});
	});
});




// ========================================== Blog site ============================================

/**
 * Show a post
 */
router.get('/show/:id', async function(req, res, next){
	try {
		const categories = await Category.find({}).exec();
		console.log("categories", categories);

		const post = await Post.findById(req.params.id).populate("image").exec();

		if(!post) return res.send("404 not found");
		
		console.log('post: ', post)

		res.render('post', {
			title: 'Post',
			tab: 'blog',
			user: req.user,
			categories: categories,
			post: post
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
		next(err);
	}
});




module.exports = router;


