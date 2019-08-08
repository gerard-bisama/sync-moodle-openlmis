/**
 *  setup for test/development mode
 */
 var btoa = require('btoa');
 var fs = require("fs");
 //var fs_extra = require("fs-extra");
 var path = require("path");
 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
 var crypto = require('crypto');
 var pgClient = require('pg-native');
 var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost:27017/moodlemediator');
 var Schema=mongoose.Schema;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var production = false;
var simulationMode=true;

/****************************Data definition structure************************************/
var LmisUser={
	"id":"",
	"username": "",
	"firstName": "",
	"lastName": "",
	"email": "",
	"homeFacilityId":"",
	"verified":"",
	"active":"",
	"roles":[]
}
var LmisRole={
	"id":"",
	"name": "",
	"description": "",
	"programId": "", //linked to the program information
	"programName":"",
	"wharehouseId": "",//for fulfillment based role. this is linked to the facility
	"wharehouseName": ""//for fulfillment based role. this is linked to the facility
	}
/***************************************************************/

/*
 * Setup for production mode
 */

const manifest = ReadJSONFile("manifest.webapp");
var buildWSMoodleURL = manifest.activities.moodleAPI.url+"/"+manifest.activities.moodleAPI.wsProtocolName+"/"+"server.php";
buildWSMoodleURL=buildWSMoodleURL+"?wstoken="+manifest.activities.moodleAPI.wsToken+"&moodlewsrestformat=json";
const wsMoodleURL=buildWSMoodleURL;
var builtRequestAccessTokenUrl=manifest.activities.openlmisAPIV3.url+"/"+"oauth/token?grant_type=password";
builtRequestAccessTokenUrl+="&password="+manifest.activities.openlmisAPIV3.credential.password;
builtRequestAccessTokenUrl+="&username="+manifest.activities.openlmisAPIV3.credential.username;
const openLMISTokenURL=builtRequestAccessTokenUrl;
var builtServiceLevelAccessTokenUrl=manifest.activities.openlmisAPIV3.url+"/"+"oauth/token?grant_type=client_credentials";
const openLMISServiceLevelURL=builtServiceLevelAccessTokenUrl;
const basicAuthAccessToken = `Basic ${btoa(manifest.activities.openlmisAPIV3.authentication.username+':'+manifest.activities.openlmisAPIV3.authentication.password)}`;
const basicAuthServiceLevelAccessToken = `Basic ${btoa(manifest.activities.openlmisAPIV3.serviceLevelAuthentication.username+':'+manifest.activities.openlmisAPIV3.serviceLevelAuthentication.password)}`;
const lmisRootUrl=manifest.activities.openlmisAPIV3.url;
const lmisV2RootUrl=manifest.activities.openlmisAPIV2.url+manifest.activities.openlmisAPIV2.apiPath;
const basicAuthAccessOpenLMISV2 = `Basic ${btoa(manifest.activities.openlmisAPIV2.credential.username+':'+manifest.activities.openlmisAPIV2.credential.password)}`;
const lmisV2DataRootUrl=manifest.activities.openlmisV2DataDBService.url;
const lmisV2DataToken=manifest.activities.openlmisV2DataDBService.requestToken;
const pgConnectionString=manifest.activities.openlmisV2DataDBService.pgConnectionString;
//console.log("server sparrow:", URLSPARROW, "headers:", headersSPARROW);
//console.log("server sms2:", URLRP, "headers:", headersRP);

/***********************************************************/

/**
 * Default options object to send along with each request
 */

