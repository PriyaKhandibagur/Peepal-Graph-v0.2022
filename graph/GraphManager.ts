// Copyright (c) Microsoft.
// Licensed under the MIT license.

import { Client, ResponseType } from '@microsoft/microsoft-graph-client';
import { GraphAuthProvider } from './GraphAuthProvider';

// Set the authProvider to an instance
// of GraphAuthProvider
const clientOptions = {
  authProvider: new GraphAuthProvider()
};

// Initialize the client
const graphClient = Client.initWithMiddleware(clientOptions);
declare global {
  interface window { MyNamespace: any; }
}



export class GraphManager {


  static getmyPhoto = async(email) => {
   
    // GET /me
    return await graphClient
      .api('/users/'+email+'/photos/48x48/$value')
      .responseType(ResponseType.BLOB)
      .get();
      
  }

  static getmyPhotolist = async(email) => {
   
    // GET /me
    return await graphClient
      .api('/users/'+email+'/photos/64x64/$value')
      .responseType(ResponseType.BLOB)
      .get();
      
  }

  // window.MyNamespace = window.MyNamespace || {};




  static getProfilePhoto = async() => {
    // GET /me
    let blobUrl="";
    
    await graphClient.api('/me/photo/$value').responseType(ResponseType.BLOB)
  
     // .responseType('blob')
  
      .get(async (err:any, res:any) => {
  
        if (err) {
  
          console.log('jkf ',err)
  
        }
        console.log('hdgshfgj ',res)
       // await  new Blob([res], {type: 'image/jpeg'});
  
      //  blobUrl = window.URL.createObjectURL(res);
  
   
  
      });
  
      return blobUrl;  
  }


