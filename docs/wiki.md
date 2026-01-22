# Creating Markdown in Civic Dashboard Wiki

This guide walks you through the process of creating and publishing markdown files to the Civic Dashboard wiki.

## Step-by-Step Instructions

### 1. Navigate to the Project
Go to the `civic-dashboard-web` project on GitHub.

![Navigate to project](media/image2.png)

### 2. Access Branches
Click on the branch dropdown and select **View all branches**.

![View all branches](media/image14.png)

### 3. Create a New Branch
In the branches view, click **New Branch**.

![Create new branch](media/image5.png)

### 4. Name Your Branch
Enter your new branch name (e.g., `yourGithubUserName/DeputationsWiki`), with the source being the `main` branch.

![Name your branch](media/image20.png)

### 5. Switch to Your Branch
Click on the newly created branch under **Your Branches**.

![Switch to branch](media/image22.png)

### 6. Navigate to the Markdown Folder
Go to `contents/markdown` folder.

![Navigate to contents](media/image8.png)

![Markdown folder](media/image4.png)

### 7. Create Your Markdown File
Click **Add new file** and create a new file with a `.md` extension.

![Add new file](media/image12.png)

![Name the file](media/image6.png)

**Important naming conventions:**
- Use complete filenames without spaces (e.g., `deputationsWiki.md` not `deputations wiki.md`)
- The first line of your markdown file determines the page title on the website
- Example: If you want the page titled "City of Toronto Government Guide" on the website, start your file with:
  ```markdown
  # City of Toronto Government Guide
  ```

![First line example](media/image19.png)

### 8. Commit Your Changes
Once you're done editing, click **Commit Changes...** and commit directly to your branch.

![Commit changes](media/image23.png)

### 9. Add Commit Details
Enter a commit message and optional extended description for extra details.

### 10. Finalize the Commit
Click **Commit changes** to save your markdown file to your branch.

![Commit message](media/image3.png)

### 11. Create a Pull Request
Navigate to the **Pull requests** tab and click **New Pull Request**.

![New pull request](media/image18.png)

> **Note:** You can still edit the file after creating the pull request! Any new commits to your branch will automatically be included in the open pull request.

### 12. Configure the Pull Request
In the **Compare Changes** view:
- Set the base branch to `main`
- Set the compare branch to your newly created branch (e.g., `yourGithubUserName/DeputationsWiki`)

![Compare changes](media/image7.png)

![Base and compare branches](media/image24.png)

### 13. Fill Out PR Details
Complete the description according to the instructions in the template and add a relevant title.

![PR description](media/image17.png)

### 14. Submit the Pull Request
Click **Create Pull Request** to start the build process.

![Create pull request](media/image11.png)

### 15. Preview Your Changes
Once the build completes and all checks pass, you'll see a **Preview Ready** section with a preview URL where you can view your changes on a test version of the website.

![All checks passed](media/image25.png)

![Preview ready](media/image13.png)

![Preview URL](media/image15.png)

### 16. View Your Wiki Page
In the preview, click on the **Wiki** tab to see your newly uploaded document alongside other wiki documents.

![Wiki tab](media/image9.png)

### 17. Approval and Merge
A reviewer with write access must approve your changes. After approval, you can merge the changes to the main branch, which will update the live Civic Dashboard website.

![Approval and merge](media/image1.png)

### 18. Closing a Pull Request (Optional)
If you need to remove your pull request, scroll to the bottom of the PR page and click **Close pull request**.

![Close pull request](media/image10.png)

### 19. Reopening a Pull Request (Optional)
To reopen a closed pull request:
1. Go to the **Pull requests** tab
2. Click on **Closed** pull requests
3. Select your closed pull request
4. Click **Reopen pull request** at the bottom of the page

![Closed pull requests](media/image16.png)

![Reopen pull request](media/image21.png)

## Quick Tips

- Always ensure your markdown file has no spaces in the filename
- The first line (H1 heading) becomes the page title on the website
- You can continue editing after creating a pull request
- Check the preview build before requesting final approval
- Keep commit messages clear and descriptive

## Need Help?

If you encounter any issues or have questions, reach out to a team member with write access to the repository.
