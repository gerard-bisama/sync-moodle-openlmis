var User={
	"id": "",
	"username": "",
	"firstname": "",
	"lastname": "",
	"fullname": "",
	"email": "",
	"department": "",
	"firstaccess":"",
	"lastaccess":"",
	"auth": "",
	"suspended":"",
	"confirmed":"",
	"lang": "",
	"theme": "",
	"timezone": "",
	"mailformat":"",
	"customfields":[],
	"enrolledCourses":[] //Course, user could be enrolled to more than one course
};
var Course={
	"id":"",
	"categoryid":"",
	"shortname":"",
	"fullname":"",
	"enrolledusercount":"",
	"idnumber":"",
	"visible":"",
	"format":"",
	"showgrades":"",
	"lang":"",
	"enablecompletion":"",
	"category":"",//A course is just under 1 caterory:1 course 1 category
	"progress":"",
	"startdate":"",
	"enddate":""
};
var CourseCategory={
	"id":"",
	"name": "",
	"idnumber":"",
	"description": "",
	"descriptionformat":"",
	"parent":"",
	"sortorder":"",
	"coursecount":"",
	"visible": "",
	"visibleold": "",
	"timemodified": "",
	"depth": "",
	"path": "",
	"theme": ""
};
var Facility={
	"id":"",
	"name":"",
	"code":"",
	"operator_id":"",
	"operator_code":"",
	"operator_name":"",
	"active":"",
	"enabled":"",
	"type_code":"",
	"type_name":"",
	"geo_zone_id":"",
	"geo_zone_code":"",
	"geo_zone_name":"",
	"geo_zone_level_code":"",
	"geo_zone_level_levelNumber":"",
	"geo_zone_level_id":"",
	"users":[]
}
var LmisUser=
{
	"id":"",
	"username": "",
	"firstName": "",
	"lastName": "",
	"homeFacilityId":"",
	"roles":[]
}
var LmisRole=
{
	"id":"",
	"name": "",
	"description": "",
	"programId": "", //linked to the program information
	"programName":"",
	"wharehouseId": "",//for fulfillment based role. this is linked to the facility
	"wharehouseName": ""//for fulfillment based role. this is linked to the facility
	
	}
exports.User=User;
exports.Course=Course;
exports.CourseCategory=CourseCategory;
