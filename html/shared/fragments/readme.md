# Slide Fragments
Fragments are used as HTML templates which can be inserted into slides.

Fragments are loaded asynchronously into content, which means that updating a fragment in the shared resource will update the content everywhere this fragment is used.

If a fragment name begins with an underscore, e.g. _example, the fragment will be hidden in Activator UI. This can be used when developing fragments that aren't ready to be used.

Each fragment should begin with a container component, e.g. a group.

Fragments can be edited in Activator UI, but not created. In order to create a new fragment, it's possible to create a new folder with an empty index.html file and a thumb.png image in this folder (fragments). Once the updated shared resource is uploaded to Activator, it is now possible to open the empty index.html and add content as desired in the UI.