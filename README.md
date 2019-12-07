## Survey App

Lots of kinks with this app, storing survey questions and results were much more difficult than anticipated.
Fortunately the basic functionality is there, the survey creation forms are all validated with yup and the visualizations work.

Users can define a survey with a set of multiple fields. Ideally text fields, multiple choice (with one or more selected),
Store user inputs into a database that the same user can then view the results.

Viewing survey results are authenticated by users using jsonweb token. Surveys being created are saved into local storage until submitted or cancelled.

#### Tools
* React
* NodeJS
* Postgres
* Formik
* JSONWebToken
* Material-UI things like navbars etc but the rest will be core CSS3

![Creating and taking a survey](/demo/create-take-survey.gif)
