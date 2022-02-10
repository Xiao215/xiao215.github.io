// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
var storageRef = storage.ref();
console.log(storageRef.child('resume/resume-xiao.pdf'));
  storageRef.child('image/corgi.png').getDownloadURL()
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
      console.log(url);
      const link = document.querySelector("link[rel~='icon']");
      link.href=url;
    })
    .catch((error) => {
      console.log("Any Error has occured for icon, please check code");
    });
storageRef.child('resume/Resume-Xiao.pdf').getDownloadURL()
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'
    // console.log(url);
    const myResume = document.getElementById("resume");
    myResume.src=url;
  })
  .catch((error) => {
    console.log("Any Error has occured for pdf, please check code");
  });
