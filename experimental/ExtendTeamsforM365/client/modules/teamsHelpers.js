import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
// async function returns true if we're running in Teams, Outlook, Office
export async function inM365() {  

  try {
    //initialize SDK
    await microsoftTeams.app.initialize();
    const context = await microsoftTeams.app.getContext();
    //check against the enum for hostnames
    return Object.values(microsoftTeams.HostName)
      .includes(context.app.host.name);
  } catch (e) {
    console.log('Error occurred: Not in M365', e);  
    return false;
  }
 
}

const displayTheme=async()=>{
  if(await inM365()) {
      const context= await microsoftTeams.app.getContext();  
      if(context) {
        setTheme(context.theme);     
        switch(context.app.host.name){
          case microsoftTeams.HostName.teams:{
            setHostAppTheme("../styles/northwind-teams.css");
            // When the theme changes, update the CSS again: Only for teams
            microsoftTeams.app.registerOnThemeChangeHandler((theme) => {
            setTheme(theme);
          });
          };        
          break;
          case microsoftTeams.HostName.outlook:{
            setHostAppTheme("../styles/northwind-outlook.css");
          };
            break;
          case microsoftTeams.HostName.office:{
            setHostAppTheme("../styles/northwind-office.css");
          }
          break;
          default:{ //any other hub for future
            setHostAppTheme("../styles/northwind.css");
          }
        }    
      }  
  }
  else{
    setHostAppTheme("../styles/northwind.css"); // browser app
  }
  function setHostAppTheme(fileName) {
    let element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", fileName);
    document.getElementsByTagName("head")[0].appendChild(element);
  }  

}

const setTheme = (theme)=>{
  const el = document.documentElement;
  el.setAttribute('data-theme', theme); // switching CSS
};

displayTheme();



