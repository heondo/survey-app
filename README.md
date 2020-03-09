## Survey App

#### About
Create surveys with multiple choice or free response texts, view the results as a graph or as a list. Used React-Vis for the visualizations and Formik/Yup to handle all of the form validation. Mainly a prototype to learn Formik/Yup and React-Vis.

#### Challenges
Learning how to use Formik/Yup for the first time was a little challenging, but dealing with validation when the user is constantly changing the number of questions, options, or name was difficult to deal with. 
In particular, as the user changes the number of options for a question I had the change the options array to match only if it was a valid number, and dealing with all of the potential inputs in things like that caused a lot of issues.
I had to stop validating onChange because the app was lagging terribly. I also used local storage for the first time to save a survey creation form because if that gets lost I probably stop using the website/application.

Lots of kinks with this app, storing survey questions and results were much more difficult than anticipated.
Fortunately the basic functionality is there, the survey creation forms are all validated with yup and the visualizations work.

#### Lessons Learned
* I will most likely continue to use a form framework
* Visualizing data in React-Vis is a little different than I am used to but overall it's just formatting data
* When dealing with survey data, you need a very complex back-end to properly deal with it and allow users to do things like edit a survey while it is active, how to handle answers from the past, and aggregating your survey results.
* Using jsonwebtoken to prevent other users from seeing data from a survey they did not create
* Adding custom methods to Yup to validate things like confirm password

#### Tools
* React
* NodeJS
* PostgreSQL
* Formik
* JSONWebToken
* Material-UI things like navbars etc but the rest will be core CSS3

#### Creating a survey
![Creating and taking a survey](/demo/create-survey.gif)

#### And then viewing the results...
![Taking and viewing the survey results](/demo/take-survey.gif)
