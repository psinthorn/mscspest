const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

//public stories
router.get('/', (req,res) => {
    Story.find({status: 'public'})
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });

   
});

//show individual story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(story => {
        res.render('stories/show', {story: story});
    })
    
});

//stories add form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
}); 


//add story form post
router.post('/', (req, res) => {
    console.log(req.user.id);

    let allowComments;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    new Story(newStory)
    .save()
    .then(story => {
        res.redirect('/dashboard');
    });
});

//edit story form
router.get('/edit/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        res.render('stories/edit', {story: story});
    })
    
});

//edit stories process
router.put('/:id', ensureAuthenticated, (req, res) => {

    Story.findOne({
        _id: req.params.id
    }).then(story => {

        let allowComments;
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }

        //new value 

        story.title = req.body.title,
        story.status = req.body.status,
        story.allowComments = allowComments,
        story. body = req.body.body
        
        //update story
        story.save()
        .then(story => {
            res.redirect('/dashboard');
        });
        
    });
    
}); 


//delete story
router.delete('/:id', (req, res) => {

    Story.remove({ _id: req.params.id })
    .then(() => {
        res.redirect('/dashboard');
    });

});

module.exports = router;