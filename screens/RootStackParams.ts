export type RootStackParamList = {
    Main: undefined;
    Auth: { upn: string };
    DriveItems: { upn: string,name:string };
    TeamsItems: {upn:string ,name:string,description:string};
    Search:undefined;
    SearchPhoto:undefined;
    SearchPeople:{list:[]};
    SearchPosts:{list:[]};
    SearchTeams:{list:[]};
    SearchEvents:{list:[]};
    SearchPeople2:{list:[]}
    SearchFirst:undefined;
    SignInScreen:undefined;
    SplashScreen:undefined;
    Home:undefined;
    HomeSearch:undefined;
    HomePreview:{username:string,modifieddate:string,image:any,title:string,id:string,imgweburl:string,profileimg:string,driveid:string,followstate:boolean};
    Drive:{ upn: string,name:string };
    SendMail:{ upn: string};
    driveitemid: { upn: string,name:string };
    drivepreview:{username:string,modifieddate:string,image:any,title:string,id:string,imgweburl:string,profileimg:string}
    PGTV:undefined;
    PGTVPreview:{url:string,name:string}
};