chrome.alarms.create("checkUpdates", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
    /* if (alarm.name === "checkUpdates") {
         console.log("Checking for updates...");
     }*/
    console.log("checking for updates")
});