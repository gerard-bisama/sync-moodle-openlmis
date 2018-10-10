# Moodle-OpenLMIS Sync app
Moodle is a free, online Learning Management system enabling educators to create their own private website filled with dynamic courses that extend learning, any time, anywhere.Whether you're a teacher, student or administrator, Moodle can meet your needs. Moodle’s extremely customisable core comes with many standard features.[About Moodle](https://docs.moodle.org/35/en/Features).

OpenLMISis a powerful, open source, cloud-based electronic logistics management information system (LMIS) purpose-built to manage health commodity supply chains.[About OpenLMIS](https://docs.moodle.org/35/en/Features). The current realease OpenLMIS Version 3 series is used for this app.

The app is used to create a sandbox for people to practice their skills in a local of OpenLMIS. The idea is, we want to have trainees spend some time in the application to hone their skills by linking out of a Moodle lesson right into the openLMIS, and to isolate each user (meaning trainee) into their own sessio with pre-populated data in order to follow the progression of the course in Moodle with exercises in OpenLMIS that they need to complete in order to get the “answer”. Moodle will provide the tutorial and openLMIS will be used for pratice.To provide an integrated experience for user.
To meet this requirement we have opted to assign each moodle user to a specific facility and program with specific roles bases on enrolled courses in openlmis when he can practice with less interaction from others.
This two plateform has interface that allow to access internal ressources and to share them with other systems. We have used this interoperability capabilities to implement our use cases. To use [Moodle API](https://docs.moodle.org/dev/Web_services_API) and for [openLMIS V3](http://docs.openlmis.org/en/latest/components/index.html)
## Uses cases
The base use case is to synchronized user between the two system, so that once a user is create in Moodle, he has also an account in openLMIS with appropriated role to practice in openLMIS.

### Use case 1 (Base use case): Synchronize Moodle user in OpenLMIS
The course is create and assigned to a category. A category determine the role to assign to the openLMIS user. A course have one category and a category can be assigned to more than one course.The user can be enrolled to the course manually or by selfenrollement. Only user enroll to the course and that is assigned to the course category can be synchronized in openLMIS. Based on the defined timer, the app check if there is moodle user to sync in openLMIS. if OK, the user is created,the role is assigned based on the course categories. Only roles related to the supervision and fullfilment are considered and they are all related to the home facility where user is assigned. To allow a user to have a optimal isolation for his own exercice for the training, the app sort facility by name and by number of user assigned and then assign the user to the facility. The good configuration is to have in openLMIS at least the  number of user >=number of facility. Once the user is created 2 emails is sent: the first for verification to allow user to receive notification and the second to send user credentials to log to openLMIS.

### Use case 2:Get Orders and requisitions
TBD

## Configurations
Some configurations must be done both in Moodle and openLMIS to ensure exchange of data between the two systems
###Moodle
Ref: [Managing Moodle Course](https://docs.moodle.org/35/en/Managing_a_Moodle_course), 
1. Identify in openLMIS role you user to be assigned to
2. Create course categories that have role name as Category ID number (Per example: Store Manager, Store room manager, Stock Viewer:...)
3. Create your courses and assign them categories. A course is assigned to only one category
4. Configure each course to allow self enrollment. This will allow user to enroll themselves to course as student. Their request will be in pending  until the the teacher/administrator confirm them.
5. Set up email out going notification to allow users to receive notification related to their enrolment, this is very usefull for self enrolment.
6. [Create and enable webservice plugin](https://docs.moodle.org/35/en/Using_web_services). Ensure to get token from an external service, enable REST protocol. Add an external service "webservice" with the following functions:core_course_get_categories, core_course_get_courses, core_enrol_get_users_courses, core_user_create_users, core_user_get_user_preferences, core_user_get_users, core_user_view_user_profile.

###OpenLMIS V3
Ask system Administrator to perform this tasks if it is not possible for you
1. configure openLMIS to enable email notification. In the settings.env file edit the following parameters
```sh
MAIL_HOST=server
# The SMTP port to use for sending outgoing e-mail by the notification service. 
MAIL_PORT=port
# The SMTP username to use for sending outgoing e-mail by the notification service.
MAIL_USERNAME=emailsender@domain.com
# The SMTP password to use for sending outgoing e-mail by the notification service. 
MAIL_PASSWORD=password
```
2. Ensure that administrator user is enabled and you have his authentication parameters. Or the system admin must create for you a users with the same privileges.
### The moodle-openlmis app
clone your app 
```sh
git clone https://github.com/gerard-bisama/sync-moodle-openlmis.git
```
Then configure parameters of the manisfest.webapp file based on the explanation below
```sh
...
 "moodleAPI": {
      "url": "http://IP:PORT/moodle/webservice", #Replace IP and port of moodle server
      "wsProtocolName":"rest",
      "wsToken":"xxxxxx" #websevice user token
    },
    "openlmisAPI": {
      "url": "http://IP:PORT/api", #IP and port of openLMIS Server
      "credential":{"username":"administrator","password":"password"},#user with administrator like privileges
      "authentication":{"username":"username","password":"password"}, #OAuth username and password
      "serviceLevelAuthentication":{"username":"username","password":"password"} #requisition userid and secret as defined in openlmis-requisition/src/main/resources/application.properties
    }
  },
  "usernameToExclude":[
	"guest","user1","user2" #Define user to exclude form the process:system administrator, default system users, and webservice user.
  ],
  "lmisUserCreationRolesAndProgramRules":[ #this need to be set to associate defined role to specific supervision program, if program_wharehouse not set this will be homefacility based fullfilment 
	{"role":"Stock Manager","program_wharehouse":"Family Planning"},
	{"role":"Store Manager","program_wharehouse":"Essential Meds"},
	{"role":"Storeroom Manager","program_wharehouse":"Essential Meds"},
	{"role":"Warehouse Clerk","program_wharehouse":""}
  ],
  "emailSettings": #smtp server settings, same if the one used in openLMIS settings.env files
	{
		"smtp_host":"xxxxx",
		"smtp_port":"xx",
		"smtp_secured":"No",
		"username":"xxxx@gxxx.com",
		"password":"xxxxx"
	},
  ....
  
```
##Installation of the Moodle-OpenLMIS Sync app.
if the configuration are done,
Install the dependencies, node packages
```sh
cd sync-moodle-openlmis
npm install
npm start
```
The service is exposed on the port 8084 (this could be changed)

### Configure timer to launch synchronization
Add this entries to you crontab to launch the synchronization of user between Moodle and openLMIS every 10 minutes.
```sh
*/10 * * * * curl  http://localhost:8084/launchsync > /dev/null &
```

Taratataaa
