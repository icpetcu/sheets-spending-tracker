# sheets-spending-tracker
Google Apps Script to generate a sheet for tracking your spendings throughout the year.


# How to generate the sheet

1. Create a new [Apps Scripts Project](https://script.google.com/).
2. Copy the files from this repo into your project.
3. Create a Google Sheets file into your drive.
4. Copy the sheet ID from the url into the `SHEET_ID` in `Constants.gs`.
5. Update the `CATEGORIES` list in `Constants.gs` according to your needs.
6. Run the `main` function from your project (you will need to accept the permissions required by the project).
7. The sheet should now be ready to use.


# How to use the sheet

The spreadsheet file contains one `Year` sheet and 12 other identical sheets, one for each month.


The `Year` sheet contains a table with the total amounts per month and category. You **should not** input anyhting in this table, it will update automatically after you add spendings in the month sheets.


A month sheet is where you will add records of your spendings. Each record will have the following values:
  * **Day** - this is the index of the day of the month (1, 2, 3 etc.)
  * **Amount** - the transaction amount (positive value)
  * **Merchant** - the name of the merchant (any text)
  * **Category** - this will be a dropdown with the values from `CATEGORIES`
  * **Details** - any annotation you want to add for this transaction (optional)

Note that the day, merchant and details are just for your referrence. Only the amount and category will update the main sheet (`Year`).
