import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

let teamsInitPromise;
//to avoid SDK timeout issue
export function ensureTeamsSdkInitialized() {
    if (!teamsInitPromise) {
        teamsInitPromise = microsoftTeams.app.initialize();
    }
    return teamsInitPromise;
}
// async function returns true/false if we're running in M365
export async function inM365() {
  try {
      await ensureTeamsSdkInitialized();
      return true;     
  }
  catch (e) {
      console.log(`${e} from Teams SDK, may be running outside of M365`);
      return false; 
  }
}

const setTheme = (theme)=>{
  const el = document.documentElement;
  el.setAttribute('data-theme', theme); // switching CSS
};
const setHostAppTheme=(fileName)=> {
  let element = document.createElement("link");
  element.setAttribute("rel", "stylesheet");
  element.setAttribute("type", "text/css");
  element.setAttribute("href", fileName);
  document.getElementsByTagName("head")[0].appendChild(element);
}  

// Inline code to set theme on any page using teamsHelpers
(async () => {
  await ensureTeamsSdkInitialized();
  if(await inM365()) {
    const context= await microsoftTeams.app.getContext();  
    if(context) {
      setTheme(context.theme);     
      switch(context.app.host.name){
        case microsoftTeams.HostName.teams:{
          setHostAppTheme("../styles/northwind.css");           
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
        // When the theme changes
         microsoftTeams.app.registerOnThemeChangeHandler((theme) => {
          setTheme(theme);
        });
      }    
    }  
}
else{
  setHostAppTheme("../styles/northwind.css"); // browser app
}
})();