function ReadJSONFile(fileName)
{
	var arrayPath=__dirname.split('/');
	var parentDirectory="/";
	for(var i=0;i<(arrayPath.length)-1;i++)
	{
		parentDirectory+=arrayPath[i]+"/";
	}
	//console.log("-------------");
	var filePath=path.resolve(path.join(parentDirectory, "/", fileName));
	//console.log(filePath);
	
	var contents = fs.readFileSync(filePath);
	console.log(filePath);
	var jsonContent = JSON.parse(contents);
	return jsonContent;
}
exports.getListMoodleUSers=function getListMoodleUSers(callback)
{
	var urlRequest=wsMoodleURL+"&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=%";
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
			}
			return callback(myArr);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			//console.log(this.responseText);
			return callback(null);
		}
	}
	request.send();
}
exports.getListMoodleUSersWithPropagatedCustomizedCourseWithCat=function getListMoodleUSersWithPropagatedCustomizedCourseWithCat(propagatedListOfCustomizedCoursesObjects,callback)
{
	var urlRequest=wsMoodleURL+"&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=%";
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
			}
			var modifierArray=[propagatedListOfCustomizedCoursesObjects,myArr];
			//return callback(myArr);
			return callback(modifierArray);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			var modifierArray=[propagatedListOfCustomizedCoursesObjects,null];
			return callback(modifierArray);
		}
	}
	request.send();
}
exports.getListEnrolledCourses=function getListEnrolledCourses(userid,callback)
{
	var urlRequest=wsMoodleURL+"&wsfunction=core_enrol_get_users_courses&userid="+userid;
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
			}
			return callback(myArr);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			//console.log(this.responseText);
			return callback(null);
		}
	}
	request.send();
}
exports.getListCourses=function getListCourses(callback)
{
	var urlRequest=wsMoodleURL+"&wsfunction=core_course_get_courses";
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
			}
			return callback(myArr);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
			//return callback(null);
		}
	}
	request.send();
}
exports.getCourseCategory=function getCourseCategory(categoryId,callback)
{
	var urlRequest=wsMoodleURL+"&wsfunction=core_course_get_categories&criteria[0][key]=id&criteria[0][value]="+categoryId;
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
			}
			return callback(myArr);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getAccessToken=function getAccessToken(callback)
{
	var urlRequest=openLMISTokenURL;
	//console.log(basicAuthAccessToken);
	var request = new XMLHttpRequest();
	request.open('POST',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Authorization',basicAuthAccessToken);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				if(oReturnedObject.access_token!=null)
				{
					var temp={access_token:oReturnedObject.access_token};
					response=temp;
					//return JSON.parse('{access_token:'+myArr.access_token+'}');
					//return temp;
					
				}
				
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getServiceLevelToken=function getServiceLevelToken(callback)
{
	var urlRequest=openLMISServiceLevelURL;
	//console.log(basicAuthServiceLevelAccessToken);
	var request = new XMLHttpRequest();
	request.open('POST',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Authorization',basicAuthServiceLevelAccessToken);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				if(oReturnedObject.access_token!=null)
				{
					var temp={access_token:oReturnedObject.access_token};
					response=temp;
					//return JSON.parse('{access_token:'+myArr.access_token+'}');
					//return temp;
					
				}
				
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getListFacility=function getListFacility(accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/facilities?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				var listFacilities=[];
				for(var indexFacility=0;indexFacility<oReturnedObject.length;indexFacility++)
				{
					if(oReturnedObject[indexFacility].active && oReturnedObject[indexFacility].enabled)
					{
						var oObject={id:oReturnedObject[indexFacility].id,name:oReturnedObject[indexFacility].name,
							code:oReturnedObject[indexFacility].code,operator_id:oReturnedObject[indexFacility].operator.id,
							operator_code:oReturnedObject[indexFacility].operator.code,operator_name:oReturnedObject[indexFacility].operator.name,
							type_code:oReturnedObject[indexFacility].type.code,type_name:oReturnedObject[indexFacility].type.name,
							geo_zone_id:oReturnedObject[indexFacility].geographicZone.id,geo_zone_code:oReturnedObject[indexFacility].geographicZone.code,
							geo_zone_name:oReturnedObject[indexFacility].geographicZone.name,geo_zone_level_code:oReturnedObject[indexFacility].geographicZone.level.code,
							geo_zone_level_levelNumber:oReturnedObject[indexFacility].geographicZone.level.levelNumber,
							geo_zone_level_id:oReturnedObject[indexFacility].geographicZone.level.id,users:[]
							};
							listFacilities.push(oObject);
					}
					else
					{
						continue;
					}
				}//end for indexFacility
				response=listFacilities;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getListFacilityV2=function getListFacilityV2(callback)
{
	var urlRequest=`${lmisV2RootUrl}/lookup/facilities?paging=false`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Authorization',basicAuthAccessOpenLMISV2);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				//console.log(this.responseText);
				var oReturnedObjectTemp = JSON.parse(this.responseText);
				var oReturnedObject= oReturnedObjectTemp.facilities;
				var listFacilities=[];
				//console.log(oReturnedObject.facilities.length);
				for(var indexFacility=0;indexFacility<oReturnedObject.length;indexFacility++)
				{
					var facilityTypeToReturn=[1,2,3,4,5];
					if(oReturnedObject[indexFacility].active && facilityTypeToReturn.includes(oReturnedObject[indexFacility].typeId))
					{
						var oObject={id:oReturnedObject[indexFacility].id,name:oReturnedObject[indexFacility].name,
							code:oReturnedObject[indexFacility].code,typeId:oReturnedObject[indexFacility].typeId,
							catchmentPopulation:oReturnedObject[indexFacility].catchmentPopulation,
							suppliesOthers:oReturnedObject[indexFacility].suppliesOthers,
							sdp:oReturnedObject[indexFacility].sdp,
							active:oReturnedObject[indexFacility].active,
							users:[]
							};
							listFacilities.push(oObject);
					}
					else
					{
						continue;
					}
				}//end for indexFacility
				response=listFacilities;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getListRoles=function getListRoles(accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/roles?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				var listRoles=[];
				for(var indexRole=0;indexRole<oReturnedObject.length;indexRole++)
				{
					var oObject={id:oReturnedObject[indexRole].id,name:oReturnedObject[indexRole].name,
						description:oReturnedObject[indexRole].description};
						listRoles.push(oObject);
					
				}//end for indexFacility
				response=listRoles;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getListRolesLMISV2=function getListRoles(callback)
{
	var client = new pgClient();
	client.connect(pgConnectionString,function(err) {
		if(err) throw err;
		//text queries
		var listUsers=[];
		var queryUserRoles='select id,name,description from roles order by name';
		client.query(queryUserRoles, function(err, rowsRoles) {
			if(err) throw err
			if(rowsRoles.length>0)
			{
				var listRoles=[];
				for(var indexRow=0;indexRow<rowsRoles.length;indexRow++)
				{
					listRoles.push(
					{
						id:rowsRoles[indexRow].id,
						name:rowsRoles[indexRow].name,
						description:rowsRoles[indexRow].description
					})
				}
				//callback(JSON.stringify(listRoles));
				callback(listRoles);
			}
			else
			{
				callback([])
			}
			})
	});
}
exports.getListPrograms=function getListPrograms(accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/programs?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				var listPrograms=[];
				for(var indexRole=0;indexRole<oReturnedObject.length;indexRole++)
				{
					if(oReturnedObject[indexRole].active)
					{
						var oObject={id:oReturnedObject[indexRole].id,code:oReturnedObject[indexRole].code,
						name:oReturnedObject[indexRole].name};
						listPrograms.push(oObject);
					}
					else
					{
						continue;
					}
					
					
				}//end for indexFacility
				response=listPrograms;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getListUsers=function getListUsers(accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/users?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				var listUsers=[];
				for(var indexUser=0;indexUser<oReturnedObject.content.length;indexUser++)
				{
					var homeFacilityId=oReturnedObject.content[indexUser].homeFacilityId==undefined?"":oReturnedObject.content[indexUser].homeFacilityId;
					var oObject={id:oReturnedObject.content[indexUser].id,username:oReturnedObject.content[indexUser].username,
						firstName:oReturnedObject.content[indexUser].firstName,lastName:oReturnedObject.content[indexUser].lastName,
						homeFacilityId:homeFacilityId,roles:[]};
						listUsers.push(oObject);
					
					
				}//end for indexFacility
				response=listUsers;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getListUsersOpenLMISV2=function getListUsersOpenLMISV2(callback)
{
	var client = new pgClient();
	client.connect(pgConnectionString,function(err) {
		if(err) throw err;
		//text queries
		var listUsers=[];
		var queryUserRoles='select us.id as userid,us.username,us.firstname,us.lastname,us.email,us.verified,us.active,us.facilityid, \
						ra.id,ra.roleid,ro.name as rolename,ro.description,pro.id as programid,pro.name as programname from role_assignments ra \
						join roles  ro on ra.roleid=ro.id \
						left outer join programs pro on pro.id=ra.programid \
						join users us on us.id = ra.userid ';
						
		client.query(queryUserRoles, function(err, rowsUsersRoles) {
			if(err) throw err
			if(rowsUsersRoles.length>0)
			{
				var listConvertedObject=[];
				listConvertedObject=convertToCustomizedLMISObject(rowsUsersRoles);
				callback(JSON.stringify(listConvertedObject));
			}
			else
			{
				callback([])
			}
			})
	});
}
///Convert the sqlrows result to customizedObject
function convertToCustomizedLMISObject(rowsUserRoles)
{
	var listConvertedLMISObject=[];
	var listUserIndex=[];
	for(var index=0;index<rowsUserRoles.length;index++)
	{
		
		if(listUserIndex.includes(rowsUserRoles[index].userid))
		{
			//if user exist already in the row, check if the role as been already assigned
			for(var indexlistOject=0;indexlistOject<listConvertedLMISObject.length;indexlistOject++)
			{
				
				if(listConvertedLMISObject[indexlistOject].id==rowsUserRoles[index].userid)
				{
					var assignedRole=listConvertedLMISObject[indexlistOject].roles;
					var roleExist=false;
					for(var indexRole=0;indexRole<assignedRole.length;indexRole++)
					{
						var rowProgramid=rowsUserRoles[index].programid==null?"":rowsUserRoles[index].programid;
						if(assignedRole[indexRole].id==rowsUserRoles[index].roleid && assignedRole[indexRole].programId==rowProgramid)
						{
							roleExist=true;
							break;
						}
						else
						{
							continue;
						}
					}
					if(!roleExist)
					{
						var oRole={};
						oRole=Object.create(LmisRole);
						oRole.id=rowsUserRoles[index].roleid;
						oRole.name=rowsUserRoles[index].rolename;
						oRole.description=rowsUserRoles[index].description;
						if(rowsUserRoles[index].programid!=null)
						{
							oRole.programId=rowsUserRoles[index].programid;
							oRole.programName=rowsUserRoles[index].programname;
						}
						listConvertedLMISObject[indexlistOject].roles.push(oRole);
					}
				}
				else
				{
					continue;
				}
			}
		}
		else
		{
			var oUser={};
			oUser=Object.create(LmisUser);
			oUser.id=rowsUserRoles[index].userid;
			oUser.username=rowsUserRoles[index].username;
			oUser.firstName=rowsUserRoles[index].firstname;
			oUser.lastName=rowsUserRoles[index].lastname;
			oUser.email=rowsUserRoles[index].email;
			oUser.homeFacilityId=rowsUserRoles[index].facilityid;
			oUser.verified=rowsUserRoles[index].verified;
			oUser.active=rowsUserRoles[index].active;
			oUser.roles=[];
			//if(rowsUserRoles[index].roleid!=)
			var oRole={};
			oRole=Object.create(LmisRole);
			oRole.id=rowsUserRoles[index].roleid;
			oRole.name=rowsUserRoles[index].rolename;
			oRole.description=rowsUserRoles[index].description;
			if(rowsUserRoles[index].programid!=null)
			{
				oRole.programId=rowsUserRoles[index].programid;
				oRole.programName=rowsUserRoles[index].programname;
			}
			else
			{
				oRole.programId="";
				oRole.programName="";
			}
			/*console.log("-------Created role-------------------------");
			console.log(oRole);*/
			oUser.roles.push(oRole);
			listConvertedLMISObject.push(oUser);
			listUserIndex.push(oUser.id);
		}
	}
	return listConvertedLMISObject;
}
function gethashstring(passwordString)
{
	var encodedHash=crypto.createHash('sha512').update(passwordString).digest('base64');
	var stringEncodedBytes=encodedHash.toString();
	var base64ToBase62String=base64ToBase62(stringEncodedBytes);
	return base64ToBase62String;
	
}
function base64ToBase62(base64)
	{
		var buff="";
		for(var i=0;i<base64.length;i++)
		{
			var ch=base64[i];
			switch(ch) {
			  case "i":
				buff+="ii"
				break;
			case "+":
				buff+="ip"
				break;
			case "/":
				buff+="is"
				break;
			case "=":
				buff+="ie"
				break;
			case "\n":
				// Strip out
				break;
			default:
			 buff+=ch
			}
		}
		return buff;
	}
	
exports.getAssignedRole=function getAssignedRole(userId,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/users/${userId}/roleAssignments?access_token=${accessToken}`;
	console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				var listRoles=[];
				for(var indexRole=0;indexRole<oReturnedObject.length;indexRole++)
				{
					var programId=oReturnedObject[indexRole].programId==undefined?"":oReturnedObject[indexRole].programId;	
					var warehouseId=oReturnedObject[indexRole].warehouseId==undefined?"":oReturnedObject[indexRole].warehouseId;
					var oObject={id:oReturnedObject[indexRole].role.id,name:oReturnedObject[indexRole].role.name,
						description:oReturnedObject[indexRole].role.description,programId:programId,warehouseId:warehouseId};
					listRoles.push(oObject);
					
					
				}//end for indexFacility
				response=listRoles;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.getAssignedRoleSync=function getAssignedRoleSync(userId,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/users/${userId}/roleAssignments?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, false);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				var oReturnedObject = JSON.parse(this.responseText);
				var listRoles=[];
				for(var indexRole=0;indexRole<oReturnedObject.length;indexRole++)
				{
					var programId=oReturnedObject[indexRole].programId==undefined?"":oReturnedObject[indexRole].programId;	
					var warehouseId=oReturnedObject[indexRole].warehouseId==undefined?"":oReturnedObject[indexRole].warehouseId;
					var oObject={id:oReturnedObject[indexRole].role.id,name:oReturnedObject[indexRole].role.name,
						description:oReturnedObject[indexRole].role.description,programId:programId,programName:"",warehouseId:warehouseId,
						warehouseName:""};
					listRoles.push(oObject);
					
					
				}//end for indexFacility
				response=listRoles;
				//console.log(response);
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.deleteUSer=function deleteUSer(userId,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/users/${userId}/?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('DELETE',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				response=this.responseText;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send();
}
exports.createLMISUser=function createLMISUser(userObject,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/users?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('PUT',urlRequest, false);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				response=JSON.parse(this.responseText);
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send(userObject);
}
exports.createLMISUserLMISV2=function createLMISUserLMISV2(userObject,callback)
{
	var encryptedPassword=gethashstring(userObject.password);
	var client = new pgClient();
	client.connect(pgConnectionString,function(err) {
		if(err) throw err;
		//text queries
		var listUsers=[];
		var queryUserRoles='insert into users (username,password,firstname,lastname,email,facilityid,verified,active) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id';
						
		client.query(queryUserRoles,[userObject.username,encryptedPassword,userObject.firstName,userObject.lastName,userObject.email,userObject.homeFacilityId,true,true], function(err, rowsUsers) {
			if(err) throw err
			//console.log(rowsUsers);
			if(rowsUsers[0].id!=null)
			{
			}
			
			
			})
	});
}
exports.createLMISUserLMISV2Sync=function createLMISUserLMISV2(userObject,callback)
{
	var encryptedPassword=gethashstring(userObject.password);
	var client = new pgClient();
	client.connectSync(pgConnectionString);
	const queryToInsertUsers='insert into users (username,password,firstname,lastname,email,facilityid,verified,active) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id';
	var values=[userObject.username,encryptedPassword,userObject.firstName,userObject.lastName,userObject.email,userObject.homeFacilityId,true,true];
	var rowsUsers = client.querySync(queryToInsertUsers,values);
	if(rowsUsers[0].id!=null)
	{
		for(var indexRole=0;indexRole<userObject.roleAssignments.length;indexRole++)
		{
			var queryInsertRole='insert into role_assignments (userid,roleid,programid) values ($1,$2,$3)';
			var valuesRole=[rowsUsers[0].id,userObject.roleAssignments[indexRole].roleId,userObject.roleAssignments[indexRole].programId];
			var resQuery=client.querySync(queryInsertRole,valuesRole);
		}
		return callback(true);
	}
	else
	{
		return callback(false);
	}
	//return
}
exports.updateUserContactDetails=function updateUserContactDetails(userContactObject,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/userContactDetails/${userContactObject.referenceDataUserId}?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('PUT',urlRequest, false);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				response=this.responseText;
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send(JSON.stringify(userContactObject));
}
exports.createUserAuth=function createUserAuth(userAuthObject,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/users/auth?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('POST',urlRequest, false);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				response=JSON.parse(this.responseText);
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send(JSON.stringify(userAuthObject));
}
exports.sendNotification=function sendNotification(nofificationObject,accessToken,callback)
{
	var urlRequest=`${lmisRootUrl}/notifications?access_token=${accessToken}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('POST',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response=null;
			if(this.responseText!="")
			{
				response=JSON.parse(this.responseText);
			}
			return callback(response);
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
		}
	}
	request.send(JSON.stringify(nofificationObject));
}
/***************************Sync log database definitions*************************************************/
var usersSyncLogSchema=Schema({
	userid:String, //by default 1
	periodDate:Date
});
var synchedUsersDefinition=mongoose.model('synchedUsers',usersSyncLogSchema);//keep logs of users pull from moodle and synched to LMIS
var getAllSynchedUsers=function (callback)
{
	var requestResult=synchedUsersDefinition.find({},{"_id":0,"periodDate":0}).exec(function(error,synchedUsersList){
		if(error){
			console.log(error);
			callback([]);
			}
		return callback(synchedUsersList);
		});
}
var upsertSynchedUsers=function(synchedDate,synchedUserId,callback)
{
	synchedUsersDefinition.findOne({
			userid:synchedUserId,
			}).exec(function(error,foundSynchedUser){
				if(error) {
					console.log(error);
					callback(false)
				}
				else
				{
					if(!foundSynchedUser)
					{
						
						var newUser= new synchedUsersDefinition({userid:synchedUserId,
							periodDate:synchedDate});
						
						var requestResult=newUser.save(function(err,result){
							if(err)
							{
								console.log(err);
								callback(false);
							}
							else
							{
								callback(true);
							}
						});
					}
					else
					{
						console.log("users already logged!");
					}
				}
			})//end of exec
}
var saveAllSynchedUsers=function (periodDate,synchedUsersList,callBackReturn)
{
	const async = require("async"); 
	var result=false;
	var _periodDate=new Date(periodDate);
	//console.log(`requestString => ${_minStartDate} : ${_maxStartDate}`);
	async.each(synchedUsersList,function(synchedUser,callback)
	{
		upsertSynchedUsers(_periodDate,synchedUser.id,function(response)
		{
			result=response;
			if(response)
			{
				console.log(synchedUser.id +"inserted with success.");
			}
			else
			{
				console.log(synchedUser.id +"failed to be inserted!");
			}
			callback(response);
		})
	},function(err)
	{
		if(err)
		{
			console.log(err);
			callBackReturn(false);
		}
		if(result)
		{
			callBackReturn(true);
		}
		else
		{
			callBackReturn(false);
		}
		
	});//end of asynch
}

exports.getUsernamesToExclude=function getUsernamesToExclude()
{
	return manifest.usernameToExclude;
}
exports.getlmisUserRolesAndProgramRules=function getlmisUserRolesAndProgramRules()
{
	return manifest.lmisUserCreationRolesAndProgramRules;
}
exports.getEmailSettings=function getEmailSettings()
{
	return manifest.emailSettings;
}
exports.getEmailStructure=function getEmailStructure()
{
	return manifest.emailStructure;
}
exports.getMaxUsersToSyncPerCall=function getMaxUsersToSyncPerCall()
{
	return manifest.maxUsersToSyncPerCall;
}
exports.getOpenLMISV2Url=function getOpenLMISV2Url()
{
	return manifest.activities.openlmisAPIV2.url;
}
exports.getAllSynchedUsers=getAllSynchedUsers;
exports.saveAllSynchedUsers=saveAllSynchedUsers;
