https://github.com/tojocky/node-printer/issues/126

# Required packages
sudo apt install libcups2-dev

The server needs to have CUPS installed and have all the printers added to it.

# How to run the project?

1. Download from github.
1. Run `npm install` to install required modules.
1. Start your mongodb server. Needs to be running on local server.
1. Next we need to setup some configuration. Notice that there is a folder called `secret` with a `config.demo.js` file inside it. Open it and configure it and finally rename it as `config.js`. Never share the content of that file with anyone.
1. Run `npm run-script addAdmin` to add an admin to db.
1. Run `npm start` to start server.

# TODO

# Done
1. Stop duplicate consecutive printing.
1. Disable button on print.
1. Cannot print more than 10 pages at once.
1. View flash messages.
1. Run without internet
1. Add admin middleware to stop deleting jobs.
1. Encrypt passwords
1. Cannot print more than 50 pages in total.
1. Instruction on top of page.
1. Script to auto create secret folder with demo.
1. What if printer assigned to user is not working? (Nothing. Make sure all printers are working correctly)
