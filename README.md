## Survey App

Lots of kinks with this app, storing survey questions and results were much more difficult than anticipated.
Fortunately the basic functionality is there, the survey creation forms are all validated with yup and the visualizations work.

Users can define a survey with a set of multiple fields. Ideally text fields, multiple choice (with one or more selected),
Store user inputs into a database that the same user can then view the results. As you dynamicaly adjust the fields formik and yup will properly validate,
I'm particularly referring to changing the number of questions options and ensuring all of the proper state variables changed as the form options changed.

Viewing survey results are authenticated by users using jsonweb token. Surveys being created are saved into local storage until submitted or cancelled.

#### Tools
* React
* NodeJS
* Postgres
* Formik
* JSONWebToken
* Material-UI things like navbars etc but the rest will be core CSS3

#### Creating a survey
![Creating and taking a survey](/demo/create-survey.gif)

#### And then viewing the results...
![Taking and viewing the survey results](/demo/take-survey.gif)