  static getUserAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me')
      .select('displayName,givenName,mail,mailboxSettings,userPrincipalName,aboutMe,jobTitle,department,mobilePhone,officeLocation,businessPhones,skills,interests,schools,pastProjects,birthday,mySite,hireDate')
      .get();
  }
  
  static getUserDetailsAsync = async(upn:string) => {
    // GET /me
    return await graphClient
      .api('/users/'+upn)
      .select('displayName,givenName,mail,userPrincipalName,mobilePhone,officeLocation,businessPhones,aboutMe,jobTitle,department,pastProjects,skills,manager,interests,schools,birthday,mySite,hireDate')
      .get();
  }
  static getUserssAsync = async() => {
    // GET /me
    return await graphClient
      .api('/users?$top=20')
      .select('displayName,givenName,mail,userPrincipalName,mobilePhone,jobTitle,department,personType')
      .get();
  }

  static getFlaggedEmails = async() => {
    // GET /me
    return await graphClient
      .api('/me/mailFolders/Inbox/messages')
      .get();
  }
  static UpdateFlaggedEmails = async(id:string) => {
    // GET /me
    return await graphClient
      .api('/me/mailFolders/Inbox/messages/'+id)
      .get();
  }
  static UpdateUserDetailsAsync = async(updateUser:any) => {
    // GET /me
    return await graphClient 
      .api('/me')
      .patch(updateUser);
  }
  static AddProjectDetailsAsync = async(updateUser:any) => {
    // GET /me
    return await graphClient
      .api('/me/profile/projects')
      .post(updateUser);
  }

  static getManagerAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/manager')
      .select('displayName,jobTitle,userPrincipalName,mobilePhone,officeLocation,department')
      .get();
  }
  static getUserManagerAsync = async(upn:string) => {
    // GET /me
    return await graphClient
      .api('/users/'+upn+'/manager')
      .select('displayName,jobTitle,userPrincipalName,mobilePhone,officeLocation,department')
      .get();
  }


  static getPeopleAsync = async() => {
    // GET /me
    return await graphClient
    //  .api('/me/people/?$search=p')
    .api('/me/people')
      .select('displayName,userPrincipalName,jobTitle,department')
      .get();
  }

  static getUserPeopleAsync = async(id:string) => {
    // GET /me
    return await graphClient
    //  .api('/me/people/?$search=p')
    .api('/users/'+id+'/people')
      .select('displayName,jobtitle,userPrincipalName,department')
      .get();
  }

  static getPeopleSearchAsync = async(startletter:string) => {
    // GET /me
    return await graphClient
    //  .api('/me/people/?$search=p')
    .api('/me/people/?$search='+startletter)
      .select('displayName,jobtitle')
      .get();
  }

  static getTrendingAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/insights/trending')
      .get();
  }

  static getSharedItemsAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/insights/shared')
      .get();
  }

  static getRecentFilesAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/drive/recent')
      .get();
  }
  static fileUplaod = async(stream:any,filepath:any) => {
    // GET /me
    return await graphClient
      .api('/me/drive/root:/'+filepath+':/content')
      .put(stream);
  }

  static fileUplaodTeams = async(stream:any,filepath:any) => {
    // GET /me
    return await graphClient
      .api('/groups/a5504e95-f175-4ff1-aebb-2ceb90a6fab2/drive/items/19:cd0dde5f81754d3f9a346062e9f668b3@thread.skype/'+filepath+'/content')
      .put(stream);
  }

  static UplaodDriveFilesAsync = async(stream:any) => {
    // GET /me
    return await graphClient
      .api('/me/drive/items/01FYPXDEPAMQFM2II6EBHLMQK7QWK3SEWI/flower4/content')
      .put(stream);
  }

  static getDriveThumbnailFilesAsync = async(id:string) => {
    // GET /me
    return await graphClient
      .api('/me/drive/items/'+id+'/children?$expand=thumbnails')
      .get();
  }
  static getBookmarkThumbnails = async(id:string) => {
    // GET /me
    return await graphClient
      .api('/me/drive/items/'+id+'/thumbnails')
      .get();
  }
  static getDriveItemIdThumbnails = async(driveid:string,itemid:string) => {
    // GET /me
    return await graphClient
      .api('/drives/'+driveid+'/items/'+itemid+'/children?$expand=thumbnails')
      .get();
  }
  static getSharedItemsThumbnails = async(id:string,remoteItemid:string) => {
    // GET /me
    return await graphClient
      .api('/drives/'+id+'/items/'+remoteItemid+'/thumbnails')
      .get();
  }
  static getDriveItemsAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/drive/root/children')
      .get();
  }

  static getDriveSharedItemsAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/drive/sharedWithMe?$format=image/jpeg')
     // .top(20)
      .get();
  }
  static getSharedThumbnails = async() => {
    // GET /me
    return await graphClient
      .api('/me/drive/sharedWithMe')
      .get();
  }

  static getRecentDriveItems = async() => {
    // GET /me
    return await graphClient
      .api('/me/drive/recent')
      .get();
  }

  static getfollowItemList = async() => {
    // GET /me/following
    return await graphClient.api('/me/drive/following')
      .get();
  }
  
  static followItem = async(itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/me/drive/items/'+itemid+'/follow')
      .post(driveItem)
  }

  static followItemteams = async(groupid:string,itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/groups/'+groupid+'/drive/items/'+itemid+'/follow')
      .post(driveItem)
  }

  static unfollowItem = async(itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/me/drive/items/'+itemid+'/unfollow')
      .post(driveItem)
  }

  static unfollowItemteams = async(groupid:string,itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/groups/'+groupid+'/drive/items/'+itemid+'/unfollow')
      .post(driveItem)
  }
  static getUserDriveSharedItemsAsync = async(id:string) => {
    // GET /me
    return await graphClient
      .api('/users/'+id+'/drive/sharedWithMe')
      .get();
  }
  static getViewedItemsAsync = async() => {
    // GET /me
    return await graphClient
      .api('/me/insights/used')
      .get();
  }
 
  static getPhotoAsync = async() => {
    // GET /me
    let   blobUrl="/_layouts/15/userphoto.aspx?size=L&username="+"43a8ef1e-ed83-4796-a9c2-f7ee71baf75c";
    const user = await graphClient

    .api("users/"+"43a8ef1e-ed83-4796-a9c2-f7ee71baf75c"+"/photo/$value")
    .get(async (err:any, res:any) => {
      if (err) {
        let url="/_layouts/15/userphoto.aspx?size=L&username="+"43a8ef1e-ed83-4796-a9c2-f7ee71baf75c";
        return  url;
      }
    //  const blob = await  new Blob([res], {type: 'image/jpeg'});
    //  blobUrl = window.URL.createObjectURL(res);

    });
    return blobUrl;

  }

 
  
  
  // <GetCalendarViewSnippet>
  static getCalendarView = async(start: string, end: string, timezone: string) => {
    // GET /me/calendarview
    return await graphClient.api('/me/calendarview')
      .header('Prefer', `outlook.timezone="${timezone}"`)
      .query({ startDateTime: start, endDateTime: end})
      // $select='subject,organizer,start,end'
      // Only return these fields in results
      .select('subject,organizer,start,end')
      // $orderby=createdDateTime DESC
      // Sort results by when they were created, newest first
      .orderby('start/dateTime')
      .top(50)
      .get();
  }
  // </GetCalendarViewSnippet>

  // <CreateEventSnippet>
  static createEvent = async(newEvent: any) => {
    // POST /me/events
    await graphClient.api('/me/events')
      .post(newEvent);
  }
  static sendmail = async(newEvent: any) => {
    // POST /me/events
    await graphClient.api('/me/sendMail')
      .post(newEvent);
  }
  // </CreateEventSnippet>

  //Groups
  static getGroupsAsync = async() => {
    // GET /me
    return await graphClient
    .api('/me/transitiveMemberOf/microsoft.graph.group?$count=true')
      .get();
  }
  static getUserGroupsAsync = async(id:String) => {
    // GET /me
    return await graphClient
    .api('/users/'+id+'/transitiveMemberOf/microsoft.graph.group?$count=true')
      .get();
  }

  static getGroupDetailsAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id)
      .get();
  }
  static getGroupMemberAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id+'/members?$count=true')
      .get();
  }
  static getGroupConversationAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id+'/conversations')
      .get();
  }

  static getGroupEventsAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id+'/events')
      .get();
  }

  static getGroupDriveItemsAsync = async(groupid:string) => {
    // GET /me
    return await graphClient
      .api('/groups/'+groupid+'/drive/root/children')
      .get();
  }

  static GroupfollowItem = async(groupid:string,itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/groups/'+groupid+'/drive/items/'+itemid+'/follow')
      .post(driveItem)
  }

  static GroupunfollowItem = async(groupid:string,itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/groups/'+groupid+'/drive/items/'+itemid+'/unfollow')
      .post(driveItem)
  }
  static driveunfollowItem = async(driveid:string,itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/drives/'+driveid+'/items/'+itemid+'/unfollow')
      .post(driveItem)
  }
  static drivefollowItem = async(driveid:string,itemid:string) => {
    const driveItem = {};
    // POST /me/events
    await graphClient.api('/drives/'+driveid+'/items/'+itemid+'/follow')
      .post(driveItem)
  }

  static getTeamsAsync = async() => {
    // GET /me
    return await graphClient
    .api('/me/joinedTeams')
      .get();
  }
  static getTeamMemberAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id+'/members')
    .select('displayName,jobTitle,userPrincipalName,mobilePhone,officeLocation,department')
      .get();
  }
  static getTeamOwnersAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id+'/owners')
    .select('displayName,jobTitle,userPrincipalName,mobilePhone,officeLocation,department')
      .get();
  }
  
  static getTeamChannelAsync = async(id:string) => {
    // GET /me
    return await graphClient
    .api('/teams/'+id+'/channels')
      .get();
  }
  static getTeamPostsAsync = async(id_g:string,id_ch:string) => {
    // GET /me
    return await graphClient
    .api('/teams/'+id_g+'/channels/'+id_ch+'/messages')
      .get();
  }
  static postTeamPostsAsync = async(posttext: any,id_g:string,id_ch:string) => {
    // GET /me
    await graphClient.api('/teams/'+id_g+'/channels/'+id_ch+'/messages')
      .post(posttext);
  }
  static getTeamFilesAsync = async(id_g:string,id_ch:string) => {
    // GET /me
    return await graphClient
    .api('/groups/'+id_g+'/drive/items/'+id_ch+'/children?$expand=thumbnails')
      .get();
  }

  static getTeamPostsAsync1 = async() => {
    // GET /me
    return await graphClient
    .api('/teams/a556a1db-39cc-430b-88cb-dbf41ad2b263/channels/19:ee8326b40280454d9936f248a5a883e2@thread.tacv2/messages')
      .get();
  }

   // <CreateChannelEventSnippet>
   static createChannel = async(newChannel: any,team_id:string) => {
    // POST /me/events
    await graphClient.api('/teams/'+team_id+'/channels')
      .post(newChannel);
  }
  // </CreateChannelEventSnippet>
  static getTaskList = async() => {
    // GET /me
    return await graphClient
      .api('/me/todo/lists')
      .get();
  }
  static createTaskList = async(newTaskList:any) => {
    // GET /me
    return await graphClient
      .api('/me/todo/lists')
      .post(newTaskList);
  }
  static createTask = async(newTaskList:any,id:string) => {
    // GET /me
    return await graphClient
      .api('/me/todo/lists/'+id+'/tasks')
      .post(newTaskList);
  }

  static getTasks = async(id:string) => {
    // GET /me
    return await graphClient
      .api('/me/todo/lists/'+id+'/tasks')
      .get();
  }
}
