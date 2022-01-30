
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
var storageRef = storage.ref();
// console.log(storageRef.child('transcript/Academic-History.pdf'));
  storageRef.child('image/corgi.png').getDownloadURL()
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
      //console.log(url);
      const link = document.querySelector("link[rel~='icon']");
      link.href=url;
    })
    .catch((error) => {
      console.log("Any Error has occured for icon, please check code");
    });
//added web icon
//
