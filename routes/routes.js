const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Route for rendering the form
router.get('/', (req, res) => {
  res.render('index.ejs');
});

// Route for processing the form submission
router.post('/submit', async (req, res) => {
    try {
        const { fullname, email, message } = req.body;
        const newMessages = await messageController.createMessage({ fullname, email, message, status: 'new' });
        res.redirect('/');
    } catch (error) {
        res.render('error.ejs', { error });
    }
});

// Middleware for retrieving a message by ID
router.param('messageId', async (req, res, next, messageId) => {
    try {
        const message = await messageController.getMessageById(messageId);
        if (!message) {
            return res.status(404).send('Message not found');
        }
        req.message = message;
        next();
    } catch (error) {
        next(error);
    }
});

// Route for updating a message
router.post('/update/:messageId', async (req, res) => {
    try {
        const { fullname, email, message, status } = req.body;
        const messageId = req.params.messageId;

        await messageController.updateMessage(messageId, { fullname, email, message, status });

        res.redirect('/mmm');
    } catch (error) {
        res.render('error.ejs', { error });
    }
});

// Route for deleting a message
router.post('/delete/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId;
        await messageController.deleteMessage(messageId);
        res.redirect('/mmm');
    } catch (error) {
        console.log(error);
        res.render('error.ejs', { error });
    }
});

// Route for rendering the message edit page
router.get('/messageEdit/:messageId', (req, res) => {
    res.render('messageEdit.ejs', { message: req.message, statuses: ['new', 'pending', 'contacted'] });
});

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.redirect('/mmm');  // redirect back to the admin panel in case of error
        }
        res.clearCookie('sid');  // 'sid' is the default name for session ID cookie. If you've changed it in session options, replace 'sid' accordingly.
        res.redirect('/signin');  // redirect to the sign-in page after logout
    });
});

router.post('/signin', (req, res) => {
    const { username, password } = req.body;

    const HARDCODED_USERNAME = 'okay'; 
    const HARDCODED_PASSWORD = 'pusspuss'; 

    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/mmm');
    } else {
        res.render('signin', { error: 'Invalid username or password.' });
    }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/signin');  // Redirect to sign in page if not authenticated
}

// Route for rendering the admin panel
router.get('/mmm', isAuthenticated, async (req, res) => {
    try {
        const messages = await messageController.getMessages({ status: 'new' });
        const noMessage = messages.length === 0;
        res.render('adminPanel.ejs', { messages, noMessage, selectedStatus: 'new' });
    } catch (error) {
        console.log(error);
        res.render('error.ejs', { error });
    }
});

router.get('*', (req, res) => {
    const error = { message: "Pages not Found!" }
    res.render('error', {error});
});

module.exports = router;