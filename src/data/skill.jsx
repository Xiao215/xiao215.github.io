import { 
    mdiLanguageCpp,
     mdiReact,
     mdiLanguageJavascript,
     mdiLanguageTypescript,
     mdiLanguageJava, 
     mdiElectronFramework, 
     mdiFirebase, 
     mdiLanguagePythont,
    mdiTailwind} from '@mdi/js';

const skills=
{
    language:[
    {
        name: "C++",
        logo: mdiLanguageCpp,
    },
    {
        name: "Java",
        logo: mdiLanguageJava,
    },
    {
        name: "JavaScript",
        logo: mdiLanguageJavascript,
    },
    {
        name: "TypeScript",
        logo: mdiLanguageTypescript,
    },{
        name: "Python",
        logo: mdiLanguagePythont,
    },
],
    tool:[
    {
        name: "Electron",
        logo: mdiElectronFramework,
    },
    {
        name: "React",
        logo: mdiReact,
    },
    {
        name: "Tailwind",
        logo: mdiTailwind,
    },
    {
        name: "Firebase",
        logo: mdiFirebase,
    },
    {
        name: "Heroku"
    }
]};
export default skills;