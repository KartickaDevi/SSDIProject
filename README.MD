## **SSDI PROJECT - FALL 2023**

User manual Dependencies:
Install Git (optional) - instructions at https://github.com/git-guides/install-git
Install Nodejs - instructions at https://nodejs.org/en/download/
Npm package manager (Documentation) - Instructions at https://docs.npmjs.com/downloading and-installing-node-js-and-npm
InstallMongoDB: https://www.mongodb.com/docs/manual/administration/install-community/
also make sure the port 27017 isn’t used by any application
Check if all dependencies are installed successfully on your system.
GitHub Link: https://github.com/KartickaDevi/SSDIProject.git
Steps to run on the local environment: 
1. Clone the GitHub repository
2. Open a command prompt and navigate to the cloned repository in visual studio
3. Run command npm install - This will automatically install all dependencies for this UI application 
including the logger utility.
npm install express morgan method-override mongoose express-session connect-mongo flash 
5. Open the `db` folder and check the user credential file for login credentials and a couple of json files 
for pre-populated data
6. create a tradedb Database in mongo DB and export users and trades collections from the json files.
7. Run “nodemon app.js” command and listen to http://localhost:5001 on your browser
