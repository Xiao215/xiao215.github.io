type ResumeNavItem = {
  name: string;
  link: string;
  navName: string;
};

type ResumeNav = {
  cv: ResumeNavItem;
  ml: ResumeNavItem;
  swe: ResumeNavItem;
};

const resumeNav: ResumeNav = {
  cv: {
    name: "CV",
    link: "https://drive.google.com/file/d/1cIhAMDdPmgg3mNbdxWe0P3RcVBqj2EYM/preview",
    navName: "cv",
  },
  ml: {
    name: "Machine Learning",
    link: "https://drive.google.com/file/d/1vRssDE3tgXt_OihRQvvUtGHQhjJYyY4y/preview",
    navName: "ml",
  },
  swe: {
    name: "Software",
    link: "https://drive.google.com/file/d/1v26oiDe7Ep91S8ABP46yonKoloZvmL59/preview",
    navName: "swe",
  },
};

export default resumeNav;
