# Azure Work Management

Azure Work Management is a simple interface into Azure DevOps boards and work items. For the initial release there is a treeview that displays the boards you have access to. Expanding the boards will display the columns and then the work items under those columns.

You can perform minor changes on work items like changing which column the task should be in, and also reassigning the task to another user. You can also click an informational link that will open the task for full view in Azure DevOps interface.

![AWM Interface](https://i.postimg.cc/ncDHqpPb/screenshot-2.png)

### Update 1.0.10

_Support for sub-area paths_: Includes sub-area paths if the team has configured a path to include children.

### Update 1.0.9

_Support for onpremise installations_: There is now a setting available to change the base url of your Azure DevOps host.

_Add ID to work items In tree view_: The id of the task is now included in the tree view.

_Settings used in url should be URL Encoded_: The organization, project, and team settings are now url encoded.

### Update 1.0.4

You can now view back logs as well as boards! They will load below the Boards section and load all the work items in those back logs.

![Backlogs](https://i.postimg.cc/bw36v4jZ/screenshot-5.png)

# Usage

You will need a personal access token from Azure DevOps to use this extension. You can create a PAT in the Azure DevOps interface under the user settings menu. The PAT will need read, write, & manage access on work items.

![PAT Create](https://i.postimg.cc/qq94W5g5/screenshot-3.png)

Once you have a PAT and have installed the extension you will need to set the configuration settings for your DevOps instance. It needs to know your DevOps organization name, project, team, and iteration as well as the personal access token. You can set these by accessing the vscode settings and selectings settings for the Azure Work Management extension, or when the extension is first installed you should see buttons to access the settings in the left nav. The iteration is looking for an iteration path value so it is easiest to use the Set Iteration command. Once these settings are set you may need to click the refresh button which is in the left nav action menu at the top.

![Configuration](https://i.postimg.cc/Hk1T2RqJ/screenshot-5.png)

# Feedback

This is just the first vscode extension I've created and this is an MVP version of some ideas I'd like to continue to work on for managing Azure work items within vscode. If you have feedback, questions, etc you can contact me at <rick@melodicdevelopment.com>.

I'm also just getting started with some tech blogging and working towards spreading a little bit of my development experience out there in the world for others. If you're interested in that come give me a follow at...

<https://dev.to/melodicdevelopment>
