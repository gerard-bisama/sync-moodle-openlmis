/**
 *  setup for test/development mode
 */
 var btoa = require('btoa');
 var fs = require("fs");
 //var fs_extra = require("fs-extra");
 var path = require("path");
 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var production = false;
var simulationMode=true;

/*
 * Setup for production mode
 */

const manifest = ReadJSONFile("manifest.webapp");
var buildWSMoodleURL = manifest.activities.moodleAPI.url+"/"+manifest.activities.moodleAPI.wsProtocolName+"/"+"server.php";
buildWSMoodleURL=buildWSMoodleURL+"?wstoken="+manifest.activities.moodleAPI.wsToken+"&moodlewsrestformat=json";
const wsMoodleURL=buildWSMoodleURL;
var builtRequestAccessTokenUrl=manifest.activities.openlmisAPI.url+"/"+"oauth/token?grant_type=password";
builtRequestAccessTokenUrl+="&password="+manifest.activities.openlmisAPI.credential.password;
builtRequestAccessTokenUrl+="&username="+manifest.activities.openlmisAPI.credential.username;
const openLMISTokenURL=builtRequestAccessTokenUrl;
var builtServiceLevelAccessTokenUrl=manifest.activities.openlmisAPI.url+"/"+"oauth/token?grant_type=client_credentials";
const openLMISServiceLevelURL=builtServiceLevelAccessTokenUrl;
const basicAuthAccessToken = `Basic ${btoa(manifest.activities.openlmisAPI.authentication.username+':'+manifest.activities.openlmisAPI.authentication.password)}`;
const basicAuthServiceLevelAccessToken = `Basic ${btoa(manifest.activities.openlmisAPI.serviceLevelAuthentication.username+':'+manifest.activities.openlmisAPI.serviceLevelAuthentication.password)}`;
const lmisRootUrl=manifest.activities.openlmisAPI.url;

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
			console.log(this.responseText);
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
			console.log(this.responseText);
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
