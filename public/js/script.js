document.addEventListener('DOMContentLoaded', () => {

});

document.getElementById('profilePicUpload').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    const storageRef = ref(storage, 'profile_pictures/' + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a file!', snapshot);

        // Optionally, get the file URL and update the Firestore database with the file URL
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            updateUserProfile(downloadURL);
        });
    });
}

function updateUserProfile(profilePicURL) {
    // Assuming you're storing user profiles in Firestore
    const userProfileRef = collection(db, "users");
    addDoc(userProfileRef, {
        profilePic: profilePicURL,
        // other user data like name, etc.
    }).then((docRef) => {
        console.log("Profile updated with picture:", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}
