import { mdiLinkedin, mdiGithub ,mdiEmail} from '@mdi/js';

const data={
    "item":[
        {"label": "Home Page","link":"/"},
        {"label":"About", "link":"/"},
        {"label": "Projects","link":"/"},
        {"label":"Academic", "link":"/"},
        {"label":"Resume", "link":"/resume"},
    ],
    "external":[{
        "type":"mdi",
        "mdiName": mdiLinkedin,
        "link": "https://www.linkedin.com/in/xiao215/"
    },
    {
        "type":"mdi",
        "mdiName": mdiGithub,
        "link": "https://www.github.com/xiao215"
    },
    {
        "type":"mdi",
        "mdiName": mdiEmail,
        "link": "https://www.github.com/xiao215"
    }
    ]
};
export default data;
