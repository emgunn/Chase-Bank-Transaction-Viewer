Chase Bank Transaction Viewer
=============================
- A web app where you can view, sort, filter, and rearrange data regarding financial transactions
- Load .csv file(s) that you can download from your bank containing information on transactions
- Only supports Chase Bank's .csv files
- Made using React, Material-UI, and dataframe-js
- You can visit the webpage at https://emgunn.github.io/Chase-Bank-Transaction-Viewer/

How to run:
-----------
- Run 'npm install'
- Run 'npm start'

How to use:
-----------
### Uploading and saving .csv files:
- Use the blue "Upload" button to select a .csv file locally to use
- These .csv files should be downloaded from your Chase Bank account online
  - Usually a download button can be found when opening any of your bank statements
  - The app will not work with any other banks unless they are in the same exact format as those from Chase
- You can upload as many .csv files as you want; they will all be appended together
- You can save your current list of transactions into a .csv file to your local machine by typing in a file name into the bottom text box and then pressing the "Export" button

### Format for .csv files:
- A sample .csv file called "sample.csv" can be found in the directory for reference

### Using the cache:
- There is a single cache provided that lets you store a single list (will disappear if the page is reloaded or left)
- Click the "Load Cache" button to display the cached list

### Sorting your data:
- Sort your data by clicking on one of the four headers "Date", "Vendor", "Category", and "Amount"
- Click the same table header again to toggle ascending or descending

### Filtering your data:
- You can filter your data by clicking the drop-down filter menu and selecting your method of filtering
- If the filter you apply results in an empty data frame, it will not be displayed
#### Filter by date
#### Filter by vendor
#### Filter by category
#### Filter by amount

### Deleting rows:
- You can delete a single row in your table by clicking on the red x to the very right of the row

Issues to fix:
--------------
- Allow users to "stack" filters so that they can be removed. Currently, you cannot remove a filter once it is applied. This can be circumvented by saving to cache or exporting the .csv file, but this is not very efficient.
- Slow rendering when data size becomes too large. Possibly look into react-window or react-virtualized.
