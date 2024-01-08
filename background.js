// List of mirrors for LibGen (taken from https://libgen.rs)
const mirrors = ['https://libgen.is','https://libgen.rs','https://libgen.st',]

let activeMirror = "";

chrome.contextMenus.onClicked.addListener(handleClick);

// Loop through the mirrors and find the first one that is online
async function checkMirrors() {
  for (const mirror of mirrors) {
    try {
      console.log("Checking mirror: " + mirror + "...")
      const response = await fetch(mirror)

      if (response.status === 200) {
        console.log("Mirror found: " + mirror)
        return mirror;
      }
    } catch (error) {
      console.error("Mirror not found: " + mirror)
    }
  }
  
  throw new Error('No LibGen mirrors are online. Create an issue at https://github.com/ky-ler/libgen_search_chrome_extension/issues/new');
}

async function handleClick(info) {
  switch (info.menuItemId) {
    case "selection":
      // Open a new tab with the search results
      chrome.tabs.create({ url: `${activeMirror}/search.php?req=${info.selectionText}&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def` });
      break;
    case "getMirror":
      // Check for an active mirror and update the activeMirror variable
      activeMirror = await checkMirrors();
      break;
    // TODO: Add settings page
    // case "settings":
      // console.log('LibGen Search Settings');
      // break;
    default:
      console.error("Unknown menu item: " + info.menuItemId);
      break;
  }
}

chrome.runtime.onInstalled.addListener(async function () {
  activeMirror = await checkMirrors();

  let parent = chrome.contextMenus.create({
    contexts: ["all"],
    title: 'LibGen Search',
    id: 'parent'
  });

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Search LibGen for "%s"',
    id: 'selection',
    parentId: parent,
  });

  chrome.contextMenus.create({
    contexts: ["all"],
    title: 'Get active LibGen mirror',
    id: 'getMirror',
    parentId: parent,
  });

  // TODO: Add settings page
  // chrome.contextMenus.create({
  //   contexts: ["all"],
  //   title: 'LibGen Search Settings',
  //   id: 'settings',
  //   parentId: parent,
  // });
});
