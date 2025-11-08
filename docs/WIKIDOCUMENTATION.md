Steps

1. Navigate to the Civic-dashboard-web project in github
2. Go to the branch dropdown on github, navigate to the 'View all branches'
3. In the view all branches click on 'New Branch' to create a new github branch
4. Enter your new branch name (i.e yourGithubUserName/DeputationsWiki), with the source being the 'main' branch
5. Click on the newly created branch under 'Your Branches'
6. Navigate to the contents/markdown folder
7. You can either click 'Add new file', and add a new file with the filename followed by .md file extension in the input where it says 'name a new file', please note the file conversion will not work with spaces so it will have to be a complete filename without spaces (i.e deputationsWiki.md) and not (deputations wiki.md).
	1.Note that once uploaded to the website, the link will be titled based on the first line of text in the markdown file. For example, if you want to display the page as "City of Toronto Government Guide"(https://civicdashboard.ca/wiki) on the website, the first line of your document should be "# City of Toronto Government Guide"(https://github.com/civic-dashboard/civic-dashboard-web/blob/main/contents/markdown/GovernmentGuide.md?plain=1) and nothing else.  
8. Once you are done, you can commit your changes to the branch by clicking on the  'Commit Changes...'  button, and click on commit directly to the branch.
	1. Once you have made a pull request, you can still go back and edit the content. If you wish to make more changes/commits to the file, you can create a new commit with the new file changes, and they will be available in the current pull request created. 
9. You will then be prompted to enter a Commit Message, and a extended description for extra details. 
10. Once you are ready, hit the commit changes button, and your markdown file will be committed to your branch on github. 
11. Then you may create a new pull request by clicking on the pull requests tab, and create a new pull request, by clicking on 'New Pull Request'
12. In the 'Compare Changes' view, you must then select the base of 'main' branch, and then the compare branch being the new branch you created i.e 'pliakhov/deputationswiki'.
13. Once both are selected, you can click the 'Create Pull Request', and your pull request will kick off the build process. 
14. In the upload preview deployment(Once it is finished), you may view the preview URL, with your markdown document uploaded under the 'Wiki' tab. 
15. In the build process once it's complete, under the 'All checks have passed', you can view the preview url under 'Preview Ready' with the url, with the URL available of the preview build, in which you can see a preview of the website with your markdown changes. 
	1. In order for the changes to be added to the project, a reviewer with write access will have to approve the changes, after approval you may merge the changes to the main branch, that will then update the current civic dashboard website. 
	2. If you wish to remove your pull request, at the bottom of the page, you can click on the 'close pull request' button, to remove your pull requests from the pull requests tab, you may however reopen your pull requests.

16. There you can click on the 'Wiki' tab with a link available to your document uploaded along with other wiki documents. 

